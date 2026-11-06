import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'..');
http.createServer(async(req,res)=>{try{const p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html')));if(!p.startsWith(root+sep))throw Error();const b=await readFile(p);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json'})[extname(p)]||'text/plain');res.end(b)}catch{res.writeHead(404);res.end('Not found')}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
