import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Celebration } from "../components/Celebration";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-2">🦊</div>
        <h1 className="text-5xl font-bold">Oups !</h1>
        <p className="mt-2 text-muted-foreground">Cette page n'existe pas.</p>
        <Link to="/" className="btn-big inline-flex mt-6 bg-primary text-primary-foreground">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Ça a coincé…</h1>
        <p className="mt-2 text-sm text-muted-foreground">Essaie encore, tu vas y arriver 💪</p>
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-big bg-primary text-primary-foreground"
          >Réessayer</button>
          <a href="/" className="btn-big border border-input bg-background">Accueil</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Coach Bilal — Mon soutien scolaire" },
      { name: "description", content: "Une routine simple et motivante pour progresser en 6e/5e : maths, français, sciences, anglais." },
      { name: "author", content: "Coach Bilal" },
      { property: "og:title", content: "Coach Bilal — Mon soutien scolaire" },
      { property: "og:description", content: "Une routine simple et motivante pour progresser en 6e/5e : maths, français, sciences, anglais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Coach Bilal — Mon soutien scolaire" },
      { name: "twitter:description", content: "Une routine simple et motivante pour progresser en 6e/5e : maths, français, sciences, anglais." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/147cd984-3ca8-42c1-8d70-e55e97f4c785/id-preview-0b3c2d28--4ef12718-4f8d-4dfc-a515-655ad05f89d4.lovable.app-1783535160159.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/147cd984-3ca8-42c1-8d70-e55e97f4c785/id-preview-0b3c2d28--4ef12718-4f8d-4dfc-a515-655ad05f89d4.lovable.app-1783535160159.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Celebration />
    </QueryClientProvider>
  );
}
