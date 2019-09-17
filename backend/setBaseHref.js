const fs = require('fs');
const path = require('path');

const baseHref = process.argv && process.argv[3];

// base href passed
if (baseHref) {
  const filepath = path.join(__dirname, 'src/dist/index.html');

  const content = fs
    .readFileSync(filepath, 'utf8')
    .replace('base href=""', `base href="${baseHref}"`);

  fs.writeFileSync(filepath, content);
}