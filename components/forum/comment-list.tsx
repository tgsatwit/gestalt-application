"use client"

import { useState } from "react"
import { ForumComment } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Heart, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

interface CommentListProps {
  comments: ForumComment[]
  loading: boolean
  onAddComment: (content: string, parentCommentId?: string) => Promise<void>
  onToggleLike: (commentId: string) => Promise<void>
}

export function CommentList({
  comments,
  loading,
  onAddComment,
  onToggleLike
}: CommentListProps) {
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setSubmitting(true)
    try {
      await onAddComment(content)
      setContent("")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting || !content.trim()}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Comment
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{comment.authorName}</span>
                <Badge variant="outline">{comment.authorType}</Badge>
                <span className="text-sm text-muted-foreground">
                  {format(comment.createdAt, "PPp")}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "space-x-1",
                  user && comment.likes.includes(user.id) && "text-red-500"
                )}
                onClick={() => onToggleLike(comment.id)}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    user && comment.likes.includes(user.id) && "fill-current"
                  )}
                />
                <span>{comment.likes.length}</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pl-4 border-l-2">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}