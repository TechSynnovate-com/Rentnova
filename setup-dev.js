const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Read package.json
const packagePath = path.join(__dirname, 'package.json');
const packageContent = fs.readFileSync(packagePath, 'utf8');
const packageData = JSON.parse(packageContent);

// Add dev script
packageData.scripts = packageData.scripts || {};
packageData.scripts.dev = 'next dev --port 5000 --hostname 0.0.0.0';
packageData.scripts.build = 'next build';
packageData.scripts.start = 'next start';

// Write back to package.json
fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));

console.log('✅ Added dev script to package.json');
console.log('🚀 Starting development server...');

// Start the development server
const devProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

devProcess.on('error', (error) => {
  console.error('Error starting dev server:', error);
  process.exit(1);
});

devProcess.on('exit', (code) => {
  console.log(`Dev server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  devProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  devProcess.kill('SIGTERM');
});