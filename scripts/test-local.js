const { spawn } = require('child_process');
const http = require('http');

const PORT = 3009;
const BASE_URL = `http://localhost:${PORT}`;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to poll the server until it's ready
async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`${BASE_URL}/`, (res) => {
          resolve();
        });
        req.on('error', reject);
        req.end();
      });
      console.log('Server is ready and listening.');
      return true;
    } catch (e) {
      await wait(1000);
    }
  }
  throw new Error('Server failed to start in time.');
}

async function runTests() {
  console.log('Starting Next.js dev server...');
  const devServer = spawn('npx', ['next', 'dev', '-p', String(PORT)], {
    cwd: '/home/zviel/Documents/Projects/zviel-website',
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore'
  });

  let testsPassed = true;

  try {
    await waitForServer();

    // Setup: POST a test project
    console.log('\n--- Setup: POST a test project ---');
    const postProjRes = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'test-project-id',
        name: 'test-project',
        description: 'Test project description',
        githubLink: 'https://github.com/zvielkoren/test-project',
        ownerName: 'zvielkoren',
        stars: 5,
        language: 'TypeScript',
        private: false
      })
    });
    console.log('POST Project Status:', postProjRes.status);
    if (postProjRes.status !== 200) {
      throw new Error(`Expected 200, got ${postProjRes.status}`);
    }

    // Setup: POST a test organization
    console.log('\n--- Setup: POST a test organization ---');
    const postOrgRes = await fetch(`${BASE_URL}/api/organization`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'TestOrg',
        mission: 'Testing organization',
        link: 'https://github.com/TestOrg',
        logo: 'https://github.com/TestOrg.png'
      })
    });
    console.log('POST Org Status:', postOrgRes.status);
    if (postOrgRes.status !== 200) {
      throw new Error(`Expected 200, got ${postOrgRes.status}`);
    }

    // Test 1: Test GET /api/projects
    console.log('\n--- Test 1: GET /api/projects ---');
    const projectsRes = await fetch(`${BASE_URL}/api/projects`);
    console.log('Status:', projectsRes.status);
    if (projectsRes.status !== 200) {
      throw new Error(`Expected 200 OK, got ${projectsRes.status}`);
    }
    const projects = await projectsRes.json();
    console.log(`Received ${projects.length} projects.`);
    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error('Expected projects to be a non-empty array');
    }
    const testProj = projects.find(p => p.id === 'test-project-id');
    if (!testProj) {
      throw new Error('Could not find created test project in database');
    }
    console.log('Test 1 Passed.');

    // Test 2: Test GET /api/organization
    console.log('\n--- Test 2: GET /api/organization ---');
    const orgsRes = await fetch(`${BASE_URL}/api/organization`);
    console.log('Status:', orgsRes.status);
    if (orgsRes.status !== 200) {
      throw new Error(`Expected 200 OK, got ${orgsRes.status}`);
    }
    const orgs = await orgsRes.json();
    console.log(`Received ${orgs.length} organizations.`);
    if (!Array.isArray(orgs) || orgs.length === 0) {
      throw new Error('Expected organizations to be a non-empty array');
    }
    const testOrg = orgs.find(o => o.name === 'TestOrg');
    if (!testOrg) {
      throw new Error('Could not find created test organization in database');
    }
    // Verify GitHub links do not point to API urls
    orgs.forEach(org => {
      console.log(`Org: ${org.name}, Link: ${org.link}`);
      if (org.link.includes('api.github.com')) {
        throw new Error(`Found API link in organization link: ${org.link}`);
      }
    });
    console.log('Test 2 Passed.');

    // Test 3: Test POST /api/auth/login (Invalid credentials)
    console.log('\n--- Test 3: POST /api/auth/login (Invalid) ---');
    const loginFailRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wrong', password: 'wrong' })
    });
    console.log('Status:', loginFailRes.status);
    if (loginFailRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${loginFailRes.status}`);
    }
    const failBody = await loginFailRes.json();
    console.log('Error message:', failBody.error);
    if (failBody.error !== 'Invalid credentials') {
      throw new Error('Expected "Invalid credentials" error message');
    }
    console.log('Test 3 Passed.');

    // Test 4: Test POST /api/auth/login (Valid credentials from .env)
    console.log('\n--- Test 4: POST /api/auth/login (Valid) ---');
    const loginSuccessRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' })
    });
    console.log('Status:', loginSuccessRes.status);
    if (loginSuccessRes.status !== 200) {
      throw new Error(`Expected 200 OK, got ${loginSuccessRes.status}`);
    }
    const successBody = await loginSuccessRes.json();
    console.log('Success response:', successBody);
    if (!successBody.success) {
      throw new Error('Expected success to be true');
    }
    
    // Check if the cookie was set
    const setCookie = loginSuccessRes.headers.get('set-cookie');
    console.log('Set-Cookie Header:', setCookie);
    if (!setCookie || !setCookie.includes('auth_token')) {
      throw new Error('Expected set-cookie header containing auth_token');
    }
    console.log('Test 4 Passed.');

  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    testsPassed = false;
  } finally {
    console.log('\nStopping local dev server...');
    devServer.kill();
    await wait(1000);
  }

  if (testsPassed) {
    console.log('\n✅ All API Integration Tests Passed Successfully!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
