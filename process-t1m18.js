const fs = require('fs');
const path = require('path');

const moduleDir = 'src/components/learning-runtime/interactive/tier-1/module-18';
const interactiveDir = 'src/components/learning-runtime/interactive';

const comps = [
  "lal-kitab-teva-doctrine-explorer",
  "lal-kitab-varshphala-concept",
  "lal-kitab-upaya-family-sorter",
  "blind-planet-explorer",
  "lal-kitab-tradition-explorer",
  "lal-kitab-luminary-mapper",
  "teva-builder",
  "lal-kitab-varshphala-computation",
  "lal-kitab-epistemic-disclosure-lab",
  "lal-kitab-farman-timeline",
  "lal-kitab-mars-mercury-mapper",
  "sleeping-planet-explorer",
  "lal-kitab-remedy-decision-framework",
  "burning-planet-explorer",
  "teva-house-reader",
  "lal-kitab-varshphala-reading",
  "lal-kitab-classical-comparator",
  "planetary-state-synthesizer",
  "cross-stream-remedy-planner",
  "lal-kitab-benefic-sorter",
  "lal-kitab-tajika-varshaphala-comparator",
  "lal-kitab-status-and-ethics-explorer",
  "teva-lagna-cross-validator",
  "lal-kitab-recognition-lab",
  "lal-kitab-graha-clusters",
  "lal-kitab-stream-mastery-map"
];

// Create directory
if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
}

// Move components
for (const comp of comps) {
  const oldPath = path.join(interactiveDir, comp);
  const newPath = path.join(moduleDir, comp);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log('Moved', comp);
  }
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(moduleDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('../@/')) {
    content = content.replace(/\.\.\/@\//g, '@/');
    changed = true;
  }
  if (content.includes('../../@/')) {
    content = content.replace(/\.\.\/\.\.\/@\//g, '@/');
    changed = true;
  }
  if (content.includes('../../../@/')) {
    content = content.replace(/\.\.\/\.\.\/\.\.\/@\//g, '@/');
    changed = true;
  }
  
  const regex = /from\s+['"]\.\.\/([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const componentName = match[1];
    if (componentName === 'chrome') {
      content = content.replace(/from\s+['"]\.\.\/chrome['"]/g, `from '@/components/learning-runtime/chrome'`);
      content = content.replace(/from\s+['"]\.\.\/chrome\/([^'"]+)['"]/g, `from '@/components/learning-runtime/chrome/$1'`);
      changed = true;
      continue;
    }
    
    const inModule = fs.existsSync(path.join(moduleDir, componentName));
    const inInteractive = fs.existsSync(path.join(interactiveDir, componentName)) || fs.existsSync(path.join(interactiveDir, componentName + '.ts')) || fs.existsSync(path.join(interactiveDir, componentName + '.tsx'));
    
    if (!inModule && inInteractive) {
      const goodImport = `@/components/learning-runtime/interactive/${componentName}`;
      content = content.replace(new RegExp(`['"]\\.\\.\\/${componentName}['"]`, 'g'), `'${goodImport}'`);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed imports in', file);
  }
}
