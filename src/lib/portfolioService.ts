import { queryD1, runD1 } from "./db";

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
    const projects = await queryD1<any>("SELECT * FROM Project");
    return projects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      githubLink: p.githubLink,
      owner: p.owner,
      ownerName: p.ownerName,
      stars: Number(p.stars),
      language: p.language,
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
      private: Boolean(p.private)
    }));
  } catch (e) {
    console.error("Failed to load projects from DB:", e);
    return [];
  }
}

export async function addProject(project: Omit<Project, "updatedAt">): Promise<Project> {
  const now = new Date().toISOString();
  await runD1(
    `INSERT INTO Project (id, name, description, githubLink, owner, ownerName, stars, language, updatedAt, private)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name=excluded.name,
       description=excluded.description,
       githubLink=excluded.githubLink,
       owner=excluded.owner,
       ownerName=excluded.ownerName,
       stars=excluded.stars,
       language=excluded.language,
       updatedAt=excluded.updatedAt,
       private=excluded.private`,
    [
      project.id,
      project.name,
      project.description,
      project.githubLink,
      project.owner,
      project.ownerName,
      project.stars,
      project.language,
      now,
      project.private ? 1 : 0
    ]
  );
  return {
    ...project,
    updatedAt: now
  };
}

export async function deleteProject(id: string): Promise<boolean> {
  return await runD1("DELETE FROM Project WHERE id = ?", [id]);
}

export async function getOrganizations(): Promise<Organization[]> {
  try {
    return await queryD1<Organization>("SELECT * FROM Organization");
  } catch (e) {
    console.error("Failed to load organizations:", e);
    return [];
  }
}

export async function addOrganization(org: Organization): Promise<Organization> {
  await runD1(
    `INSERT INTO Organization (name, mission, link, logo)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(name) DO UPDATE SET
       mission=excluded.mission,
       link=excluded.link,
       logo=excluded.logo`,
    [org.name, org.mission, org.link, org.logo]
  );
  return org;
}

export async function deleteOrganization(name: string): Promise<boolean> {
  return await runD1("DELETE FROM Organization WHERE name = ?", [name]);
}

export async function getLanguages(): Promise<Language[]> {
  try {
    const list = await queryD1<Language>("SELECT * FROM Language");
    if (list.length === 0) {
      // Seed default languages
      for (const lang of DEFAULT_LANGUAGES) {
        await runD1("INSERT INTO Language (id, name, type) VALUES (?, ?, ?)", [lang.id, lang.name, lang.type]);
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
  await runD1(
    `INSERT INTO Language (id, name, type)
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name=excluded.name,
       type=excluded.type`,
    [lang.id, lang.name, lang.type]
  );
  return lang;
}

export async function deleteLanguage(id: string): Promise<boolean> {
  return await runD1("DELETE FROM Language WHERE id = ?", [id]);
}

export async function getServices(): Promise<Service[]> {
  try {
    const list = await queryD1<any>("SELECT * FROM Service");
    if (list.length === 0) {
      // Seed default services
      for (const service of DEFAULT_SERVICES) {
        await runD1(
          "INSERT INTO Service (id, title, category, description, techs, iconName, colorClass) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            service.id,
            service.title,
            service.category,
            service.description,
            service.techs.join(","),
            service.iconName,
            service.colorClass
          ]
        );
      }
      return DEFAULT_SERVICES;
    }
    return list.map(s => ({
      id: s.id,
      title: s.title,
      category: s.category,
      description: s.description,
      techs: s.techs ? s.techs.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      iconName: s.iconName,
      colorClass: s.colorClass
    }));
  } catch (e) {
    console.error("Failed to load services:", e);
    return DEFAULT_SERVICES;
  }
}

export async function addService(service: Service): Promise<Service> {
  await runD1(
    `INSERT INTO Service (id, title, category, description, techs, iconName, colorClass)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title=excluded.title,
       category=excluded.category,
       description=excluded.description,
       techs=excluded.techs,
       iconName=excluded.iconName,
       colorClass=excluded.colorClass`,
    [
      service.id,
      service.title,
      service.category,
      service.description,
      service.techs.join(","),
      service.iconName,
      service.colorClass
    ]
  );
  return service;
}

export async function deleteService(id: string): Promise<boolean> {
  return await runD1("DELETE FROM Service WHERE id = ?", [id]);
}



