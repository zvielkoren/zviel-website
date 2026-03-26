export type RouteKey = "overview" | "projects" | "systems" | "stack" | "contact";

export type NavItem = {
  key: RouteKey;
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { key: "overview", label: "Overview", href: "/" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "systems", label: "Systems", href: "/systems" },
  { key: "stack", label: "Stack", href: "/stack" },
  { key: "contact", label: "Contact", href: "/contact" }
];
