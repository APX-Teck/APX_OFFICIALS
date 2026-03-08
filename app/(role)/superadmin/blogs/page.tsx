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
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "./rich-text-editor";

const BlogsPage = () => {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [content, setContent] = useState("");

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
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }
    setCreateLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    try {
      const result = await createBlog(formData);
      if (result?.success) {
        toast.success("Blog created successfully");
        setIsCreateOpen(false);
        setContent("");
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
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold">
                  Create New Blog Post
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below to create and publish a new blog
                  post.
                </p>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-hidden">
                {/* Left side: Form */}
                <form
                  onSubmit={handleCreateBlog}
                  className="flex flex-col gap-5 overflow-y-auto pr-2 pb-16"
                >
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title" className="font-semibold text-sm">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      placeholder="Catchy Blog Title..."
                      className="border-gray-200 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="slug" className="font-semibold text-sm">
                      Slug (optional)
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="e.g. how-to-deploy-nextjs"
                      className="border-gray-200 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="status" className="font-semibold text-sm">
                      Status
                    </Label>
                    <Select name="status" defaultValue="DRAFT">
                      <SelectTrigger className="shadow-sm">
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
                    <Label
                      htmlFor="thumbnail"
                      className="font-semibold text-sm"
                    >
                      Thumbnail Image
                    </Label>
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      required
                      accept="image/*"
                      className="cursor-pointer shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2 h-full flex-grow">
                    <Label className="font-semibold text-sm">Content</Label>
                    <div className="rounded-md border bg-card text-card-foreground shadow-sm bg-white dark:bg-zinc-950 pb-16">
                      <RichTextEditor value={content} onChange={setContent} />
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex w-full sticky bottom-0 bg-background/80 backdrop-blur-sm">
                    <Button
                      type="submit"
                      disabled={createLoading}
                      className="w-full"
                    >
                      {createLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Publish Blog Post"
                      )}
                    </Button>
                  </div>
                </form>

                {/* Right side: Modern Live Preview */}
                <div className="hidden lg:flex flex-col border rounded-lg bg-zinc-50 dark:bg-zinc-900 overflow-hidden shadow-inner">
                  <div className="bg-zinc-200 dark:bg-zinc-800 p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs bg-white dark:bg-zinc-950"
                    >
                      Live Preview
                    </Badge>
                  </div>
                  <div className="p-8 overflow-y-auto w-full h-full ql-editor break-words custom-quill-preview">
                    {!content ? (
                      <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground gap-4 opacity-50">
                        <div className="i-lucide-pen-tool w-12 h-12" />
                        <p className="text-lg">
                          Start typing to see your live preview here...
                        </p>
                      </div>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    )}
                  </div>
                </div>
              </div>
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
