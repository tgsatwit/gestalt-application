"use client"

import { useState, useEffect } from "react"
import { useForum } from "@/hooks/use-forum"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreatePostDialog } from "@/components/forum/create-post-dialog"
import { PostList } from "@/components/forum/post-list"
import { Plus, Loader2 } from "lucide-react"

const categories = [
  { value: "all", label: "All Posts" },
  { value: "general", label: "General Discussion" },
  { value: "support", label: "Support" },
  { value: "advice", label: "Advice" },
  { value: "success-stories", label: "Success Stories" },
  { value: "resources", label: "Resources" },
]

export default function CommunityPage() {
  const { posts, loading, hasMore, loadPosts, createPost } = useForum()
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Load initial posts when component mounts
  useEffect(() => {
    loadPosts()
  }, [])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    loadPosts(category === "all" ? undefined : category)
  }

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Community Forum</h2>
          <p className="text-muted-foreground">
            Connect with other parents and specialists
          </p>
        </div>
        <CreatePostDialog onSubmit={createPost} />
      </div>

      <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
        <TabsList className="w-full justify-start">
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={selectedCategory}>
          <PostList 
            posts={filteredPosts} 
            emptyMessage={
              selectedCategory === "all" 
                ? "No posts yet. Be the first to start a discussion!"
                : `No posts in the ${categories.find(c => c.value === selectedCategory)?.label} category yet.`
            }
          />
          {hasMore && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => loadPosts(selectedCategory === "all" ? undefined : selectedCategory)}
              >
                Load More
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}