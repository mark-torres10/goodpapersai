// convex/types.ts
import { Doc, Id } from "./_generated/dataModel";

export type Paper = Doc<"papers">;
export type Note = Doc<"notes">;
export type User = Doc<"users">;

export type PaperId = Id<"papers">;
export type NoteId = Id<"notes">;
export type UserId = Id<"users">;

export type ReadingStatus = "to_read" | "reading" | "completed";

export type PaperWithNotes = Paper & {
  notes: Note[];
};