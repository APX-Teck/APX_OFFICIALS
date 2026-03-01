"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { columns, Blog } from "./columns";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getBlogs, createBlog } from "@/lib/apiServices/blog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BlogsPage = () => {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Filters & Pagination
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Meta data
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (titleFilter.trim()) params.title = titleFilter.trim();
      if (statusFilter !== "all") params.status = statusFilter;

      const result = await getBlogs(params);

      if (result?.success) {
        setData(result.data.blogs);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } else {
        toast.error(result?.message || "Failed to load blogs data");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [titleFilter, statusFilter, page, limit]);

  useEffect(() => {
    fetchBlogs();

    const handleUpdate = () => fetchBlogs();
    window.addEventListener("blogsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("blogsUpdated", handleUpdate);
    };
  }, [fetchBlogs]);

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setPage((prev) => Math.min(prev + 1, totalPages));

  const handleCreateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await createBlog(formData);
      if (result?.success) {
        toast.success("Blog created successfully");
        setIsCreateOpen(false);
        fetchBlogs();
      } else {
        toast.error(result?.message || "Failed to create blog");
      }
    } catch (err) {
      toast.error("Error creating blog");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
            <p className="text-muted-foreground text-sm">
              Manage your articles, categories, and content publishing.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Blog Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Blog Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBlog} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="Blog Title"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="slug">Slug (optional)</Label>
                  <Input id="slug" name="slug" placeholder="custom-slug-here" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    placeholder="Write your blog content here..."
                    className="h-32"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="DRAFT">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    required
                    accept="image/*"
                  />
                </div>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create Blog"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-black p-4 rounded-md border border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Title:</span>
            <Input
              placeholder="Search by title..."
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className="w-[200px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setTitleFilter("");
              setStatusFilter("all");
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        </div>

        {loading ? (
          <div className="flex h-[30vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="rounded-md flex flex-col gap-4 bg-white dark:bg-black border border-black/10 dark:border-white/10 p-4">
            <DataTable columns={columns} data={data} />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
              <span className="text-sm text-muted-foreground">
                Showing {data.length} of {total} blogs.
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Per page</span>
                  <Select
                    value={limit.toString()}
                    onValueChange={(val) => {
                      setLimit(Number(val));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-sm font-medium px-4">
                  Page {page} of {totalPages === 0 ? 1 : totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogsPage;
