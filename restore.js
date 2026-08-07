const fs = require('fs');
let index = fs.readFileSync('index.html', 'utf8');
const restoredScript = fs.readFileSync('restored_index.html', 'utf8');
const reviewForm = fs.readFileSync('restored_reviewform.txt', 'utf8');

// Replace the ReviewForm in the restored script
let newScript = restoredScript.replace(/\/\/ Step 3: Review AI-generated fields, all editable[\s\S]*?(?=\/\/ ========== MAIN COMPONENT ==========)/, reviewForm + '\n\n        ');

// Replace the entire <script type="text/babel"> block in index.html
index = index.replace(/<script type="text\/babel">[\s\S]*?<\/script>/, '<script type="text/babel">\n' + newScript + '\n    </script>');

fs.writeFileSync('index.html', index);
console.log('Successfully restored index.html');
