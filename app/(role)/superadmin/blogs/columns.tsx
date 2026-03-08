"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Loader2,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { deleteBlog, updateBlog } from "@/lib/apiServices/blog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "./rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Blog = {
  id: number;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; // Assuming these statuses
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
};

const BlogActionCell = ({ blog }: { blog: Blog }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editContent, setEditContent] = useState((blog as any).content || "");

  const notifyRefresh = () => {
    window.dispatchEvent(new Event("blogsUpdated"));
  };

  const handleEditBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editContent.trim()) {
      toast.error("Content is required");
      return;
    }
    setEditLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("content", editContent);
    try {
      const result = await updateBlog(blog.id.toString(), formData);
      if (result?.success) {
        toast.success("Blog updated successfully");
        setIsEditOpen(false);
        notifyRefresh();
      } else {
        toast.error(result?.message || "Failed to update blog");
      }
    } catch (err) {
      toast.error("Error updating blog");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setActionLoading(true);
      try {
        const result = await deleteBlog(blog.id.toString());
        if (result?.success) {
          toast.success("Blog deleted successfully");
          notifyRefresh();
        } else {
          toast.error(result?.message || "Failed to delete blog");
        }
      } catch (e) {
        toast.error("Error deleting blog");
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={() => setIsEditOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Blog
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`/blogs/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <LinkIcon className="mr-2 h-4 w-4" /> View Post
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="cursor-pointer text-red-600 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Blog
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">
              Edit Blog Post
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Make changes to your blog post and save to update instantly.
            </p>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-hidden">
            {/* Left side: Form */}
            <form
              onSubmit={handleEditBlog}
              className="flex flex-col gap-5 overflow-y-auto pr-2 pb-16"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-title" className="font-semibold text-sm">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={blog.title}
                  required
                  className="border-gray-200 focus:ring-primary shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-slug" className="font-semibold text-sm">
                  Slug
                </Label>
                <Input
                  id="edit-slug"
                  name="slug"
                  defaultValue={blog.slug}
                  className="border-gray-200 focus:ring-primary shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-status" className="font-semibold text-sm">
                  Status
                </Label>
                <Select name="status" defaultValue={blog.status}>
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
                  htmlFor="edit-thumbnail"
                  className="font-semibold text-sm"
                >
                  Thumbnail (Leave blank to keep current)
                </Label>
                <Input
                  id="edit-thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              <div className="flex flex-col gap-2 h-full flex-grow">
                <Label className="font-semibold text-sm">Content</Label>
                <div className="rounded-md border bg-card text-card-foreground shadow-sm bg-white dark:bg-zinc-950 pb-16">
                  <RichTextEditor
                    value={editContent}
                    onChange={setEditContent}
                  />
                </div>
              </div>

              <div className="mt-auto pt-6 flex w-full sticky bottom-0 bg-background/80 backdrop-blur-sm">
                <Button type="submit" disabled={editLoading} className="w-full">
                  {editLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Update Blog"
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
                {!editContent ? (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground gap-4 opacity-50">
                    <div className="i-lucide-pen-tool w-12 h-12" />
                    <p className="text-lg">Content is empty...</p>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: editContent }} />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "thumbnail",
    header: "Image",
    cell: ({ row }) => {
      const thumbnailInfo = row.getValue("thumbnail") as string;
      if (!thumbnailInfo)
        return (
          <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-md" />
        );
      return (
        <img
          src={thumbnailInfo}
          alt="Thumbnail"
          className="w-12 h-12 object-cover rounded-md border border-black/10 dark:border-white/10"
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-semibold line-clamp-1 max-w-[250px]">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-1 max-w-[200px]">
        {row.getValue("slug")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      // Just some generic coloring based on general statuses
      const variant =
        status === "PUBLISHED"
          ? "default"
          : status === "ARCHIVED"
            ? "destructive"
            : "secondary";
      return <Badge variant={variant as any}>{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <BlogActionCell blog={row.original} />,
  },
];
