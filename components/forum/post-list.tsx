"use client"

import { ForumPost } from "@/lib/types"
import { PostCard } from "./post-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface PostListProps {
  posts: ForumPost[]
  emptyMessage?: string
}

export function PostList({ posts, emptyMessage = "No posts yet." }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {posts.map((post) => (
        <AccordionItem key={post.id} value={post.id} className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <PostCard post={post} isPreview />
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 pb-4">
              <PostCard post={post} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}