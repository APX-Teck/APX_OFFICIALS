import React from "react";
import prisma from "@/lib/prisma";
import DashboardCharts from "@/components/DashboardCharts";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboard() {
  // Fetch real-time aggregations from Prisma
  const usersCount = await prisma.user.count();
  const servicesCount = await prisma.service.count();
  const blogsCount = await prisma.blogPost.count();

  const roleDistribution = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      role: true,
    },
  });

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "#ef4444", // red
    ADMIN: "#f97316", // orange
    EDITOR: "#8b5cf6", // violet
    SALES: "#eab308", // yellow
    ADS_MANAGER: "#06b6d4", // cyan
    CLIENT: "#22c55e", // green
    USER: "#3b82f6", // blue
  };

  const roleData = roleDistribution.map((item) => ({
    name: item.role.replace(/_/g, " "),
    value: item._count.role,
    fill: roleColors[item.role] || "#94a3b8",
  }));

  // Prepare recent 6 months data range
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  // Fetch created data for the last 6 months
  const [users, services, blogs] = await Promise.all([
    prisma.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.service.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.blogPost.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
  ]);

  // Aggregate data by month
  const monthsData: Record<
    string,
    { name: string; user: number; service: number; blog: number }
  > = {};
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString("en-US", { month: "short" });
    monthsData[monthName] = { name: monthName, user: 0, service: 0, blog: 0 };
  }

  const getMonthName = (d: Date) =>
    d.toLocaleString("en-US", { month: "short" });

  users.forEach((u) => {
    const m = getMonthName(u.createdAt);
    if (monthsData[m]) monthsData[m].user++;
  });
  services.forEach((s) => {
    const m = getMonthName(s.createdAt);
    if (monthsData[m]) monthsData[m].service++;
  });
  blogs.forEach((b) => {
    const m = getMonthName(b.createdAt);
    if (monthsData[m]) monthsData[m].blog++;
  });

  // Keep strictly chronological (reverse as we gathered from modern to past)
  const monthlyData = Object.values(monthsData).reverse();

  // Prepare pie chart distribution dataset
  const pieData = [
    { name: "Users", value: usersCount, fill: "#3b82f6" },
    { name: "Services", value: servicesCount, fill: "#10b981" },
    { name: "Blogs", value: blogsCount, fill: "#f59e0b" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor your platform's growth and data distribution.
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Users" value={usersCount} color="bg-blue-500" />
        <StatsCard
          title="Total Services"
          value={servicesCount}
          color="bg-emerald-500"
        />
        <StatsCard
          title="Total Blogs"
          value={blogsCount}
          color="bg-amber-500"
        />
      </div>

      {/* Render Dynamic Charts Component */}
      <DashboardCharts
        pieData={pieData}
        monthlyData={monthlyData}
        roleData={roleData}
      />
    </div>
  );
}

function StatsCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-6 flex flex-col justify-center space-y-4 transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-center space-x-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${color} shadow-lg shadow-${color.replace("bg-", "")}/30 group-hover:scale-110 transition-transform duration-300`}
        >
          <span className="text-2xl font-black">{title[6] || "A"}</span>
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
            {title}
          </h3>
          <p className="text-3xl font-extrabold text-gray-800 tracking-tight mt-1">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
