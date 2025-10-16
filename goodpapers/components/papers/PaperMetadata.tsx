"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface PaperMetadataProps {
  paper: Doc<"papers">;
}

export function PaperMetadata({ paper }: PaperMetadataProps) {
  const updatePaper = useMutation(api.papers.updatePaper);

  const [tagInput, setTagInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (
    status: "to_read" | "reading" | "completed"
  ) => {
    setIsUpdating(true);
    try {
      await updatePaper({ paperId: paper._id, readingStatus: status });
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddTag = async () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !paper.tags.includes(trimmedTag)) {
      setIsUpdating(true);
      try {
        await updatePaper({
          paperId: paper._id,
          tags: [...paper.tags, trimmedTag],
        });
        setTagInput("");
      } catch (error) {
        console.error("Failed to add tag:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    setIsUpdating(true);
    try {
      await updatePaper({
        paperId: paper._id,
        tags: paper.tags.filter((tag) => tag !== tagToRemove),
      });
    } catch (error) {
      console.error("Failed to remove tag:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "to_read":
        return "bg-blue-100 text-blue-800";
      case "reading":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "to_read":
        return "To Read";
      case "reading":
        return "Reading";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {paper.title}
        </h1>
      </div>

      {/* Authors */}
      <div>
        <p className="text-sm font-medium text-gray-700">Authors</p>
        <p className="text-sm text-gray-600 mt-1">{paper.authors.join(", ")}</p>
      </div>

      {/* Reading Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reading Status
        </label>
        <select
          value={paper.readingStatus}
          onChange={(e) =>
            handleStatusChange(
              e.target.value as "to_read" | "reading" | "completed"
            )
          }
          disabled={isUpdating}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Reading status"
        >
          <option value="to_read">To Read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>
        <div className="mt-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
              paper.readingStatus
            )}`}
          >
            {getStatusLabel(paper.readingStatus)}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {paper.tags.length > 0 ? (
            paper.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  disabled={isUpdating}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No tags yet</p>
          )}
        </div>

        {/* Add Tag Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add tag..."
            disabled={isUpdating}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            aria-label="Add tag input"
          />
          <button
            onClick={handleAddTag}
            disabled={!tagInput.trim() || isUpdating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Add tag"
          >
            Add
          </button>
        </div>
      </div>

      {/* Abstract */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Abstract</p>
        <p className="text-sm text-gray-600 leading-relaxed">{paper.abstract}</p>
      </div>

      {/* ArXiv Link */}
      <div>
        <a
          href={paper.arxivUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 underline"
        >
          View on ArXiv →
        </a>
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200">
        {paper.publishedDate && (
          <p>Published: {new Date(paper.publishedDate).toLocaleDateString()}</p>
        )}
        <p>Added: {new Date(paper._creationTime).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

