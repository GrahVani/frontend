const fs = require('fs');
const path = require('path');

const registryFile = 'src/components/learning-runtime/interactive/registry-data.ts';
const interactiveDir = 'src/components/learning-runtime/interactive';
let content = fs.readFileSync(registryFile, 'utf8');
const lines = content.split(/\r?\n/);

let newLines = [];
let changed = false;

let inMap = false;
for (const line of lines) {
  if (line.includes("INTERACTIVE_REGISTRY")) {
    inMap = true;
    newLines.push(line);
    continue;
  }
  if (inMap && /^\};/.test(line.trim())) {
    inMap = false;
    newLines.push(line);
    continue;
  }
  
  if (!inMap) {
    newLines.push(line);
    continue;
  }
  
  if (line.trim() === "" || line.trim().startsWith("//")) {
    newLines.push(line);
    continue;
  }

  const m = line.match(
    /^\s*"([^"]+)":\s*\{\s*path:\s*"([^"]+)",\s*exportName:\s*(null|"([^"]*)")\s*\}/,
  );
  
  if (m) {
    const compPath = m[2];
    const fullPathTsx = path.join(interactiveDir, compPath + '.tsx');
    const fullPathTs = path.join(interactiveDir, compPath + '.ts');
    const fullPathDir = path.join(interactiveDir, compPath);
    
    const exists = fs.existsSync(fullPathTsx) || fs.existsSync(fullPathTs) || fs.existsSync(fullPathDir);
    
    if (!exists) {
      console.log(`Removing broken registry entry: ${m[1]} -> ${compPath}`);
      changed = true;
      continue; // Skip adding this line
    }
  }
  
  newLines.push(line);
}

if (changed) {
  fs.writeFileSync(registryFile, newLines.join('\n'), 'utf8');
  console.log('Successfully updated registry-data.ts');
} else {
  console.log('No broken entries found.');
}
