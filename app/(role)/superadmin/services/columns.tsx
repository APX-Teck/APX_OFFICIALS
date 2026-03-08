"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Loader2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Textarea } from "@/components/ui/textarea";
import { updateService, deleteService } from "@/lib/apiServices/service";

export type Service = {
  id: number;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
};

const ServiceActionCell = ({ service }: { service: Service }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: service.name,
    description: service.description,
    slug: service.slug,
    isActive: service.isActive,
    thumbnail: null as File | null,
  });

  // Fire an event so page.tsx can refetch
  const notifyRefresh = () => {
    window.dispatchEvent(new Event("servicesUpdated"));
  };

  const handleEditOpen = () => {
    setFormData({
      name: service.name,
      description: service.description,
      slug: service.slug,
      isActive: service.isActive,
      thumbnail: null,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    setSaveLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append(
        "slug",
        formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      );
      submitData.append("isActive", String(formData.isActive));
      if (formData.thumbnail) {
        submitData.append("thumbnail", formData.thumbnail);
      }

      const result = await updateService(service.id, submitData);
      if (result.success) {
        toast.success("Service updated successfully");
        setIsEditDialogOpen(false);
        notifyRefresh();
      } else {
        toast.error(result.message || "Failed to update service");
      }
    } catch (e) {
      toast.error("Error updating service");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete this service?")) {
      setActionLoading(true);
      try {
        const result = await deleteService(service.id);
        if (result.success) {
          toast.success("Service deleted successfully");
          notifyRefresh();
        } else {
          toast.error(result.message || "Failed to delete service");
        }
      } catch (e) {
        toast.error("Error deleting service");
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
          <DropdownMenuItem onClick={handleEditOpen} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> Edit Service
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="cursor-pointer text-red-600 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Service
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="auto-generated"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-thumbnail" className="text-right text-sm">
                New Thumbnail
              </Label>
              <Input
                id="edit-thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, thumbnail: file });
                }}
                className="col-span-3"
              />
            </div>
            {service.thumbnail && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3 text-xs text-muted-foreground flex items-center gap-2">
                  <span>Current:</span>
                  <img
                    src={service.thumbnail}
                    alt="current thumbnail"
                    className="h-8 w-8 object-cover rounded-md"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={String(formData.isActive)}
                  onValueChange={(val) =>
                    setFormData({ ...formData, isActive: val === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={saveLoading} onClick={handleSaveEdit}>
              {saveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "thumbnail",
    header: "Image",
    cell: ({ row }) => {
      const url = row.getValue("thumbnail") as string | null;
      if (!url)
        return (
          <div className="h-10 w-10 bg-gray-100 rounded-md border border-gray-200" />
        );
      return (
        <img
          src={url}
          alt="thumbnail"
          className="h-10 w-10 object-cover rounded-md border border-gray-200"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Service Name",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("slug")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;
      return (
        <span className="line-clamp-1 max-w-[200px]" title={desc}>
          {desc}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ServiceActionCell service={row.original} />,
  },
];
