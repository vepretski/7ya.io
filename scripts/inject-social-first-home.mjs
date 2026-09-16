import fs from 'node:fs';

const target='packages/app/public/index.html';
const html=fs.readFileSync(target,'utf8');
if(html.includes('data-social-first-home')){
  console.log('IGOR LIVE social-first layer already present');
  process.exit(0);
}
const anchor='<section class="throughline" id="throughline">';
if(!html.includes(anchor)) throw new Error('Cannot inject IGOR LIVE: Life Throughline anchor missing');

const social=`
    <section class="igor-live" data-social-first-home aria-labelledby="igor-live-title">
      <style>
        .igor-live{position:relative;overflow:hidden;background:#080a0d;color:#f7f5ef;padding:clamp(48px,7vw,96px) max(20px,calc((100vw - 1240px)/2));border-block:1px solid rgba(255,255,255,.12)}
        .igor-live:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 12% 15%,rgba(174,255,0,.10),transparent 32%),radial-gradient(circle at 88% 30%,rgba(255,255,255,.06),transparent 30%);pointer-events:none}
        .igor-live-head,.social-platform-bar,.igor-live-rail{position:relative;z-index:1}
        .igor-live-head{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr);gap:32px;align-items:end;margin-bottom:28px}
        .igor-live-kicker{margin:0 0 10px;font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;color:#b9ff37}
        .igor-live h2{margin:0;font-size:clamp(42px,7.5vw,104px);line-height:.86;letter-spacing:-.065em;text-transform:uppercase}
        .igor-live-head>p{margin:0;color:#bbb;font-size:clamp(16px,1.7vw,22px);line-height:1.55;max-width:590px}
        .social-platform-bar{display:flex;gap:8px;overflow-x:auto;padding:4px 0 20px;scrollbar-width:none;overscroll-behavior-inline:contain}
        .social-platform-bar::-webkit-scrollbar{display:none}
        .social-platform-bar a{flex:0 0 auto;border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:10px 14px;color:#f7f5ef;text-decoration:none;font:700 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.05em;background:rgba(255,255,255,.035)}
        .social-platform-bar a:hover,.social-platform-bar a:focus-visible{border-color:#b9ff37;color:#b9ff37;outline:none}
        .igor-live-rail{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}
        .social-card{grid-column:span 4;min-height:430px;position:relative;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:#111;color:#fff;text-decoration:none;isolation:isolate}
        .social-card.featured{grid-column:span 6;min-height:520px}
        .social-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.02);z-index:-2}
        .social-card:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.06) 15%,rgba(0,0,0,.25) 48%,rgba(0,0,0,.92) 100%);z-index:-1}
        .social-source-frame{position:absolute;inset:0;display:grid;align-content:start;padding:22px;background:linear-gradient(145deg,#161a1f,#090b0e 56%,#1e2714);z-index:-2}
        .social-source-frame b{font-size:clamp(34px,5vw,70px);line-height:.85;letter-spacing:-.05em;text-transform:uppercase;opacity:.92}
        .social-source-frame span{margin-top:10px;font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#b9ff37;letter-spacing:.12em}
        .social-card-copy{padding:22px}
        .social-card-meta{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:9px;font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#cfd0cc}
        .social-card h3{font-size:clamp(24px,2.6vw,38px);line-height:1.02;letter-spacing:-.035em;margin:0 0 10px}
        .social-card p{margin:0 0 14px;color:#d4d4d0;line-height:1.45}
        .social-card strong{display:inline-flex;max-width:max-content;border-radius:999px;background:#f3f1e8;color:#111;padding:8px 11px;font:800 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace}
        .social-card small{display:block;margin-top:10px;color:#9fa19c;font-size:11px;line-height:1.35}
        @media(max-width:820px){.igor-live{padding:44px 18px 54px}.igor-live-head{grid-template-columns:1fr;gap:16px}.igor-live h2{font-size:clamp(50px,17vw,78px)}.igor-live-head>p{font-size:16px}.igor-live-rail{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;margin-inline:-18px;padding:0 18px 12px;scrollbar-width:none}.igor-live-rail::-webkit-scrollbar{display:none}.social-card,.social-card.featured{flex:0 0 min(84vw,360px);min-height:470px;scroll-snap-align:center}.social-platform-bar{margin-inline:-18px;padding-inline:18px}}
        @media(prefers-reduced-motion:reduce){.igor-live-rail{scroll-behavior:auto}}
      </style>
      <header class="igor-live-head">
        <div><p class="igor-live-kicker">SOCIAL PUBLIC RECORD · NOW / ARCHIVE</p><h2 id="igor-live-title" dir="ltr">IGOR LIVE</h2></div>
        <p>הרשתות הן לא קישוט בתחתית האתר. הן המקום שבו החיים, היצירה, השאלות והקהל נפגשו בזמן אמת. כאן נכנסים ישר לפוסטים ולווידאו המקוריים — וכל מספר נשאר צמוד למקור שממנו הגיע.</p>
      </header>
      <nav class="social-platform-bar" aria-label="Igor Vepretski public social platforms">
        <a href="https://www.instagram.com/igor.vepretski/" target="_blank" rel="noreferrer">Instagram · @igor.vepretski</a>
        <a href="https://www.tiktok.com/@igor.vepretski" target="_blank" rel="noreferrer">TikTok · @igor.vepretski</a>
        <a href="https://www.youtube.com/@IgorVepretski" target="_blank" rel="noreferrer">YouTube · @IgorVepretski</a>
        <a href="https://www.facebook.com/vepretski7" target="_blank" rel="noreferrer">Facebook · /vepretski7</a>
        <a href="https://t.me/vepretski" target="_blank" rel="noreferrer">Telegram · @vepretski</a>
        <a href="https://www.threads.net/@igor.vepretski" target="_blank" rel="noreferrer">Threads · @igor.vepretski</a>
        <a href="https://www.linkedin.com/in/vepretski/" target="_blank" rel="noreferrer">LinkedIn · /in/vepretski</a>
        <a href="https://x.com/igorvepretski" target="_blank" rel="noreferrer">X · @igorvepretski</a>
      </nav>
      <div class="igor-live-rail" aria-label="Source-linked social highlights">
        <a class="social-card featured" data-social-card="instagram-reel" href="https://www.instagram.com/reel/DbDfpb6orUt/" target="_blank" rel="noreferrer">
          <div class="social-source-frame"><b>Instagram<br>Reel</b><span>OWNER INSIGHTS · 01.08.2026</span></div>
          <div class="social-card-copy"><div class="social-card-meta"><span>Instagram · @vepretski.igor</span><span>2026</span></div><h3>שלום שבת | #7YA🥷 — הסיפור מתחיל</h3><p>איגור מדבר ישירות למצלמה. ה־Insights של הבעלים מחוברים לאותו ריל.</p><strong>5K views · 801 accounts · 29.88s avg watch</strong><small>OWNER INSIGHTS · CANONICAL REEL ↗</small></div>
        </a>
        <a class="social-card featured" data-social-card="nawan-short" href="https://www.youtube.com/shorts/k9haTADKG3M" target="_blank" rel="noreferrer">
          <img src="https://i.ytimg.com/vi/k9haTADKG3M/hqdefault.jpg" alt="Igor Vepretski in Nawan YouTube Short" loading="lazy" decoding="async">
          <div class="social-card-copy"><div class="social-card-meta"><span>YouTube Shorts · Nawan1</span><span>2026</span></div><h3>5.13M — כשהסיפור יוצא גם מהחשבון שלי</h3><p>הופעה אצל יוצר חיצוני שמזכיר ומתייג את Igor Vepretski.</p><strong>5.13M views · 82.6K likes · 717 comments</strong><small>EXTERNAL CREATOR SOURCE · NOT OWNED REACH ↗</small></div>
        </a>
        <a class="social-card" data-social-card="youtube-legacy" href="https://www.youtube.com/watch?v=5qxA4hgUhV8" target="_blank" rel="noreferrer">
          <img src="https://i.ytimg.com/vi/5qxA4hgUhV8/hqdefault.jpg" alt="Russian education video from Igor Vepretski creator archive" loading="lazy" decoding="async">
          <div class="social-card-copy"><div class="social-card-meta"><span>YouTube · Creator Archive</span><span>Legacy</span></div><h3>חינוך רוסי — שורש ויראלי</h3><p>זהות, משפחה והומור מתוך ארכיון היוצר.</p><strong>750K views · source-local counter</strong><small>OWNED PUBLIC VIDEO · VERIFIED ↗</small></div>
        </a>
        <a class="social-card" data-social-card="tiktok-owner" href="https://www.tiktok.com/@igor.vepretski" target="_blank" rel="noreferrer">
          <div class="social-source-frame"><b>TikTok</b><span>OWNER EXPORT · 02.06.2026</span></div>
          <div class="social-card-copy"><div class="social-card-meta"><span>TikTok · @igor.vepretski</span><span>Snapshot</span></div><h3>מנוע יצירה מתמשך</h3><p>צילום מצב של פעילות החשבון; נתוני החשבון מוצגים כהקשר, לא כמדד לפוסט בודד.</p><strong>904 posts · 12,655 followers · 273,860 likes</strong><small>OWNER EXPORT · DATED ↗</small></div>
        </a>
        <a class="social-card" data-social-card="instagram-police" href="https://www.instagram.com/reel/CyhEU1kMUuH/" target="_blank" rel="noreferrer">
          <div class="social-source-frame"><b>Instagram</b><span>PUBLIC REEL · 17.10.2023</span></div>
          <div class="social-card-copy"><div class="social-card-meta"><span>Instagram</span><span>2023</span></div><h3>גיבורי העל של התקופה</h3><p>ריל שנוצר בזמן פחד ציבורי כהכרת תודה לאנשים שפעלו בשטח.</p><small>PUBLIC REEL · SOURCE LINKED ↗</small></div>
        </a>
        <a class="social-card" data-social-card="linkedin-starton" href="https://www.linkedin.com/posts/vepretski_discover-how-digital-innovation-hubs-are-activity-7336995936314834944-escP" target="_blank" rel="noreferrer">
          <div class="social-source-frame"><b>LinkedIn</b><span>PUBLIC PROFESSIONAL POST · 2025</span></div>
          <div class="social-card-copy"><div class="social-card-meta"><span>LinkedIn · StartOn</span><span>2025</span></div><h3>How digital innovation hubs empower communities</h3><p>החזון של StartOn בשפה מקצועית של תשתית, קהילה, מיומנויות והזדמנות.</p><small>PUBLIC PROFESSIONAL POST ↗</small></div>
        </a>
        <a class="social-card" data-social-card="facebook-profile" href="https://www.facebook.com/vepretski7" target="_blank" rel="noreferrer">
          <div class="social-source-frame"><b>Facebook</b><span>PUBLIC OWNER SURFACE</span></div>
          <div class="social-card-copy"><div class="social-card-meta"><span>Facebook · /vepretski7</span><span>Live surface</span></div><h3>פוסטים, וידאו והשיחה עם הקהל</h3><p>הכניסה הישירה למשטח הפייסבוק הציבורי של איגור.</p><small>OFFICIAL PUBLIC SURFACE ↗</small></div>
        </a>
      </div>
    </section>

    `;
fs.writeFileSync(target,html.replace(anchor,social+anchor));
console.log('Injected IGOR LIVE social-first layer before Life Throughline');
