-- Create Project table
CREATE TABLE IF NOT EXISTS Project (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  githubLink TEXT NOT NULL,
  owner TEXT NOT NULL,
  ownerName TEXT NOT NULL,
  stars INTEGER NOT NULL,
  language TEXT NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  private INTEGER NOT NULL
);

-- Create Organization table
CREATE TABLE IF NOT EXISTS Organization (
  name TEXT PRIMARY KEY,
  mission TEXT NOT NULL,
  link TEXT NOT NULL,
  logo TEXT NOT NULL
);

-- Create Language table
CREATE TABLE IF NOT EXISTS Language (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL
);

-- Create Service table
CREATE TABLE IF NOT EXISTS Service (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  techs TEXT NOT NULL,
  iconName TEXT NOT NULL,
  colorClass TEXT NOT NULL
);
