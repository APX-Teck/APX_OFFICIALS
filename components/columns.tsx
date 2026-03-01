"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Power, Loader2 } from "lucide-react";
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

export type User = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const UserActionCell = ({ user }: { user: User }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: user.id,
    fullName: user.fullName || "",
    email: user.email,
    phone: "",
    role: user.role,
    isActive: user.isActive,
  });

  // Fire an event so page.tsx can refetch
  const notifyRefresh = () => {
    window.dispatchEvent(new Event("usersUpdated"));
  };

  const handleEditOpen = async () => {
    setIsEditDialogOpen(true);
    setEditLoading(true);
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await fetch(`/api/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        setFormData({
          id: result.data.id,
          fullName: result.data.fullName || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          role: result.data.role || "USER",
          isActive: result.data.isActive,
        });
      } else {
        toast.error(result.error || "Failed to load user details");
        setIsEditDialogOpen(false);
      }
    } catch (e) {
      toast.error("Error loading user");
      setIsEditDialogOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaveLoading(true);
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          isActive: formData.isActive,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("User updated successfully");
        setIsEditDialogOpen(false);
        notifyRefresh();
      } else {
        toast.error(result.error || "Failed to update user");
      }
    } catch (e) {
      toast.error("Error updating user");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (confirm("Are you sure you want to toggle this user's active status?")) {
      setActionLoading(true);
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const res = await fetch(`/api/user/${user.id}/delete`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) {
          toast.success(result.message || "Status updated");
          notifyRefresh();
        } else {
          toast.error(result.error || "Failed to toggle status");
        }
      } catch (e) {
        toast.error("Error toggling status");
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
            <Edit className="mr-2 h-4 w-4" /> Edit User
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleToggleStatus}
            className="cursor-pointer"
          >
            <Power className="mr-2 h-4 w-4" /> Toggle Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.role}
                    onValueChange={(val) =>
                      setFormData({ ...formData, role: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                      <SelectItem value="SALES">Sales</SelectItem>
                      <SelectItem value="ADS_MANAGER">Ads Manager</SelectItem>
                      <SelectItem value="CLIENT">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
          )}
          <DialogFooter>
            <Button
              disabled={saveLoading || editLoading}
              onClick={handleSaveEdit}
            >
              {saveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const fullName = row.getValue("fullName") as string | null;
      return <span className="font-medium">{fullName || "N/A"}</span>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <Badge variant="outline">{role}</Badge>;
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
    header: "Date Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionCell user={row.original} />,
  },
];
