const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'apps/web/src/lib/data');

console.log(`Checking JSON files in: ${dataDir}`);

if (!fs.existsSync(dataDir)) {
    console.error('Directory not found!');
    process.exit(1);
}

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Remove BOM
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ BOM removed from ${file}`);
        }

        JSON.parse(content);
        console.log(`✅ ${file} is valid`);
    } catch (error) {
        console.error(`❌ ${file} is INVALID:`, error.message);
    }
});
