"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { columns, User } from "@/components/columns";
import { getUsers } from "@/lib/apiServices/users";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const UsersPage = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.isActive = statusFilter;

      const result = await getUsers(params);
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();

    const handleUsersUpdate = () => fetchUsers();
    window.addEventListener("usersUpdated", handleUsersUpdate);

    return () => {
      window.removeEventListener("usersUpdated", handleUsersUpdate);
    };
  }, [fetchUsers]);

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground text-sm">
              Manage your application users and their roles here.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-black p-4 rounded-md border border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Role:</span>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
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

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setRoleFilter("all");
              setStatusFilter("all");
            }}
          >
            Reset Filters
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
    </>
  );
};

export default UsersPage;
