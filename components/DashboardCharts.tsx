"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface ChartProps {
  pieData: { name: string; value: number; fill: string }[];
  monthlyData: { name: string; user: number; service: number; blog: number }[];
  roleData: { name: string; value: number; fill: string }[];
}

export default function DashboardCharts({
  pieData,
  monthlyData,
  roleData,
}: ChartProps) {
  return (
    <div className="space-y-8 mt-8">
      {/* Monthly Area Chart for Trends */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Growth Trends
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          User, Service, and Blog creation over the past 6 months.
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorService" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBlog" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 13 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 13 }}
              />
              <RechartsTooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                itemStyle={{ color: "#374151", fontWeight: 500 }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
              <Area
                type="monotone"
                dataKey="user"
                name="Users"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorUser)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="service"
                name="Services"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorService)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="blog"
                name="Blogs"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorBlog)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution Pie/Donut Chart */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Entity Distribution
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Proportion of all platform resources by type.
          </p>
          <div className="h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={120}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      className="hover:opacity-90 transition-opacity"
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#374151", fontWeight: 500 }}
                />
                <Legend
                  iconType="circle"
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: "30px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Roles Distribution Pie/Donut Chart */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Roles Distribution
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Proportion of platform users by role mapping.
          </p>
          <div className="h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={120}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {roleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      className="hover:opacity-90 transition-opacity"
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#374151", fontWeight: 500 }}
                />
                <Legend
                  iconType="circle"
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: "30px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
