const fs = require('fs');

const distPath = 'dist/';
const assets = [
    'package.json',
    'LICENSE.md',
    'README.md',
];

for (const asset of assets) {
    fs.copyFileSync(asset, distPath + asset);
}