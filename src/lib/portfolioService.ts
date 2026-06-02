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

