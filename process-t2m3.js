const fs = require('fs');
const path = require('path');

const moduleDir = 'src/components/learning-runtime/interactive/tier-2/module-03';
const interactiveDir = 'src/components/learning-runtime/interactive';

const comps = Array.from(new Set([
  "amatyakaraka-career-workbench",
  "sarasvati-learning-arts-workbench",
  "kp-tenth-cuspal-doctrine-workbench",
  "career-synthesis-overview-workbench",
  "job-offer-synthesis-workbench",
  "amk-placement-navamsha-workbench",
  "pancha-mahapurusha-career-workbench",
  "kp-tenth-significator-hierarchy-workbench",
  "entrepreneurship-employment-synthesis-workbench",
  "amk-tenth-lord-comparison-workbench",
  "kp-career-ruling-planets-timing-workbench",
  "career-scope-competence-router",
  "jaimini-amk-career-case-workbench",
  "raja-yoga-tenth-career-workbench",
  "predictive-karma-profile",
  "kp-career-question-verdict-workbench",
  "yogi-avayogi-career-workbench",
  "tenth-lord-permutation-profile",
  "d10-parity-construction-workbench",
  "tenth-karaka-triangulation",
  "d10-reading-anchor-workbench",
  "dasha-career-event-window-workbench",
  "tenth-aspect-workbench",
  "lal-kitab-career-overlay-workbench",
  "d1-d10-convergence-workbench",
  "tajika-career-year-refinement-workbench",
  "d10-career-question-workbench",
  "career-transit-confirmation-workbench"
]));

// Create directory
if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
}

// Move components
for (const comp of comps) {
  if (comp === "null") continue;
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
