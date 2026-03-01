const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');

css = css.replace(':root {\n  color-scheme: dark;\n}', `:root {
  --bg: #ffffff;
  --text: #000000;
  --inverse: 0, 0, 0;
  --glass: 255, 255, 255;
  --card-bg: #ffffff;
  color-scheme: light;
}

.dark {
  --bg: #000000;
  --text: #ffffff;
  --inverse: 255, 255, 255;
  --glass: 0, 0, 0;
  --card-bg: #111111;
  color-scheme: dark;
}`);

css = css.replace(/body\s*\{\s*background:\s*#000;\s*color:\s*#fff;/g, `body {\n  background: var(--bg);\n  color: var(--text);`);
css = css.replace(/rgba\(255,\s*255,\s*255/g, 'rgba(var(--inverse)');
css = css.replace(/rgba\(0,\s*0,\s*0/g, 'rgba(var(--glass)');
css = css.replace(/color:\s*#fff/g, 'color: var(--text)');
css = css.replace(/background:\s*#000/g, 'background: var(--bg)');
css = css.replace(/background:\s*#fff/g, 'background: var(--card-bg)');
css = css.replace(/color:\s*#000/g, 'color: var(--text)');

fs.writeFileSync('app/globals.css', css);
console.log('Updated globals.css');
