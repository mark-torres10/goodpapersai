"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PaperCard } from "./PaperCard";
import { Id, Doc } from "@/convex/_generated/dataModel";

interface PaperListProps {
  searchQuery?: string;
  statusFilter?: "to_read" | "reading" | "completed" | "all";
  userId: Id<"users"> | null;
}

export function PaperList({ searchQuery = "", statusFilter = "all", userId }: PaperListProps) {
  // Don't render if no user
  if (!userId) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-600">Please sign in to view your papers.</p>
      </div>
    );
  }

  return (
    <PaperListContent
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      userId={userId}
    />
  );
}

function PaperListContent({
  searchQuery,
  statusFilter,
  userId,
}: {
  searchQuery: string;
  statusFilter: "to_read" | "reading" | "completed" | "all";
  userId: Id<"users">;
}) {
  // Use search query if provided, otherwise list all papers
  const papers = useQuery(
    searchQuery ? api.papers.searchPapers : api.papers.listRecentPapers,
    searchQuery
      ? { query: searchQuery, userId: userId }
      : { userId: userId, limit: 50 }
  );

  if (papers === undefined) {
    return <PaperListSkeleton />;
  }

  // Filter by status if not "all"
  const filteredPapers =
    statusFilter === "all"
      ? papers
      : papers.filter((paper: Doc<"papers">) => paper.readingStatus === statusFilter);

  if (filteredPapers.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-600">
          {searchQuery
            ? "No papers found. Try a different search."
            : "No papers yet. Add your first paper!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPapers.map((paper: Doc<"papers">) => (
        <PaperCard key={paper._id} paper={paper} />
      ))}
    </div>
  );
}

function PaperListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-3 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

