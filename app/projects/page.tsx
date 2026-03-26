import { ProjectsPage } from "@/components/pages/projects-page";
import { SiteShell } from "@/components/site-shell";

export default function Page() {
  return (
    <SiteShell active="projects">
      <ProjectsPage />
    </SiteShell>
  );
}
