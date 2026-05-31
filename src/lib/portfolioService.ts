import { getD1Client, type D1Database } from "./db";

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

// In-memory fallback persisted on globalThis
declare global {
  var __mockProjects: Project[] | undefined;
  var __mockOrganizations: Organization[] | undefined;
}

if (!globalThis.__mockProjects) {
  globalThis.__mockProjects = [];
}
if (!globalThis.__mockOrganizations) {
  globalThis.__mockOrganizations = [];
}

// Safely obtain the D1 client or return null
function safeGetD1Client() {
  try {
    return getD1Client();
  } catch (e) {
    return null;
  }
}

// Ensure database tables exist
async function ensureTables(client: D1Database) {
  try {
    await client.prepare(`
      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        githubLink TEXT,
        owner TEXT,
        ownerName TEXT,
        stars INTEGER DEFAULT 0,
        language TEXT,
        updatedAt TEXT,
        private INTEGER DEFAULT 0
      )
    `).run();

    await client.prepare(`
      CREATE TABLE IF NOT EXISTS portfolio_organizations (
        name TEXT PRIMARY KEY,
        mission TEXT,
        link TEXT,
        logo TEXT
      )
    `).run();
  } catch (e) {
    console.error("Failed to ensure D1 tables exist:", e);
  }
}

export async function getProjects(): Promise<Project[]> {
  const client = safeGetD1Client();
  if (client) {
    await ensureTables(client);
    try {
      const { results } = await client.prepare("SELECT * FROM portfolio_projects").all();
      return results.map((row: any) => ({
        ...row,
        private: Boolean(row.private)
      }));
    } catch (e) {
      console.error("D1 getProjects error:", e);
    }
  }
  return globalThis.__mockProjects || [];
}

export async function addProject(project: Omit<Project, "updatedAt">): Promise<Project> {
  const newProject: Project = {
    ...project,
    updatedAt: new Date().toISOString()
  };

  const client = safeGetD1Client();
  if (client) {
    await ensureTables(client);
    try {
      await client.prepare(`
        INSERT OR REPLACE INTO portfolio_projects (id, name, description, githubLink, owner, ownerName, stars, language, updatedAt, private)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newProject.id,
        newProject.name,
        newProject.description,
        newProject.githubLink,
        newProject.owner,
        newProject.ownerName,
        newProject.stars,
        newProject.language,
        newProject.updatedAt,
        newProject.private ? 1 : 0
      ).run();
      return newProject;
    } catch (e) {
      console.error("D1 addProject error:", e);
    }
  }

  // Fallback
  const index = globalThis.__mockProjects!.findIndex(p => p.id === newProject.id);
  if (index >= 0) {
    globalThis.__mockProjects![index] = newProject;
  } else {
    globalThis.__mockProjects!.push(newProject);
  }
  return newProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const client = safeGetD1Client();
  if (client) {
    await ensureTables(client);
    try {
      await client.prepare("DELETE FROM portfolio_projects WHERE id = ?").bind(id).run();
      return true;
    } catch (e) {
      console.error("D1 deleteProject error:", e);
      return false;
    }
  }

  // Fallback
  const lenBefore = globalThis.__mockProjects!.length;
  globalThis.__mockProjects = globalThis.__mockProjects!.filter(p => p.id !== id);
  return globalThis.__mockProjects.length < lenBefore;
}

export async function getOrganizations(): Promise<Organization[]> {
  const client = safeGetD1Client();
  if (client) {
    await ensureTables(client);
    try {
      const { results } = await client.prepare("SELECT * FROM portfolio_organizations").all<Organization>();
      return results;
    } catch (e) {
      console.error("D1 getOrganizations error:", e);
    }
  }
  return globalThis.__mockOrganizations || [];
}

export async function addOrganization(org: Organization): Promise<Organization> {
  const client = safeGetD1Client();
  if (client) {
    await ensureTables(client);
    try {
      await client.prepare(`
        INSERT OR REPLACE INTO portfolio_organizations (name, mission, link, logo)
        VALUES (?, ?, ?, ?)
      `).bind(org.name, org.mission, org.link, org.logo).run();
      return org;
    } catch (e) {
      console.error("D1 addOrganization error:", e);
    }
  }

  // Fallback
  const index = globalThis.__mockOrganizations!.findIndex(o => o.name.toLowerCase() === org.name.toLowerCase());
  if (index >= 0) {
    globalThis.__mockOrganizations![index] = org;
  } else {
    globalThis.__mockOrganizations!.push(org);
  }
  return org;
}

export async function deleteOrganization(name: string): Promise<boolean> {
  const client = safeGetD1Client();
  if (client) {
    await ensureTables(client);
    try {
      await client.prepare("DELETE FROM portfolio_organizations WHERE name = ?").bind(name).run();
      return true;
    } catch (e) {
      console.error("D1 deleteOrganization error:", e);
      return false;
    }
  }

  // Fallback
  const lenBefore = globalThis.__mockOrganizations!.length;
  globalThis.__mockOrganizations = globalThis.__mockOrganizations!.filter(o => o.name.toLowerCase() !== name.toLowerCase());
  return globalThis.__mockOrganizations.length < lenBefore;
}
