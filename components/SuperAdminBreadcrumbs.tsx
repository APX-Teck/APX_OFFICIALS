"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function SuperAdminBreadcrumbs() {
  const pathname = usePathname();

  // Remove trailing slashes and split by /
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);

  // You can define custom mappings here if needed
  const routeNameMapping: Record<string, string> = {
    superadmin: "Super Admin",
    users: "Users",
    permissions: "Permissions",
    services: "Services",
    blogs: "Blogs",
    comments: "Comments",
    ads: "Ads",
    payments: "Payments",
    enquiries: "Enquiries",
    settings: "Settings",
  };

  const generateLabel = (segment: string) => {
    // Check if there is a predefined mapping
    if (routeNameMapping[segment.toLowerCase()]) {
      return routeNameMapping[segment.toLowerCase()];
    }

    // Attempt to format dynamic segments (e.g., specific IDs, slugs)
    // Replace dashes with spaces and capitalize
    const decoded = decodeURIComponent(segment).replace(/-/g, " ");
    return decoded
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");
          const label = generateLabel(segment);

          // Always add the Super Admin as the first specific styled item, but handled in map dynamically
          if (segment.toLowerCase() === "superadmin") {
            return (
              <React.Fragment key={href}>
                <BreadcrumbItem className="hidden md:block">
                  {!isLast ? (
                    <BreadcrumbLink
                      href={href}
                      className="font-semibold text-primary"
                    >
                      {label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-semibold text-primary">
                      {label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
