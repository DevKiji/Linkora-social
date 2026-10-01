"use client";

import React, { useState } from "react";

interface DashboardHeaderProps {
  isLoading: boolean;
  onToggleLoading: () => void;
}

const subNavTabs = ["Cont rives", "F0A8200", "Mycontonts", "Deshlohns"];

export function DashboardHeader({ isLoading, onToggleLoading }: DashboardHeaderProps) {
  const [activeTab, setActiveTab] = useState("Cont rives");

  return (
    <header className="flex flex-col gap-4 border-b border-[var(--border)] bg-[var(--background)] px-6 pb-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Daskloode
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Explore community updates, Stellar Soroban posts, and custom content streams.
          </p>
        </div>

        {/* Skeleton Toggle & Create Action */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleLoading}
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-violet-500/60 hover:text-violet-400"
          >
            {isLoading ? "Show Posts" : "Skeleton View"}
          </button>
          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-blue-400 to-indigo-400 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-400/20 transition-opacity hover:opacity-90"
          >
            + Create Post
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <nav className="flex gap-2 overflow-x-auto" aria-label="Dashboard tabs">
        {subNavTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "border border-violet-400 bg-[var(--muted)] font-semibold text-violet-400"
                  : "border border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {tab}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
