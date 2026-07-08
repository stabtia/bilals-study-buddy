import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ParentLayout } from "@/components/ParentLayout";
import { RequireParent } from "@/components/RequireParent";
import { useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/parent")({
  component: ParentShell,
  head: () => ({
    meta: [{ title: "Espace parents — Coach Bilal" }, { name: "robots", content: "noindex" }],
  }),
});

function ParentShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // La page de login n'utilise pas le layout ni la garde
  if (pathname === "/parent/login") {
    return <Outlet />;
  }
  return (
    <RequireParent>
      <ParentLayout>
        <Outlet />
      </ParentLayout>
    </RequireParent>
  );
}
