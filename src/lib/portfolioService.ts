import { getPrisma } from "./db";

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

const DEFAULT_LANGUAGES: Language[] = [
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

const DEFAULT_SERVICES: Service[] = [
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

export async function getProjects(): Promise<Project[]> {
  try {
    const prisma = getPrisma();
    const projects = await prisma.project.findMany();
    return projects.map(p => ({
      ...p,
      updatedAt: p.updatedAt.toISOString()
    }));
  } catch (e) {
    console.error("Failed to load projects from DB:", e);
    return [];
  }
}

export async function addProject(project: Omit<Project, "updatedAt">): Promise<Project> {
  const prisma = getPrisma();
  const updated = await prisma.project.upsert({
    where: { id: project.id },
    update: {
      name: project.name,
      description: project.description,
      githubLink: project.githubLink,
      owner: project.owner,
      ownerName: project.ownerName,
      stars: project.stars,
      language: project.language,
      private: project.private
    },
    create: {
      id: project.id,
      name: project.name,
      description: project.description,
      githubLink: project.githubLink,
      owner: project.owner,
      ownerName: project.ownerName,
      stars: project.stars,
      language: project.language,
      private: project.private
    }
  });
  return {
    ...updated,
    updatedAt: updated.updatedAt.toISOString()
  };
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const prisma = getPrisma();
    await prisma.project.delete({ where: { id } });
    return true;
  } catch (e) {
    console.error("Failed to delete project:", e);
    return false;
  }
}

export async function getOrganizations(): Promise<Organization[]> {
  try {
    const prisma = getPrisma();
    return await prisma.organization.findMany();
  } catch (e) {
    console.error("Failed to load organizations:", e);
    return [];
  }
}

export async function addOrganization(org: Organization): Promise<Organization> {
  const prisma = getPrisma();
  return await prisma.organization.upsert({
    where: { name: org.name },
    update: {
      mission: org.mission,
      link: org.link,
      logo: org.logo
    },
    create: {
      name: org.name,
      mission: org.mission,
      link: org.link,
      logo: org.logo
    }
  });
}

export async function deleteOrganization(name: string): Promise<boolean> {
  try {
    const prisma = getPrisma();
    await prisma.organization.delete({ where: { name } });
    return true;
  } catch (e) {
    console.error("Failed to delete organization:", e);
    return false;
  }
}

export async function getLanguages(): Promise<Language[]> {
  try {
    const prisma = getPrisma();
    const list = await prisma.language.findMany();
    if (list.length === 0) {
      // Seed default languages
      for (const lang of DEFAULT_LANGUAGES) {
        await prisma.language.create({ data: { id: lang.id, name: lang.name, type: lang.type } });
      }
      return DEFAULT_LANGUAGES;
    }
    return list.map(l => ({
      id: l.id,
      name: l.name,
      type: l.type as "core" | "other"
    }));
  } catch (e) {
    console.error("Failed to load languages:", e);
    return DEFAULT_LANGUAGES;
  }
}

export async function addLanguage(lang: Language): Promise<Language> {
  const prisma = getPrisma();
  const saved = await prisma.language.upsert({
    where: { id: lang.id },
    update: {
      name: lang.name,
      type: lang.type
    },
    create: {
      id: lang.id,
      name: lang.name,
      type: lang.type
    }
  });
  return {
    id: saved.id,
    name: saved.name,
    type: saved.type as "core" | "other"
  };
}

export async function deleteLanguage(id: string): Promise<boolean> {
  try {
    const prisma = getPrisma();
    await prisma.language.delete({ where: { id } });
    return true;
  } catch (e) {
    console.error("Failed to delete language:", e);
    return false;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const prisma = getPrisma();
    const list = await prisma.service.findMany();
    if (list.length === 0) {
      // Seed default services
      for (const service of DEFAULT_SERVICES) {
        await prisma.service.create({
          data: {
            id: service.id,
            title: service.title,
            category: service.category,
            description: service.description,
            techs: service.techs.join(","),
            iconName: service.iconName,
            colorClass: service.colorClass
          }
        });
      }
      return DEFAULT_SERVICES;
    }
    return list.map(s => ({
      id: s.id,
      title: s.title,
      category: s.category,
      description: s.description,
      techs: s.techs.split(",").map(t => t.trim()).filter(Boolean),
      iconName: s.iconName,
      colorClass: s.colorClass
    }));
  } catch (e) {
    console.error("Failed to load services:", e);
    return DEFAULT_SERVICES;
  }
}

export async function addService(service: Service): Promise<Service> {
  const prisma = getPrisma();
  const saved = await prisma.service.upsert({
    where: { id: service.id },
    update: {
      title: service.title,
      category: service.category,
      description: service.description,
      techs: service.techs.join(","),
      iconName: service.iconName,
      colorClass: service.colorClass
    },
    create: {
      id: service.id,
      title: service.title,
      category: service.category,
      description: service.description,
      techs: service.techs.join(","),
      iconName: service.iconName,
      colorClass: service.colorClass
    }
  });
  return {
    ...saved,
    techs: saved.techs.split(",").map(t => t.trim()).filter(Boolean)
  };
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    const prisma = getPrisma();
    await prisma.service.delete({ where: { id } });
    return true;
  } catch (e) {
    console.error("Failed to delete service:", e);
    return false;
  }
}


