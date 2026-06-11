import http from 'node:http'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { URL } from 'node:url'
import { mediaCore } from './src/data/media-core.mjs'
import { mediaSocial } from './src/data/media-social.mjs'
import { evidenceCards } from './src/data/evidence.mjs'
import { stripPrivate } from './src/lib/render.mjs'
import { home,drops,drop01,mediaPage,evidencePage,journal } from './src/pages-core.mjs'
import { article,about } from './src/pages-story.mjs'
import { press,contact,embed,notFound,sitemap,rss,og } from './src/pages-support.mjs'

const here=dirname(fileURLToPath(import.meta.url))
const capturedDate='2026-06-11'
const registry=[...mediaCore,...mediaSocial]
const publicMedia=registry.filter(item=>item.public).map(stripPrivate)
const pressItems=publicMedia.filter(item=>['article','pdf','podcast','external-link'].includes(item.type))
const css=readFileSync(join(here,'public/site.css'),'utf8')
const js=readFileSync(join(here,'public/site.js'),'utf8')
const send=(res,status,type,value,headers={})=>{res.writeHead(status,{'content-type':type,...headers});res.end(value)}
const json=(res,value)=>send(res,200,'application/json; charset=utf-8',JSON.stringify(value,null,2),{'cache-control':'public, max-age=60'})
const redirect=(res,location)=>send(res,308,'text/plain; charset=utf-8','',{location})

export function createServer(){return http.createServer((req,res)=>{const path=decodeURI(new URL(req.url,`http://${req.headers.host||'localhost'}`).pathname)
  if(path==='/site.css')return send(res,200,'text/css; charset=utf-8',css)
  if(path==='/site.js')return send(res,200,'application/javascript; charset=utf-8',js)
  if(path==='/robots.txt')return send(res,200,'text/plain; charset=utf-8','User-agent: *\nAllow: /\nSitemap: https://7ya.io/sitemap.xml\n')
  if(path==='/sitemap.xml')return send(res,200,'application/xml; charset=utf-8',sitemap())
  if(path==='/rss.xml')return send(res,200,'application/rss+xml; charset=utf-8',rss())
  if(path==='/og/default.svg')return send(res,200,'image/svg+xml; charset=utf-8',og('#7YA','DISCIPLINE IS FREEDOM.'))
  if(path==='/og/flagship.svg')return send(res,200,'image/svg+xml; charset=utf-8',og('לפני שמחלקים את המפתחות','IGOR VEPRETSKI / JOURNAL'))
  if(path==='/api/media')return json(res,{capturedDate,count:publicMedia.length,items:publicMedia})
  if(path==='/api/evidence')return json(res,{capturedDate,count:evidenceCards.length,items:evidenceCards})
  if(path==='/api/press')return json(res,{capturedDate,count:pressItems.length,items:pressItems})
  if(path==='/api/content')return json(res,{capturedDate,entityHierarchy:['IGOR VEPRETSKI','#7YA','StartOn'],flagshipArticle:'/journal/lifnei-shemehalkim-et-hamaftehot'})
  if(path==='/')return send(res,200,'text/html; charset=utf-8',home(publicMedia))
  if(path==='/drops')return send(res,200,'text/html; charset=utf-8',drops())
  if(path==='/drops/drop-01')return send(res,200,'text/html; charset=utf-8',drop01())
  if(path==='/media')return send(res,200,'text/html; charset=utf-8',mediaPage(publicMedia))
  if(path==='/journal')return send(res,200,'text/html; charset=utf-8',journal())
  if(path==='/journal/lifnei-shemehalkim-et-hamaftehot')return send(res,200,'text/html; charset=utf-8',article(publicMedia))
  if(path==='/press')return send(res,200,'text/html; charset=utf-8',press(publicMedia))
  if(path==='/evidence')return send(res,200,'text/html; charset=utf-8',evidencePage(evidenceCards))
  if(path==='/about')return send(res,200,'text/html; charset=utf-8',about())
  if(path==='/contact')return send(res,200,'text/html; charset=utf-8',contact())
  if(path==='/igor-vepretski')return redirect(res,'/about')
  if(path==='/press-wall')return redirect(res,'/press')
  if(path==='/story')return redirect(res,'/journal/lifnei-shemehalkim-et-hamaftehot')
  const match=path.match(/^\/embed\/([^/]+)\/([^/]+)$/);if(match)return send(res,200,'text/html; charset=utf-8',embed(publicMedia.find(item=>item.provider===match[1]&&item.id===match[2])))
  return send(res,404,'text/html; charset=utf-8',notFound())
})}
if(import.meta.url===`file://${process.argv[1]}`)createServer().listen(Number(process.env.PORT||4177),()=>console.log('7ya-site ready'))
