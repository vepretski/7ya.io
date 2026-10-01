import fs from 'node:fs';

const target='packages/app/public/index.html';
const html=fs.readFileSync(target,'utf8');
if(html.includes('data-social-first-home')){
  console.log('Personal media wall already present');
  process.exit(0);
}

const anchor='<section class="throughline" id="throughline">';
if(!html.includes(anchor)) throw new Error('Cannot inject personal media wall: Life Throughline anchor missing');

const facebookPosts=[
  {
    url:'https://www.facebook.com/photo.php?fbid=10155475810124662&set=a.258252685660823&type=3',
    title:'מהארכיון האישי בפייסבוק',
    note:'צילום מקורי שפורסם בפרופיל האישי'
  },
  {
    url:'https://www.facebook.com/lan2lan.sta2sim/posts/760747985420866/',
    title:'אבא מושלם — זה אבא ששם',
    note:'הפצה ציבורית של רגע אישי על אבהות'
  },
  {
    url:'https://www.facebook.com/lan2lan.sta2sim/posts/845465816949082/',
    title:'תחילת שבוע, הגננת מתקשרת',
    note:'רגע משפחתי שהפך לשיחה ציבורית'
  },
  {
    url:'https://www.facebook.com/lan2lan.sta2sim/posts/812358646926466/',
    title:'בשנות ה־90 קראו לי רוסי מסריח',
    note:'זהות, ילדות והגירה מתוך פוסט שהופץ מחדש'
  }
];

const visualMoments=[
  {
    cls:'wide',
    href:'https://www.youtube.com/watch?v=kS2CRiqRaXo',
    img:'https://i.ytimg.com/vi/kS2CRiqRaXo/maxresdefault.jpg',
    kicker:'POLICE · LIFE CHANGE',
    title:'למה עזבתי את משטרת ישראל',
    note:'וידאו אישי — לא תקציר של קורות חיים.'
  },
  {
    cls:'tall',
    href:'https://www.hidabroot.org/article/1179015',
    img:'https://storage.hidabroot.org/articles_new/327351_tumb_730X500.jpg',
    kicker:'FATHERHOOD · 2023',
    title:'אבא ששם',
    note:'רגע אישי שהפך לשיחה רחבה על נוכחות הורית.'
  },
  {
    cls:'wide',
    href:'https://youtu.be/O3v309CA4ao',
    img:'https://i.ytimg.com/vi/O3v309CA4ao/maxresdefault.jpg',
    kicker:'STARTON · 2022',
    title:'לחזור לשכונה כדי לבנות משהו שלא היה שם',
    note:'ראיון מתוך תקופת ההקמה והחזרה לג׳סי כהן.'
  },
  {
    cls:'',
    href:'https://www.youtube.com/watch?v=2HGMUN2jDwQ',
    img:'https://i.ytimg.com/vi/2HGMUN2jDwQ/hqdefault.jpg',
    kicker:'CREATE · 2020',
    title:'מת על אקסל',
    note:'Ron Nesher × Igor Vepretski.'
  },
  {
    cls:'',
    href:'https://www.youtube.com/watch?v=rQbAXagOZBU',
    img:'https://i.ytimg.com/vi/rQbAXagOZBU/hqdefault.jpg',
    kicker:'CREATE · 2022',
    title:'פרח במדבר',
    note:'יצירה היא חלק מהביוגרפיה, לא נספח.'
  },
  {
    cls:'tall',
    href:'https://www.youtube.com/watch?v=o8MgXeeLEpA',
    img:'https://i.ytimg.com/vi/o8MgXeeLEpA/hqdefault.jpg',
    kicker:'CREATE · 2024',
    title:'СупаПорп',
    note:'רוסית, הומור וזהות בלי ליישר פינות.'
  },
  {
    cls:'wide',
    href:'https://www.youtube.com/watch?v=jRjZjpqAgEw',
    img:'https://i.ytimg.com/vi/jRjZjpqAgEw/hqdefault.jpg',
    kicker:'CREATE · 2025',
    title:'BIZZI',
    note:'NAWAN ft. VEPRETSKI.'
  },
  {
    cls:'',
    href:'https://www.youtube.com/watch?v=AE5hDzLM5XU',
    img:'https://i.ytimg.com/vi/AE5hDzLM5XU/hqdefault.jpg',
    kicker:'PUBLIC VOICE · 2023',
    title:'מפוסט אישי למאבק ציבורי',
    note:'הונאות קשישים — מהמשפחה למסך.'
  },
  {
    cls:'tall',
    href:'https://www.youtube.com/shorts/k9haTADKG3M',
    img:'https://i.ytimg.com/vi/k9haTADKG3M/hqdefault.jpg',
    kicker:'NOW · EXTERNAL CREATOR',
    title:'כשהסיפור יוצא גם מהחשבון שלי',
    note:'5.13M views · 82.6K likes · source-local metrics.'
  },
  {
    cls:'wide',
    href:'https://holon.mynet.co.il/local_news/article/hjxqegkiq',
    img:'https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D1600%2Cq%3D90/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg',
    kicker:'JESSE COHEN · RETURN',
    title:'החזרה לשכונה',
    note:'צילום תקופתי מתוך הכתבה על StartOn.'
  },
  {
    cls:'',
    href:'https://www.youtube.com/watch?v=5qxA4hgUhV8',
    img:'https://i.ytimg.com/vi/5qxA4hgUhV8/hqdefault.jpg',
    kicker:'CREATOR ARCHIVE · LEGACY',
    title:'חינוך רוסי',
    note:'750K views · source-local counter.'
  }
];

