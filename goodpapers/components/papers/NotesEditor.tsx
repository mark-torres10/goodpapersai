"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface NotesEditorProps {
  paperId: Id<"papers">;
  userId: Id<"users">;
}

export function NotesEditor({ paperId, userId }: NotesEditorProps) {
  const note = useQuery(api.notes.getNotesByPaper, { paperId });
  const saveNote = useMutation(api.notes.saveNote);

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing note
  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  // Debounced auto-save
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (content && content !== note?.content) {
        setIsSaving(true);
        setSaveError(null);

        try {
          await saveNote({
            paperId,
            userId,
            content,
          });

          setLastSaved(new Date());
        } catch (error) {
          console.error("Failed to save note:", error);
          setSaveError("Failed to save note. Please try again.");
        } finally {
          setIsSaving(false);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [content, note, saveNote, paperId, userId]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500">
            {isSaving ? (
              <span className="text-indigo-600">Saving...</span>
            ) : lastSaved ? (
              `Saved at ${formatTime(lastSaved)}`
            ) : (
              ""
            )}
          </span>
          {saveError && (
            <span className="text-xs text-red-600 mt-1">{saveError}</span>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Take notes on this paper..."
        className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
        aria-label="Paper notes"
      />

      <p className="mt-2 text-xs text-gray-500">
        Markdown supported. Notes auto-save as you type.
      </p>
    </div>
  );
}

