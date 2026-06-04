// D1 database functionality removed for Edge compatibility

export interface Project {
  id: string;
  name: string;
  description: string;
  githubLink: string;
  owner: string;
  ownerName: string;
  stars: number;
  language: string;
  updatedAt: string;
  private: boolean;
}

export interface Organization {
  name: string;
  mission: string;
  link: string;
  logo: string;
}

export interface Language {
  id: string;
  name: string;
  type: "core" | "other";
}

export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  techs: string[];
  iconName: string;
  colorClass: string;
}

// In-memory fallback persisted on globalThis
declare global {
  var __mockProjects: Project[] | undefined;
  var __mockOrganizations: Organization[] | undefined;
  var __mockLanguages: Language[] | undefined;
  var __mockServices: Service[] | undefined;
}

if (!globalThis.__mockProjects) {
  globalThis.__mockProjects = [];
}
if (!globalThis.__mockOrganizations) {
  globalThis.__mockOrganizations = [];
}
if (!globalThis.__mockLanguages) {
  globalThis.__mockLanguages = [
    { id: "typescript", name: "TypeScript", type: "core" },
    { id: "java", name: "Java", type: "core" },
    { id: "python", name: "Python", type: "core" },
    { id: "sql", name: "SQL", type: "core" },
    { id: "rust", name: "Rust", type: "core" },
    { id: "javascript", name: "JavaScript", type: "other" },
    { id: "nextjs", name: "Next.js", type: "other" },
    { id: "csharp", name: "C#", type: "other" },
    { id: "nodejs", name: "Node.js", type: "other" },
    { id: "kotlin", name: "Kotlin", type: "other" },
    { id: "react", name: "React", type: "other" },
    { id: "docker", name: "Docker", type: "other" },
    { id: "git", name: "Git", type: "other" }
  ];
}
if (!globalThis.__mockServices) {
  globalThis.__mockServices = [
    {
      id: "full-stack-web-apps",
      title: "Full-Stack Web Applications",
      category: "Frontend & Logic",
      description: "Engineering beautiful, highly responsive frontend interfaces backed by fast logical layers. Designed with type-safety and modern performance patterns.",
      techs: ["Next.js", "React", "TypeScript", "Tailwind CSS v4", "HeroUI"],
      iconName: "FaCode",
      colorClass: "from-cyan-400 to-teal-400 text-cyan-400"
    },
    {
      id: "backend-cloud-arch",
      title: "Backend & Cloud Architecture",
      category: "Infrastructure & APIs",
      description: "Designing robust, highly concurrent backend systems, microservices, and database schemas. Optimized for rapid scaling and serverless edge runtimes.",
      techs: ["Node.js", "Rust", "Python", "SQL / NoSQL", "Docker", "Serverless Edge"],
      iconName: "FaServer",
      colorClass: "from-indigo-400 to-cyan-400 text-indigo-400"
    },
    {
      id: "ai-agentic-orchestration",
      title: "AI & Agentic Orchestration",
      category: "Intelligence & Automations",
      description: "Integrating intelligent LLM functions into modern business logic. Constructing stateful, tool-enabled autonomous agents and scalable pipelines.",
      techs: ["Gemini API", "LangChain", "Autonomous Workflows", "Structured JSON Outputs"],
      iconName: "FaBrain",
      colorClass: "from-purple-400 to-indigo-400 text-purple-400"
    },
    {
      id: "dev-tooling-systems",
      title: "Developer Tooling & Systems",
      category: "Performance & DX",
      description: "Creating premium developer tools, hand-written compiler pipelines, performance-tuned CLI engines, and isolated helper scripts to optimize team productivity.",
      techs: ["Rust", "Python", "Compiler Design", "Bash scripting", "Automation"],
      iconName: "FaWrench",
      colorClass: "from-teal-400 to-purple-400 text-teal-400"
    }
  ];
}

// Safely obtain the D1 client or return null
// D1 client helpers removed; using only in-memory mock data

// Ensure database tables exist
// Table creation not needed for mock data

export async function getProjects(): Promise<Project[]> {
  // Return mock projects only; D1 not used in Edge runtime
  return globalThis.__mockProjects || [];
}

export async function addProject(project: Omit<Project, "updatedAt">): Promise<Project> {
  const newProject: Project = {
    ...project,
    updatedAt: new Date().toISOString()
  };
  // Store in mock array only
  const index = globalThis.__mockProjects!.findIndex(p => p.id === newProject.id);
  if (index >= 0) {
    globalThis.__mockProjects![index] = newProject;
  } else {
    globalThis.__mockProjects!.push(newProject);
  }
  return newProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  // Remove from mock array only
  const lenBefore = globalThis.__mockProjects!.length;
  globalThis.__mockProjects = globalThis.__mockProjects!.filter(p => p.id !== id);
  return globalThis.__mockProjects.length < lenBefore;
}

export async function getOrganizations(): Promise<Organization[]> {
  // Return mock organizations only; D1 not used
  return globalThis.__mockOrganizations || [];
}

export async function addOrganization(org: Organization): Promise<Organization> {
  // Store in mock array only
  const index = globalThis.__mockOrganizations!.findIndex(o => o.name.toLowerCase() === org.name.toLowerCase());
  if (index >= 0) {
    globalThis.__mockOrganizations![index] = org;
  } else {
    globalThis.__mockOrganizations!.push(org);
  }
  return org;
}

export async function deleteOrganization(name: string): Promise<boolean> {
  // Remove from mock array only
  const lenBefore = globalThis.__mockOrganizations!.length;
  globalThis.__mockOrganizations = globalThis.__mockOrganizations!.filter(o => o.name.toLowerCase() !== name.toLowerCase());
  return globalThis.__mockOrganizations.length < lenBefore;
}

export async function getLanguages(): Promise<Language[]> {
  return globalThis.__mockLanguages || [];
}

export async function addLanguage(lang: Language): Promise<Language> {
  const index = globalThis.__mockLanguages!.findIndex(l => l.id.toLowerCase() === lang.id.toLowerCase());
  if (index >= 0) {
    globalThis.__mockLanguages![index] = lang;
  } else {
    globalThis.__mockLanguages!.push(lang);
  }
  return lang;
}

export async function deleteLanguage(id: string): Promise<boolean> {
  const lenBefore = globalThis.__mockLanguages!.length;
  globalThis.__mockLanguages = globalThis.__mockLanguages!.filter(l => l.id.toLowerCase() !== id.toLowerCase());
  return globalThis.__mockLanguages.length < lenBefore;
}

export async function getServices(): Promise<Service[]> {
  return globalThis.__mockServices || [];
}

export async function addService(service: Service): Promise<Service> {
  const index = globalThis.__mockServices!.findIndex(s => s.id.toLowerCase() === service.id.toLowerCase());
  if (index >= 0) {
    globalThis.__mockServices![index] = service;
  } else {
    globalThis.__mockServices!.push(service);
  }
  return service;
}

export async function deleteService(id: string): Promise<boolean> {
  const lenBefore = globalThis.__mockServices!.length;
  globalThis.__mockServices = globalThis.__mockServices!.filter(s => s.id.toLowerCase() !== id.toLowerCase());
  return globalThis.__mockServices.length < lenBefore;
}


