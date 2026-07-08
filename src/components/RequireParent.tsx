import { useEffect, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { useParentMode } from "@/lib/auth";

export function RequireParent({ children }: { children: ReactNode }) {
  const isParent = useParentMode();
  const router = useRouter();
  useEffect(() => {
    if (!isParent) router.navigate({ to: "/parent/login" });
  }, [isParent, router]);
  if (!isParent) return null;
  return <>{children}</>;
}
