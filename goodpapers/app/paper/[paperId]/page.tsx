import { PaperDetailView } from "@/components/papers/PaperDetailView";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

interface PaperPageProps {
  params: {
    paperId: string;
  };
}

export default function PaperPage({ params }: PaperPageProps) {
  return (
    <ProtectedRoute>
      <AppLayout>
        <PaperDetailView paperId={params.paperId} />
      </AppLayout>
    </ProtectedRoute>
  );
}

