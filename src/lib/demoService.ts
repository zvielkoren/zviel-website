import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface Demo {
  id: string;
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  fileType?: string;
  filePath?: string;
  features: string[]; 
  files: {
    name: string;
    path: string;
  }[];
}
export const config = {
  runtime: 'nodejs',
};

export interface DemoData {
  demos: Demo[];
}

// In-memory store
let demoData: DemoData = { demos: [] };

async function readDemosFile(): Promise<DemoData> {
  return demoData;
}

async function writeDemosFile(data: DemoData): Promise<void> {
  demoData = data;
}

export async function getAllDemos(): Promise<Demo[]> {
  const data = await readDemosFile();
  return data.demos;
}

export async function createDemo(demoData: Omit<Demo, 'id'>): Promise<Demo> {
  const data = await readDemosFile();
  const newDemo = {
    ...demoData,
    id: uuidv4(),
    createdAt: new Date().toISOString(), // Add creation timestamp
  };
  
  data.demos.push(newDemo);
  await writeDemosFile(data);
  return newDemo;
}

export async function updateDemo(id: string, demoData: Partial<Demo>): Promise<Demo | null> {
  const data = await readDemosFile();
  const index = data.demos.findIndex(demo => demo.id === id);
  
  if (index === -1) return null;
  
  data.demos[index] = {
    ...data.demos[index],
    ...demoData,
  };
  
  await writeDemosFile(data);
  return data.demos[index];
}

export async function deleteDemo(id: string): Promise<boolean> {
  const data = await readDemosFile();
  const initialLength = data.demos.length;
  data.demos = data.demos.filter(demo => demo.id !== id);
  
  if (data.demos.length === initialLength) return false;
  
  await writeDemosFile(data);
  return true;
}
