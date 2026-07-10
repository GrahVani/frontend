const fs = require('fs');

const registryFile = 'src/components/learning-runtime/interactive/registry-data.ts';
let content = fs.readFileSync(registryFile, 'utf8');

const comps = ["bhava-wheel", "house-system-comparator", "bhava-template-card", "bhava-profile", "preliminary-reading-flow", "angular-house-classifier", "quality-house-classifier", "purushartha-trine-explorer", "karaka-table", "karaka-tenancy-lab", "bhavat-bhavam-drill", "bhava-chalita-refinement", "placidus-kp-convention", "bhava-madhya-sandhi", "house-system-decision-framework", "lal-kitab-fixed-aries-lagna"];

let changed = false;

for (const comp of comps) {
  const regex = new RegExp(`^\\s*"${comp}":\\s*\\{[^}]+\\},?\r?\n`, 'gm');
  if (regex.test(content)) {
    content = content.replace(regex, '');
    changed = true;
    console.log(`Removed ${comp} from registry-data.ts`);
  }
}

if (changed) {
  fs.writeFileSync(registryFile, content, 'utf8');
  console.log('Successfully updated registry-data.ts');
} else {
  console.log('No changes made to registry-data.ts');
}
