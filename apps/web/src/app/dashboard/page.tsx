"use client";

import React, { useState } from "react";
import { LeftSidebar } from "../../components/dashboard/LeftSidebar";
import { RightSidebar } from "../../components/dashboard/RightSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardPostGrid } from "../../components/dashboard/DashboardPostGrid";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = () => setIsLoading((prev) => !prev);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* 1. Left Sidebar Column (240px / collapsible) */}
      <LeftSidebar />

      {/* 2. Main Content Area Column */}
      <main className="flex flex-1 flex-col overflow-y-auto min-h-screen bg-[var(--muted)]">
        <DashboardHeader isLoading={isLoading} onToggleLoading={toggleLoading} />
        <DashboardPostGrid isLoading={isLoading} />
      </main>

      {/* 3. Right Sidebar Column (320px / hidden on <1280px) */}
      <RightSidebar />
    </div>
  );
}
