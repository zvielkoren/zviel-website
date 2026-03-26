import { StackPage } from "@/components/pages/stack-page";
import { SiteShell } from "@/components/site-shell";

export default function Page() {
  return (
    <SiteShell active="stack">
      <StackPage />
    </SiteShell>
  );
}
