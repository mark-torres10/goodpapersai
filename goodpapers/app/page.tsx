"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PaperList } from "@/components/papers/PaperList";
import { SearchBar } from "@/components/papers/SearchBar";
import { StatusFilter, type ReadingStatus } from "@/components/papers/StatusFilter";
import { AddPaperModal } from "@/components/papers/AddPaperModal";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReadingStatus>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Your Papers</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Paper
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={setSearchQuery} />

          {/* Status Filters */}
          <StatusFilter selected={statusFilter} onChange={setStatusFilter} />

          {/* Paper List */}
          <PaperList
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            userId={currentUser?._id ?? null}
          />

          {/* Add Paper Modal */}
          <AddPaperModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            userId={currentUser?._id ?? null}
          />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
