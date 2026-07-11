const fs = require('fs');
const path = 'src/components/learning-runtime/chrome/sections/PrimarySimulator.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add import if not exists
if (!content.includes('interactiveMap')) {
  content = content.replace('import { SectionHeader }', 'import { interactiveMap } from \'../../interactive/interactive-map\';\nimport { SectionHeader }');
}

// Replace the routing logic
const startToken = '  // Direct folder routing for Tier 1 Module 1 (bypassing the alphabetical registry)';
const endToken = 'Failed to load direct component for Tier 2 Module 13: ${interactiveKey}`, err);\n    }\n  }';

const startIndex = content.indexOf(startToken);
const endIndex = content.indexOf(endToken) + endToken.length;

if (startIndex !== -1 && endIndex !== -1) {
  const newRouting = `
  if (fm.tier && fm.module && interactiveKey) {
    const mapKey = \`tier-\${fm.tier}/module-\${fm.module}/\${interactiveKey}\`;
    const loadFn = interactiveMap[mapKey];
    if (loadFn) {
      try {
        const mod = await loadFn();
        const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
        InteractiveComponent = mod[exportName];
      } catch (err) {
        console.error(\`Failed to load component for \${mapKey}\`, err);
      }
    }
  }
`;
  content = content.substring(0, startIndex) + newRouting + content.substring(endIndex);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully updated PrimarySimulator.tsx');
} else {
  console.log('Failed to find tokens', startIndex, endIndex);
}
