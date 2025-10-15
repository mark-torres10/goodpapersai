"use client";

import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

interface PaperCardProps {
  paper: Doc<"papers">;
}

export function PaperCard({ paper }: PaperCardProps) {
  const statusColors = {
    to_read: "bg-blue-100 text-blue-800",
    reading: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Link
      href={`/paper/${paper._id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
    >
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {paper.title}
        </h3>

        {/* Authors */}
        <p className="text-sm text-gray-600 line-clamp-1">
          {paper.authors.join(", ")}
        </p>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              statusColors[paper.readingStatus]
            }`}
          >
            {formatStatus(paper.readingStatus)}
          </span>

          {/* Tags */}
          {paper.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {paper.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 rounded bg-gray-100 text-xs text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {paper.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{paper.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Abstract Preview */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {paper.abstract}
        </p>
      </div>
    </Link>
  );
}

