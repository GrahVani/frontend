const fs = require('fs');

const registryFile = 'src/components/learning-runtime/interactive/registry-data.ts';
let content = fs.readFileSync(registryFile, 'utf8');

const comps = ["dignity-wheel", "friendship-matrix", "pakshabala-slider", "karaka-router", "friendship-dignity-grid", "budha-dignity-wheel", "association-classifier", "combustion-calculator", "guru-dignity-wheel", "jupiter-evaluator", "aspect-caster", "shukra-dignity-wheel", "myth-map", "shukra-friendship-dignity-grid", "shani-dignity-wheel", "saturn-lesson-mapper", "shani-aspect-dignity-grid", "node-geometry", "node-axis-reader", "rahu-amplifier", "rahu-ketu-comparator", "node-dignity-positions", "upagraha-list", "gulika-calculator", "tamkalika-wheel", "panchadha-combiner", "avastha-panel", "stream-comparator"];

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
