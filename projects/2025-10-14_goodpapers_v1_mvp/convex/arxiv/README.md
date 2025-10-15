# ArXiv Integration

## Usage

### Add Paper from ArXiv

```typescript
// In frontend
const result = await addPaperFromArxiv({
  input: "https://arxiv.org/abs/2301.12345", // or just "2301.12345"
  userId: currentUserId,
});
```

Returns:
- Paper metadata (title, authors, abstract, etc.)
- `pdfStorageId` for accessing the PDF
- `paperId` if successfully added to database

### Serve PDF

PDFs are served via HTTP action:
```
https://[your-deployment].convex.site/pdf/[storageId]
```

## Supported URL Formats

- `https://arxiv.org/abs/2301.12345`
- `https://arxiv.org/pdf/2301.12345.pdf`
- `http://arxiv.org/abs/2301.12345v1`
- `2301.12345` (direct ID)

## Error Handling

- Invalid format: "Invalid ArXiv URL or ID format"
- Paper not found: "Paper not found: {arxivId}"
- Duplicate: "Paper already exists"
- Network error: Retries up to 3 times with 3s delay

## Rate Limiting

ArXiv API has rate limits (~3s between requests). The integration includes:
- Automatic retries on 429 errors
- 3-second delay between retries
- Maximum 3 retry attempts

## File Storage

PDFs are stored in Convex Storage:
- Max size: 1GB per file (more than enough for papers)
- Cached for 1 year
- CORS enabled for PDF viewers