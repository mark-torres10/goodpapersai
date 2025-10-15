import { PaperDetailView } from "@/components/papers/PaperDetailView";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

interface PaperPageProps {
  params: Promise<{
    paperId: string;
  }>;
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { paperId } = await params;
  
  return (
    <ProtectedRoute>
      <AppLayout>
        <PaperDetailView paperId={paperId} />
      </AppLayout>
    </ProtectedRoute>
  );
}

