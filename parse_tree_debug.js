const fs = require('fs');

try {
  const content = fs.readFileSync('tree.txt', 'utf8');
  const lines = content.split('\n');
  console.log(`Total lines: ${lines.length}`);
  
  // Debug first 5 lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    console.log(`Line ${i}: [${lines[i]}]`);
  }

  lines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 4) return;
    
    // Check sizes > 50MB
    const size = parseInt(parts[3], 10);
    if (!isNaN(size) && size > 50000000) {
       console.log(`FOUND LARGE: ${size} - ${line}`);
    }
  });
} catch (e) { console.error(e); }
