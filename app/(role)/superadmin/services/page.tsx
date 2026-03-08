"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { columns, Service } from "./columns"; // <-- Imported from relative path
import { getServices, createService } from "@/lib/apiServices/service";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";

const ServicesPage = () => {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [nameFilter, setNameFilter] = useState<string>("");
  const [descFilter, setDescFilter] = useState<string>("");

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    isActive: true,
    thumbnail: null as File | null,
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (nameFilter.trim()) params.name = nameFilter.trim();
      if (descFilter.trim()) params.description = descFilter.trim();

      const result = await getServices(params);
      if (result.success) {
        setData(result.data);
      } else {
        toast.error("Failed to load services data");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }, [nameFilter, descFilter]);

  useEffect(() => {
    fetchServices();

    const handleUpdate = () => fetchServices();
    window.addEventListener("servicesUpdated", handleUpdate);

    return () => {
      window.removeEventListener("servicesUpdated", handleUpdate);
    };
  }, [fetchServices]);

  const handleCreateOpen = () => {
    setFormData({
      name: "",
      description: "",
      slug: "",
      isActive: true,
      thumbnail: null,
    });
    setIsCreateOpen(true);
  };

  const handleSaveCreate = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Name and description are required");
      return;
    }
    if (!formData.thumbnail) {
      toast.error("Thumbnail image is required");
      return;
    }

    setCreateLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append(
        "slug",
        formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      );
      submitData.append("isActive", String(formData.isActive));
      submitData.append("thumbnail", formData.thumbnail);

      const result = await createService(submitData);
      if (result.success) {
        toast.success("Service created successfully");
        setIsCreateOpen(false);
        fetchServices();
      } else {
        // Flattened validation errors might be returned
        const errorMsg = result.error
          ? Object.values(result.error).flat().join(", ")
          : result.message;
        toast.error(errorMsg || "Failed to create service");
      }
    } catch (e) {
      toast.error("Error creating service");
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
            <h1 className="text-2xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground text-sm">
              Manage your services, descriptions, and statuses.
            </p>
          </div>
          <Button onClick={handleCreateOpen}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-black p-4 rounded-md border border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Name:</span>
            <Input
              placeholder="Search by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-[200px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Description:</span>
            <Input
              placeholder="Search description"
              value={descFilter}
              onChange={(e) => setDescFilter(e.target.value)}
              className="w-[200px]"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setNameFilter("");
              setDescFilter("");
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
          <div className="rounded-md bg-white dark:bg-black border border-black/10 dark:border-white/10 p-4">
            <DataTable columns={columns} data={data} />
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-name" className="text-right">
                Name
              </Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-slug" className="text-right">
                Slug
              </Label>
              <Input
                id="create-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="auto-generated"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-thumbnail" className="text-right text-sm">
                Thumbnail
              </Label>
              <Input
                id="create-thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, thumbnail: file });
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-isActive" className="text-right">
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
            <Button disabled={createLoading} onClick={handleSaveCreate}>
              {createLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicesPage;
