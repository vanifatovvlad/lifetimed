const fs = require('fs');

const distPath = 'dist/';

if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
}

fs.mkdirSync(distPath);
