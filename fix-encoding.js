const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'apps/web/src/lib/data');

const replacements = {
    'Ã¼': 'ü',
    'Ã§': 'ç',
    'Ä±': 'ı',
    'ÄŸ': 'ğ',
    'ÅŸ': 'ş',
    'Ã¶': 'ö',
    'Ä°': 'İ',
    'Ã‡': 'Ç',
    'Ã–': 'Ö',
    'Ãœ': 'Ü',
    'Åž': 'Ş',
    'Ä': 'Ğ', // Bazen ÄŸ -> ğ olur, bazen Ä -> Ğ. Dikkatli olmalı.
    'Â©': '©'
};

// Daha kapsamlı UTF-8 düzeltmesi için iconv-lite kullanılabilir ama dependency yok.
// Basit string replace ile ilerleyelim.

console.log(`Fixing encoding in: ${dataDir}`);

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    let content = fs.readFileSync(filePath, 'latin1'); // Latin1 olarak oku (bozuk karakterleri byte olarak almak için)
    
    // Aslında dosya UTF-8 ile yazılmış ama Windows-1252 (latin1) ile okunmuş gibi bozulmuş olabilir.
    // Veya UTF-8 dosyası UTF-8 olarak okunup tekrar UTF-8 olarak yazılınca düzelir mi?
    
    // Dosyadaki 'Ã¼' karakteri aslında UTF-8 'ü' nün Latin1 karşılığıdır.
    // Eğer dosyayı 'utf8' ile okursam, 'Ã¼' stringini görürüm.
    
    content = fs.readFileSync(filePath, 'utf8');
    
    let newContent = content;
    
    // Replace problematic sequences
    newContent = newContent.replace(/Ã¼/g, 'ü')
                           .replace(/Ã§/g, 'ç')
                           .replace(/Ä±/g, 'ı')
                           .replace(/ÄŸ/g, 'ğ')
                           .replace(/ÅŸ/g, 'ş')
                           .replace(/Ã¶/g, 'ö')
                           .replace(/Ä°/g, 'İ')
                           .replace(/Ã‡/g, 'Ç')
                           .replace(/Ã–/g, 'Ö')
                           .replace(/Ãœ/g, 'Ü')
                           .replace(/Åž/g, 'Ş')
                           .replace(/Â©/g, '©');
    
    // 'Ä' tek başına kaldıysa 'Ğ' olabilir mi? Genelde 'Ğ' -> 'Äž' olur.
    newContent = newContent.replace(/Äž/g, 'Ğ');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Fixed encoding in ${file}`);
    } else {
        console.log(`ℹ️ No changes in ${file}`);
    }
});
