"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PDFViewer } from "./PDFViewer";
import { NotesEditor } from "./NotesEditor";
import { PaperMetadata } from "./PaperMetadata";
import Link from "next/link";

interface PaperDetailViewProps {
  paperId: string;
}

export function PaperDetailView({ paperId }: PaperDetailViewProps) {
  const paper = useQuery(api.papers.getPaper, {
    paperId: paperId as Id<"papers">,
  });

  const currentUser = useQuery(api.users.getCurrentUser);

  if (paper === undefined || currentUser === undefined) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto" />
          <p className="text-gray-600 mt-4">Loading paper...</p>
        </div>
      </div>
    );
  }

  if (paper === null || !paper) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-gray-900">Paper not found</h2>
          <p className="text-gray-600 mt-2">
            This paper doesn&apos;t exist or you don&apos;t have access.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Authentication required</h2>
          <p className="text-gray-600 mt-2">Please sign in to view this paper.</p>
        </div>
      </div>
    );
  }

  // Construct PDF URL from storage ID
  const pdfUrl = `https://impartial-wolf-773.convex.site/pdf/${paper.pdfStorageId}`;

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* PDF Viewer (Left, 2 columns) */}
        <div className="lg:col-span-2 h-full">
          <PDFViewer pdfUrl={pdfUrl} />
        </div>

        {/* Sidebar (Right, 1 column) */}
        <div className="flex flex-col gap-6 overflow-y-auto h-full bg-white rounded-lg border border-gray-200 p-6">
          {/* Paper Metadata */}
          <PaperMetadata paper={paper} />

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Notes Editor */}
          <div className="flex-1">
            <NotesEditor paperId={paper._id} userId={currentUser._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

