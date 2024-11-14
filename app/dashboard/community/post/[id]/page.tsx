"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ForumPost } from "@/lib/types"
import { PostCard } from "@/components/forum/post-card"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Loader2 } from "lucide-react"

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const docRef = doc(db, "forumPosts", id as string)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setPost({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toDate(),
            updatedAt: docSnap.data().updatedAt?.toDate()
          } as ForumPost)
        }
      } catch (error) {
        console.error("Error loading post:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Post not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Community", href: "/dashboard/community" },
          { label: post.title }
        ]}
      />
      <PostCard post={post} />
    </div>
  )
}