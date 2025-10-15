"use client";

export type ReadingStatus = "to_read" | "reading" | "completed" | "all";

interface StatusFilterProps {
  selected: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
}

export function StatusFilter({ selected, onChange }: StatusFilterProps) {
  const statuses: { value: ReadingStatus; label: string }[] = [
    { value: "all", label: "All Papers" },
    { value: "to_read", label: "To Read" },
    { value: "reading", label: "Reading" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="flex gap-2 border-b border-gray-200">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onChange(status.value)}
          className={`px-4 py-2 font-medium transition-colors ${
            selected === status.value
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}

