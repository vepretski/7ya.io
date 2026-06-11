import http from 'node:http'
import { readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
const root=join(fileURLToPath(new URL('.',import.meta.url)),'public')
const redirects={'/igor-vepretski':'/about','/press-wall':'/press','/story':'/journal/lifnei-shemehalkim-et-hamaftehot'}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml; charset=utf-8'}
function route(path){if(path==='/api/media')return '/api/media.json';if(path==='/api/evidence')return '/api/evidence.json';if(path==='/api/press')return '/api/press.json';if(path==='/api/content')return '/api/content.json';if(/^\/embed\/[^/]+\/[^/]+$/.test(path))return '/embed/index.html';if(path==='/'||path.endsWith('/'))return path+'index.html';if(!extname(path))return path+'/index.html';return path}
export function createServer(){return http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(redirects[url.pathname]){res.writeHead(308,{location:redirects[url.pathname]});return res.end()}let file=normalize(join(root,route(url.pathname)));if(!file.startsWith(root)){res.writeHead(403);return res.end('Forbidden')}try{if(!statSync(file).isFile())throw Error('not file');res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'});res.end(readFileSync(file))}catch{res.writeHead(404,{'content-type':'text/plain; charset=utf-8'});res.end('Not found')}})}
if(import.meta.url===`file://${process.argv[1]}`)createServer().listen(Number(process.env.PORT||4177),()=>console.log('7ya-site ready'))
