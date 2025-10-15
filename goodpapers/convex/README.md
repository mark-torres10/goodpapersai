# Goodpapers Convex Backend

## Schema

### Papers
- Core paper metadata from ArXiv
- Reading status tracking
- Tags for organization
- Timestamps for sorting

### Notes
- Paper-level markdown notes
- One note per paper (V1)

### Users
- User profiles from Convex Auth
- Multi-user support (future)

## Queries

### `papers.listRecentPapers`
Get last N modified papers for a user.

**Arguments:**
- `userId` (id): User ID
- `limit` (optional number): Number of papers to return (default: 10)

**Returns:** Array of Paper objects sorted by updatedAt (most recent first)

### `papers.listPapers`
Get all papers for a user with optional filtering.

**Arguments:**
- `userId` (id): User ID
- `status` (optional): Filter by reading status ("to_read", "reading", "completed")
- `tag` (optional string): Filter by tag

**Returns:** Array of Paper objects sorted by updatedAt (most recent first)

### `papers.getPaper`
Get a single paper by ID.

**Arguments:**
- `paperId` (id): Paper ID

**Returns:** Paper object or null if not found

### `papers.getPaperByArxivId`
Get paper by ArXiv ID for duplicate checking.

**Arguments:**
- `arxivId` (string): ArXiv ID
- `userId` (id): User ID

**Returns:** Paper object or null if not found

### `papers.searchPapers`
Full-text search across title, authors, abstract.

**Arguments:**
- `userId` (id): User ID
- `query` (string): Search query

**Returns:** Array of up to 20 Paper objects matching the search

### `notes.getNotesByPaper`
Get note for a specific paper.

**Arguments:**
- `paperId` (id): Paper ID

**Returns:** Note object or null if no note exists

## Mutations

### `papers.createPaper`
Add new paper (prevents duplicates by arxivId).

**Arguments:**
- `userId` (id): User ID
- `title` (string): Paper title
- `authors` (array): Array of author names
- `abstract` (string): Paper abstract
- `arxivId` (string): ArXiv ID
- `arxivUrl` (string): ArXiv URL
- `pdfUrl` (string): PDF URL
- `publishedDate` (optional string): Publication date
- `pdfStorageId` (optional id): Convex storage ID

**Returns:** Paper ID

**Throws:** Error if paper with same arxivId already exists for user

### `papers.updatePaper`
Update reading status and tags.

**Arguments:**
- `paperId` (id): Paper ID
- `readingStatus` (optional): New reading status
- `tags` (optional array): New tags array

**Returns:** Paper ID

### `papers.deletePaper`
Delete paper and associated notes.

**Arguments:**
- `paperId` (id): Paper ID

**Returns:** { success: true }

### `notes.saveNote`
Create or update note for a paper.

**Arguments:**
- `paperId` (id): Paper ID
- `userId` (id): User ID
- `content` (string): Markdown content

**Returns:** Note ID

### `notes.deleteNote`
Delete a note.

**Arguments:**
- `noteId` (id): Note ID

**Returns:** { success: true }

## Testing

Run `npm run build` to verify TypeScript compilation.

For full testing, use Convex dashboard:
1. Go to: https://dashboard.convex.dev
2. Select project: impartial-wolf-773
3. Navigate to Functions tab
4. Test queries and mutations with sample data

## Performance Notes

- All queries use proper indexes for fast lookups
- Search uses Convex's built-in full-text search
- Duplicate prevention implemented via unique indexes
- Reading status and tags updates are atomic