import { ContactPage } from "@/components/pages/contact-page";
import { SiteShell } from "@/components/site-shell";

export default function Page() {
  return (
    <SiteShell active="contact">
      <ContactPage />
    </SiteShell>
  );
}