const fbEmbed=(url)=>`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`;

const facebookHtml=facebookPosts.map((post,index)=>`
        <article class="fb-memory ${index===0?'fb-memory-primary':''}" data-social-card="facebook-${index+1}" data-real-media="facebook-${index+1}" data-facebook-embed="${index+1}">
          <div class="fb-memory-copy"><span>FACEBOOK · REAL PUBLIC POST</span><h3>${post.title}</h3><p>${post.note}</p></div>
          <div class="fb-embed-shell">
            <iframe src="${fbEmbed(post.url)}" title="${post.title}" loading="lazy" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </div>
        </article>`).join('');

const visualHtml=visualMoments.map((m,index)=>`
        <a class="memory-tile ${m.cls}" data-social-card="moment-${index+1}" data-real-media="moment-${index+1}" href="${m.href}" target="_blank" rel="noreferrer">
          <img src="${m.img}" alt="${m.title}" loading="${index<3?'eager':'lazy'}" decoding="async">
          <div class="memory-tile-copy"><small>${m.kicker}</small><h3>${m.title}</h3><p>${m.note}</p></div>
        </a>`).join('');

const social=`
    <section class="igor-live" data-social-first-home aria-labelledby="igor-live-title">
      <style>
        .igor-live{background:#070807;color:#f5f2e8;padding:clamp(58px,8vw,110px) max(18px,calc((100vw - 1320px)/2));border-block:1px solid rgba(255,255,255,.12)}
        .igor-live *{box-sizing:border-box}.igor-live-head{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr);gap:38px;align-items:end;margin-bottom:28px}
        .igor-live-kicker{margin:0 0 12px;color:#b9ff37;font:800 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.15em}
        .igor-live h2{margin:0;font-size:clamp(50px,8.5vw,124px);line-height:.82;letter-spacing:-.065em;text-transform:uppercase}.igor-live-head>p{margin:0;max-width:620px;color:#c6c6bf;font-size:clamp(17px,1.8vw,23px);line-height:1.55}
        .social-platform-bar{display:flex;gap:8px;overflow:auto;padding:4px 0 28px;scrollbar-width:none}.social-platform-bar::-webkit-scrollbar{display:none}.social-platform-bar a{flex:none;padding:10px 14px;border:1px solid rgba(255,255,255,.18);border-radius:999px;color:#eee;text-decoration:none;font:800 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.social-platform-bar a:hover{border-color:#b9ff37;color:#b9ff37}
        .facebook-years{margin:18px 0 56px}.facebook-years-head{display:flex;justify-content:space-between;gap:20px;align-items:end;margin-bottom:18px;border-top:1px solid rgba(255,255,255,.16);padding-top:20px}.facebook-years-head h3{margin:0;font-size:clamp(30px,4.5vw,64px);letter-spacing:-.045em}.facebook-years-head p{margin:0;color:#aaa;max-width:520px;line-height:1.5}
        .facebook-wall{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.fb-memory{grid-column:span 4;background:#111;border:1px solid rgba(255,255,255,.13);border-radius:22px;overflow:hidden}.fb-memory-primary{grid-column:span 8}.fb-memory-copy{padding:18px 20px 14px}.fb-memory-copy span{color:#b9ff37;font:800 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em}.fb-memory-copy h3{margin:8px 0 7px;font-size:clamp(22px,2.5vw,34px);line-height:1}.fb-memory-copy p{margin:0;color:#aeb0aa;line-height:1.45}.fb-embed-shell{background:#fff;min-height:520px;overflow:hidden}.fb-embed-shell iframe{display:block;width:100%;height:620px;border:0;background:#fff}
        .life-camera-roll{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-auto-flow:dense;gap:14px}.memory-tile{grid-column:span 4;min-height:390px;position:relative;overflow:hidden;border-radius:22px;color:#fff;text-decoration:none;background:#111;isolation:isolate}.memory-tile.wide{grid-column:span 8}.memory-tile.tall{min-height:560px}.memory-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform .45s ease}.memory-tile:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 25%,rgba(0,0,0,.18) 48%,rgba(0,0,0,.92));z-index:-1}.memory-tile:hover img{transform:scale(1.025)}.memory-tile-copy{position:absolute;inset:auto 0 0;padding:22px}.memory-tile-copy small{color:#b9ff37;font:800 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em}.memory-tile-copy h3{margin:7px 0 8px;font-size:clamp(25px,3vw,42px);line-height:.98;letter-spacing:-.035em}.memory-tile-copy p{margin:0;color:#deded8;line-height:1.4;max-width:46ch}
        @media(max-width:900px){.igor-live{padding:48px 16px 64px}.igor-live-head{grid-template-columns:1fr;gap:14px}.igor-live h2{font-size:clamp(54px,17vw,84px)}.facebook-years-head{display:block}.facebook-years-head p{margin-top:10px}.facebook-wall{display:flex;overflow-x:auto;gap:12px;margin-inline:-16px;padding:0 16px 12px;scroll-snap-type:x mandatory}.fb-memory,.fb-memory-primary{flex:0 0 min(88vw,430px);scroll-snap-align:center}.fb-embed-shell{min-height:500px}.fb-embed-shell iframe{height:610px}.life-camera-roll{grid-template-columns:1fr}.memory-tile,.memory-tile.wide{grid-column:1;min-height:440px}.memory-tile.tall{min-height:520px}}
      </style>

      <header class="igor-live-head">
        <div><p class="igor-live-kicker">REAL POSTS · REAL FRAMES · NO GENERATED MEMORIES</p><h2 id="igor-live-title">החיים על המסך.</h2></div>
        <p>לא עוד כרטיסי מערכת שמספרים שיש ארכיון. הנה החומר עצמו: פוסטים אמיתיים מפייסבוק, וידאו, מוזיקה, אבהות, משטרה, StartOn ורגעים שבהם החיים יצאו מהחשבון שלי אל הקהל.</p>
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

      <div class="facebook-years">
        <div class="facebook-years-head"><h3>Facebook — השנים עצמן</h3><p>לא screenshots ולא placeholders: פוסטים ציבוריים מוטמעים ישירות מהמקור. הראשון הוא צילום מהארכיון האישי; האחרים הם הפצות ציבוריות מתועדות של רגעים שלך.</p></div>
        <div class="facebook-wall">${facebookHtml}</div>
      </div>

      <div class="life-camera-roll" aria-label="רגעים ויזואליים אמיתיים מהחיים ומהיצירה">
        ${visualHtml}
      </div>
    </section>

    `;

fs.writeFileSync(target,html.replace(anchor,social+anchor));
console.log(`Injected personal media wall: ${facebookPosts.length} Facebook embeds + ${visualMoments.length} unique visual moments.`);
