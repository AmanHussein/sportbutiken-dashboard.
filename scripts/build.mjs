import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const model=(await readFile(new URL('model.js',root),'utf8')).replaceAll('export function','function');
let app=await readFile(new URL('app.js',root),'utf8');
app=app.replace("import {analyze,campaign} from './model.js';",'');
const data=JSON.parse(await readFile(new URL('data/source.json',root),'utf8'));
app=app.replace(/^const data=await fetch\(.*$/m,'const data='+JSON.stringify(data)+';');
await writeFile(new URL('dashboard.js',root),'(()=>{\n'+model+'\n'+app+'\n})();\n');
console.log('dashboard.js uppdaterad');
