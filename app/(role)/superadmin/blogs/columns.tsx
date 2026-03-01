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

  const notifyRefresh = () => {
    window.dispatchEvent(new Event("blogsUpdated"));
  };

  const handleEditBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);
    const formData = new FormData(e.currentTarget);
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBlog} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={blog.title}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input id="edit-slug" name="slug" defaultValue={blog.slug} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                name="content"
                defaultValue={(blog as any).content || ""}
                required
                className="h-32"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select name="status" defaultValue={blog.status}>
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
              <Label htmlFor="edit-thumbnail">
                Thumbnail (Leave blank to keep current)
              </Label>
              <Input
                id="edit-thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
              />
            </div>
            <Button type="submit" disabled={editLoading}>
              {editLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Update Blog"
              )}
            </Button>
          </form>
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
