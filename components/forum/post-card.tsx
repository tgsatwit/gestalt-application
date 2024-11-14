"use client"

import { useState } from "react"
import { ForumPost } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useComments, useForum } from "@/hooks/use-forum"
import { CommentList } from "./comment-list"
import { format } from "date-fns"
import { Heart, MessageCircle, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

interface PostCardProps {
  post: ForumPost
  isPreview?: boolean
}

export function PostCard({ post, isPreview = false }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const { comments, loading, addComment, toggleLike: toggleCommentLike } = useComments(post.id)
  const { toggleLike } = useForum()
  const { user } = useAuth()
  const hasLiked = user ? post.likes.includes(user.id) : false

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "support":
        return "bg-blue-500/10 text-blue-500"
      case "advice":
        return "bg-purple-500/10 text-purple-500"
      case "success-stories":
        return "bg-green-500/10 text-green-500"
      case "resources":
        return "bg-orange-500/10 text-orange-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  if (isPreview) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <Badge className={cn(getCategoryColor(post.category))}>
              {post.category}
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{post.authorName}</span>
            <span>•</span>
            <Badge variant="outline">{post.authorType}</Badge>
            <span>•</span>
            <span>{format(post.createdAt, "PPp")}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart className={cn("h-4 w-4", hasLiked && "fill-current text-red-500")} />
            <span>{post.likes.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </div>
          <Link href={`/dashboard/community/post/${post.id}`}>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "space-x-1",
              hasLiked && "text-red-500"
            )}
            onClick={() => toggleLike(post.id)}
          >
            <Heart className={cn("h-4 w-4", hasLiked && "fill-current")} />
            <span>{post.likes.length}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="space-x-1"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </Button>
        </div>
      </CardFooter>
      {showComments && (
        <CardContent className="pt-0">
          <CommentList
            comments={comments}
            loading={loading}
            onAddComment={addComment}
            onToggleLike={toggleCommentLike}
          />
        </CardContent>
      )}
    </Card>
  )
}