import { getCollection } from 'astro:content';

const earth = await getCollection('earth');
console.log('Earth collection entries:', earth.length);
console.log('\nFirst 10 IDs:');
earth.slice(0, 10).forEach(e => {
  console.log(`  - ${e.id} (title: ${e.data.title})`);
});

console.log('\nLooking for entries with "apolitical"...');
const matching = earth.filter(e => e.id.includes('apolitical') || e.data.title.toLowerCase().includes('apolitical'));
matching.forEach(e => {
  console.log(`  - ID: ${e.id}`);
  console.log(`    Title: ${e.data.title}`);
});
