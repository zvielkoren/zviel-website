import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DEMOS_FILE = path.join(process.cwd(), 'src', 'data', 'demos.json');

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
  runtime: 'nodejs', // Add this line
};

export interface DemoData {
  demos: Demo[];
}

async function readDemosFile(): Promise<DemoData> {
  try {
    const data = await fs.readFile(DEMOS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { demos: [] };
  }
}

async function writeDemosFile(data: DemoData): Promise<void> {
  await fs.writeFile(DEMOS_FILE, JSON.stringify(data, null, 2));
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
