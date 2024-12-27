import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="rounded-lg bg-card p-6 text-card-foreground shadow-lg">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Page Not Found</h2>
        </div>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-4"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}