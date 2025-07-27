const fs = require('fs');

const distPath = 'dist/temp/';

if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
}
