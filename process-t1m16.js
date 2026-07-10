const fs = require('fs');
const path = require('path');

const moduleDir = 'src/components/learning-runtime/interactive/tier-1/module-16';
const interactiveDir = 'src/components/learning-runtime/interactive';

const comps = [
  "ruling-planets-confirmation-workbench",
  "ayanamsha-comparator",
  "kp-precision-resolution-comparator",
  "kp-horary-marriage-workbench",
  "kp-modified-vimshottari-explorer",
  "kp-reader-series-explorer",
  "kp-horary-cuspal-verdict",
  "sub-lord-calculator",
  "disposition-rules-workbench",
  "ruling-planets-calculator",
  "kp-cross-stream-router",
  "kp-lineage-timeline",
  "placidus-house-visualizer",
  "249-sub-explorer",
  "significator-hierarchy-explorer",
  "planet-sub-lord-modulator",
  "kp-horary-chart-caster",
  "kp-parashari-divergences",
  "kp-horary-number-selector",
  "ruling-planets-role-explorer",
  "cuspal-sub-lord-visualizer",
  "kp-parashari-convergences",
  "kp-parashari-side-by-side",
  "kp-horary-job-workbench",
  "sub-sub-recursion-explorer",
  "kp-synthesis-capstone",
  "cuspal-sub-lord-finder",
  "kp-cusp-calculator",
  "kp-horary-stream-comparator",
  "sub-lord-fluency-trainer",
  "kp-vs-parashari-cusp-comparator",
  "first-order-significator-visualizer",
  "kp-cusp-verifier",
  "second-order-significator-workbench",
  "significator-chain-builder"
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
