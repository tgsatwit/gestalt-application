"use client"

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, startAfter, getDocs, addDoc, updateDoc, doc, arrayUnion, arrayRemove, Timestamp, where, increment, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ForumPost, ForumComment } from '@/lib/types'
import { useAuth } from './use-auth'
import { toast } from 'sonner'

const POSTS_PER_PAGE = 10

export function useComments(postId: string) {
  const [comments, setComments] = useState<ForumComment[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadComments = async () => {
      try {
        const commentsRef = collection(db, 'forumComments')
        const q = query(
          commentsRef,
          where('postId', '==', postId),
          orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(q)
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as ForumComment[]

        setComments(commentsData)
      } catch (error) {
        console.error("Error loading comments:", error)
        toast.error("Failed to load comments")
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [postId])

  const addComment = async (content: string, parentCommentId?: string) => {
    if (!user) {
      toast.error("You must be logged in to comment")
      return
    }

    try {
      const timestamp = Timestamp.fromDate(new Date())
      const commentData = {
        postId,
        content,
        authorId: user.id,
        authorName: user.name,
        authorType: user.userType,
        parentCommentId,
        likes: [],
        createdAt: timestamp,
        updatedAt: timestamp
      }

      // Add comment
      const commentRef = await addDoc(collection(db, 'forumComments'), commentData)

      // Update post comment count
      const postRef = doc(db, 'forumPosts', postId)
      await updateDoc(postRef, {
        commentCount: increment(1),
        updatedAt: timestamp
      })

      // Add to local state
      const newComment = {
        id: commentRef.id,
        ...commentData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setComments(prev => [newComment, ...prev])

      // Send notification to post author
      const postSnap = await getDoc(postRef)
      if (postSnap.exists() && postSnap.data().authorId !== user.id) {
        await addDoc(collection(db, 'notifications'), {
          userId: postSnap.data().authorId,
          type: 'post_comment',
          title: 'New Comment on Your Post',
          message: `${user.name} commented on your post`,
          read: false,
          createdAt: timestamp,
          actionUrl: `/dashboard/community/post/${postId}`,
          metadata: {
            postId,
            commentId: commentRef.id,
            userId: user.id
          }
        })
      }

      toast.success("Comment added successfully")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    }
  }

  const toggleLike = async (commentId: string) => {
    if (!user) {
      toast.error("You must be logged in to like comments")
      return
    }

    try {
      const commentRef = doc(db, 'forumComments', commentId)
      const commentSnap = await getDoc(commentRef)
      
      if (!commentSnap.exists()) {
        toast.error("Comment not found")
        return
      }

      const commentData = commentSnap.data()
      const timestamp = Timestamp.fromDate(new Date())
      const isLiked = commentData.likes.includes(user.id)

      // Update comment
      await updateDoc(commentRef, {
        likes: isLiked ? arrayRemove(user.id) : arrayUnion(user.id),
        updatedAt: timestamp
      })

      // Update local state
      setComments(prev => prev.map(c => {
        if (c.id === commentId) {
          const newLikes = isLiked
            ? c.likes.filter(id => id !== user.id)
            : [...c.likes, user.id]
          return { ...c, likes: newLikes }
        }
        return c
      }))

      // Send notification if adding like
      if (!isLiked && commentData.authorId !== user.id) {
        await addDoc(collection(db, 'notifications'), {
          userId: commentData.authorId,
          type: 'comment_like',
          title: 'New Like on Your Comment',
          message: `${user.name} liked your comment`,
          read: false,
          createdAt: timestamp,
          actionUrl: `/dashboard/community/post/${postId}`,
          metadata: {
            postId,
            commentId,
            userId: user.id
          }
        })
      }
    } catch (error) {
      console.error("Error toggling comment like:", error)
      toast.error("Failed to update like")
    }
  }

  return {
    comments: comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    loading,
    addComment,
    toggleLike
  }
}

export function useForum() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const { user } = useAuth()

  const loadPosts = async (category?: string) => {
    try {
      setLoading(true)
      const postsRef = collection(db, 'forumPosts')
      let q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE)
      )

      if (category && category !== 'all') {
        q = query(
          postsRef,
          where('category', '==', category),
          orderBy('createdAt', 'desc'),
          limit(POSTS_PER_PAGE)
        )
      }

      if (lastVisible) {
        q = query(
          postsRef,
          category && category !== 'all' ? where('category', '==', category) : where('category', '!=', null),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(POSTS_PER_PAGE)
        )
      }

      const snapshot = await getDocs(q)
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as ForumPost[]

      if (!lastVisible) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }

      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE)
    } catch (error) {
      console.error("Error loading posts:", error)
      toast.error("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (data: Omit<ForumPost, 'id' | 'authorId' | 'authorName' | 'authorType' | 'likes' | 'commentCount' | 'createdAt'>) => {
    if (!user) {
      toast.error("You must be logged in to create posts")
      return
    }

    try {
      const timestamp = Timestamp.fromDate(new Date())
      const postRef = await addDoc(collection(db, 'forumPosts'), {
        ...data,
        authorId: user.id,
        authorName: user.name,
        authorType: user.userType,
        likes: [],
        commentCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp
      })

      // Add the new post to the local state
      const newPost = {
        id: postRef.id,
        ...data,
        authorId: user.id,
        authorName: user.name,
        authorType: user.userType,
        likes: [],
        commentCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setPosts(prev => [newPost, ...prev])

      toast.success("Post created successfully")
      return postRef.id
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post")
    }
  }

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast.error("You must be logged in to like posts")
      return
    }

    try {
      const postRef = doc(db, 'forumPosts', postId)
      const postSnap = await getDoc(postRef)
      
      if (!postSnap.exists()) {
        toast.error("Post not found")
        return
      }

      const postData = postSnap.data()
      const timestamp = Timestamp.fromDate(new Date())
      const isLiked = postData.likes.includes(user.id)

      // Update the post in Firestore
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(user.id) : arrayUnion(user.id),
        updatedAt: timestamp
      })

      // Update local state
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const newLikes = isLiked
            ? p.likes.filter(id => id !== user.id)
            : [...p.likes, user.id]
          return { ...p, likes: newLikes }
        }
        return p
      }))

      // Send notification if not liking own post and adding a like
      if (!isLiked && postData.authorId !== user.id) {
        await addDoc(collection(db, 'notifications'), {
          userId: postData.authorId,
          type: 'post_like',
          title: 'New Like on Your Post',
          message: `${user.name} liked your post "${postData.title}"`,
          read: false,
          createdAt: timestamp,
          actionUrl: `/dashboard/community/post/${postId}`,
          metadata: {
            postId,
            userId: user.id
          }
        })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update like")
    }
  }

  return {
    posts,
    loading,
    hasMore,
    loadPosts,
    createPost,
    toggleLike
  }
}