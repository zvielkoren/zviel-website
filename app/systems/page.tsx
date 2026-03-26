import { SystemsPage } from "@/components/pages/systems-page";
import { SiteShell } from "@/components/site-shell";

export default function Page() {
  return (
    <SiteShell active="systems">
      <SystemsPage />
    </SiteShell>
  );
}
