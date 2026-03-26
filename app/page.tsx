import { OverviewPage } from "@/components/pages/overview-page";
import { SiteShell } from "@/components/site-shell";

export default function Page() {
  return (
    <SiteShell active="overview">
      <OverviewPage />
    </SiteShell>
  );
}
