import fs from 'node:fs';

const htmlPath='packages/app/public/index.html';
const cssPath='packages/app/public/assets/launch.css';
let html=fs.readFileSync(htmlPath,'utf8');
let css=fs.readFileSync(cssPath,'utf8');

const start='<section class="hero" id="life" data-first-fold-life>';
const end='<section class="throughline" id="throughline">';

const documentary=`<section class="documentary-hero" id="life" data-first-fold-life data-documentary-home="v2" data-narrative="FACE → MOMENT → STORY → MEDIA → CONSEQUENCE → NEXT" data-source-policy="REAL SOURCE ONLY">
      <figure class="documentary-hero-media">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png/1200px-Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png" alt="איגור ופרצקי" fetchpriority="high" decoding="async">
      </figure>
      <div class="documentary-hero-shade" aria-hidden="true"></div>
      <div class="documentary-hero-copy">
        <p class="documentary-kicker" dir="ltr">IGOR VEPRETSKI · KHARKIV 1990 → ISRAEL → NOW</p>
        <h1>החיים שלי.<br><em>לא גרסה מלוטשת שלהם.</em></h1>
        <p class="documentary-lead">חרקוב, עלייה לישראל, ג׳סי כהן, שירות, משטרה, אבהות, StartOn, יצירה, מדיה, עשייה ציבורית — והחיים שממשיכים עכשיו. לא דשבורד. לא קורות חיים. סיפור שאפשר לראות, לשמוע ולפתוח עד המקור.</p>
        <nav class="documentary-actions" aria-label="כניסה לסיפור">
          <a class="documentary-primary" href="#life-film">להתחיל מההתחלה <b>↓</b></a>
          <a href="#starton">מה אני בונה עכשיו <b>↘</b></a>
          <a href="/contact/">לדבר איתי <b>↗</b></a>
        </nav>
        <p class="documentary-signature" dir="ltr">#7YA🥷 · ONE LIFE / MANY CHAPTERS / OPEN SOURCES</p>
      </div>
    </section>

    <section class="life-film" id="life-film" aria-label="הסיפור של איגור ופרצקי לאורך החיים">
      <header class="life-film-intro">
        <p dir="ltr">1990 → NOW · A LIVING DOCUMENTARY</p>
        <h2>לא שמונה תפקידים.<br>אדם אחד שעובר דרך החיים.</h2>
        <p>כל פרק כאן מתחיל ברגע אנושי. התמונה או הווידאו מגיעים ממקור אמיתי; כשאין צילום אותנטי מהתקופה, אני לא ממציא אחד.</p>
      </header>

      <article class="documentary-moment is-source" data-documentary-moment="childhood" data-life-moment="childhood">
        <a class="documentary-media documentary-source-frame" href="https://www.makorrishon.co.il/nrg/online/54/ART2/235/169.html" target="_blank" rel="noreferrer" aria-label="מקור תקופתי על הילדות והדרך">
          <span dir="ltr">01 · 1990—2007</span><strong dir="ltr">KHARKIV<br>ISRAEL<br>JESSE COHEN</strong><small>PERIOD SOURCE · NO INVENTED CHILDHOOD IMAGE</small>
        </a>
        <div class="documentary-story"><small dir="ltr">CHILDHOOD · ORIGIN</small><h3>לפני שהיה סיפור ציבורי, היה ילד שמנסה להבין איפה הוא שייך.</h3><p>חרקוב, עלייה לישראל, בת־ים, חולון וג׳סי כהן. הרבה מהשאלות שבאו אחר כך — שייכות, הזדמנות, מי רואים בזמן — התחילו שם.</p><a href="https://www.makorrishon.co.il/nrg/online/54/ART2/235/169.html" target="_blank" rel="noreferrer">למקור התקופתי ↗</a></div>
      </article>

      <article class="documentary-moment" data-documentary-moment="service" data-life-moment="service">
        <a class="documentary-media documentary-source-frame service-frame" href="https://2009-2017.state.gov/documents/organization/210079.pdf" target="_blank" rel="noreferrer"><span dir="ltr">02 · 2008—2014</span><strong dir="ltr">SERVICE<br>SECURITY<br>RESPONSIBILITY</strong><small>OFFICIAL RECORD · SOURCE-BOUND</small></a>
        <div class="documentary-story"><small dir="ltr">SERVICE · SECURITY</small><h3>חשבתי שאבנה את עצמי בתוך המערכת.</h3><p>שנים של שירות, ביטחון ושליחות לימדו אותי משמעת ואחריות — וגם מה קורה ברגע שבו מערכת פוגשת אדם.</p><a href="https://2009-2017.state.gov/documents/organization/210079.pdf" target="_blank" rel="noreferrer">לרשומה הרשמית ↗</a></div>
      </article>

      <article class="documentary-moment" data-documentary-moment="police" data-life-moment="police">
        <a class="documentary-media" href="https://www.youtube.com/watch?v=kS2CRiqRaXo" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/kS2CRiqRaXo/maxresdefault.jpg" alt="למה עזבתי את משטרת ישראל" loading="lazy" decoding="async"><span class="documentary-source">OWNED VIDEO · YOUTUBE ↗</span></a>
        <div class="documentary-story"><small dir="ltr">POLICE · 2015—2021</small><h3>שש שנים בתוך מציאות שבה החלטות פוגשות אנשים בקצה.</h3><p>המשטרה הייתה אחריות, מידע, שטח ואנשים. הווידאו הזה הוא רפלקציה מאוחרת שלי על היציאה — לא ניסיון להפוך שנים מורכבות לשורת תפקיד.</p><a href="https://www.youtube.com/watch?v=kS2CRiqRaXo" target="_blank" rel="noreferrer">לצפות במקור ↗</a></div>
      </article>

      <article class="documentary-moment" data-documentary-moment="fatherhood" data-life-moment="fatherhood">
        <a class="documentary-media" href="https://www.hidabroot.org/article/1179015" target="_blank" rel="noreferrer"><img src="https://storage.hidabroot.org/articles_new/327351_tumb_730X500.jpg" alt="סיפור האבהות של איגור ופרצקי" loading="lazy" decoding="async"><span class="documentary-source">PUBLIC STORY · 2023 ↗</span></a>
        <div class="documentary-story"><small dir="ltr">FATHERHOOD · PRESENCE</small><h3>אבהות הפכה את הסיפור האישי למבחן יומיומי.</h3><p>לא הוכחה שתיקנתי את העבר, אלא בחירה לחזור ולהיות שם. הסיפור יצא מהפיד והפך לשיחה רחבה יותר על נוכחות ואחריות.</p><a href="https://www.hidabroot.org/article/1179015" target="_blank" rel="noreferrer">לסיפור שפורסם ↗</a></div>
      </article>

      <article class="documentary-moment is-feature" data-documentary-moment="starton" data-life-moment="starton">
        <a class="documentary-media" href="https://holon.mynet.co.il/local_news/article/hjxqegkiq" target="_blank" rel="noreferrer"><img src="https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D1200%2Cq%3D85/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg" alt="איגור ופרצקי ו-StartOn בג׳סי כהן" loading="lazy" decoding="async"><span class="documentary-source">MYNET · JESSE COHEN · 2022 ↗</span></a>
        <div class="documentary-story"><small dir="ltr">STARTON · 2022 → NOW</small><h3>חזרתי דווקא למקום שממנו רציתי פעם לצאת.</h3><p>StartOn חיבר בין הילד שהייתי לבין המקום שרציתי שיהיה קיים לילדים אחרים: טכנולוגיה, יצירה, מבוגרים תומכים ושייכות — לפני שמשבר הופך לזהות.</p><a href="https://holon.mynet.co.il/local_news/article/hjxqegkiq" target="_blank" rel="noreferrer">לכתבה על החזרה לשכונה ↗</a></div>
      </article>

      <article class="documentary-moment" data-documentary-moment="public-voice" data-life-moment="public-voice">
        <a class="documentary-media" href="https://www.youtube.com/watch?v=AE5hDzLM5XU" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/AE5hDzLM5XU/maxresdefault.jpg" alt="איגור ופרצקי בחדשות 13" loading="lazy" decoding="async"><span class="documentary-source">NEWS 13 · PUBLIC INTERVIEW ↗</span></a>
        <div class="documentary-story"><small dir="ltr">PUBLIC VOICE · MEDIA</small><h3>לפעמים פוסט אישי מפסיק להיות רק שלי.</h3><p>אבהות, הונאות קשישים, חינוך וזהות עברו מחשבון אישי לשיחה ציבורית, ראיונות והפצה. מבחינתי ההשפעה נמצאת במסלול שאפשר לעקוב אחריו, לא רק במספר גדול.</p><a href="https://www.youtube.com/watch?v=AE5hDzLM5XU" target="_blank" rel="noreferrer">לראיון המקורי ↗</a></div>
      </article>

      <article class="documentary-moment" data-documentary-moment="create" data-life-moment="create">
        <a class="documentary-media" href="https://www.youtube.com/watch?v=jRjZjpqAgEw" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/jRjZjpqAgEw/maxresdefault.jpg" alt="NAWAN ft. VEPRETSKI — BIZZI" loading="lazy" decoding="async"><span class="documentary-source">MUSIC · OFFICIAL VIDEO ↗</span></a>
        <div class="documentary-story"><small dir="ltr">CREATE · MUSIC · CULTURE</small><h3>גם מוזיקה, הומור ושטויות הם ביוגרפיה.</h3><p>היצירה היא לא הפסקה מהחיים הרציניים. היא שכבה אחרת של אותו אדם — שפה, קצב, חברים וקהל שלא נכנסים למסמך או לתפקיד.</p><a href="https://www.youtube.com/watch?v=jRjZjpqAgEw" target="_blank" rel="noreferrer">ל־BIZZI ↗</a></div>
      </article>

      <article class="documentary-moment is-source" data-documentary-moment="leadership" data-life-moment="leadership">
        <a class="documentary-media documentary-source-frame leadership-frame" href="https://www.facebook.com/beytenu/videos/26702411802682636/" target="_blank" rel="noreferrer"><span dir="ltr">08 · 2023—2026</span><strong dir="ltr">PUBLIC<br>LEADERSHIP<br>TEST</strong><small>PUBLIC POLITICAL SOURCE · NO IMPLIED OUTCOME</small></a>
        <div class="documentary-story"><small dir="ltr">PUBLIC LEADERSHIP · POLITICS</small><h3>ניסיתי להיכנס לחדר שבו מתקבלות החלטות.</h3><p>הפעילות הציבורית והפוליטית היא חלק מהדרך. היא מוצגת כאן כפי שתועדה — בלי להפוך הפצה, נוכחות או שאיפה להוכחה לבחירה, מינוי או הסכמה ציבורית.</p><a href="https://www.facebook.com/beytenu/videos/26702411802682636/" target="_blank" rel="noreferrer">למקור הציבורי ↗</a></div>
      </article>

      <article class="documentary-moment is-now" data-documentary-moment="now" data-life-moment="now">
        <a class="documentary-media" href="https://www.youtube.com/shorts/k9haTADKG3M" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/k9haTADKG3M/maxresdefault.jpg" alt="איגור ופרצקי אצל Nawan, 2026" loading="lazy" decoding="async"><span class="documentary-source">EXTERNAL CREATOR · 2026 ↗</span></a>
        <div class="documentary-story"><small dir="ltr">NOW · 2026</small><h3>אני לא רוצה שהחיים יהפכו לארכיון. אני רוצה שהם יהפכו לדבר הבא.</h3><p>הסיפור ממשיך דרך StartOn, יצירה, עבודה ציבורית, אנשים ותוכן חדש. מכאן האתר מפסיק להסתכל אחורה ומתחיל לשאול מה בונים עכשיו.</p><a href="#now">לעכשיו ↓</a></div>
      </article>
    </section>

    `;

if(!html.includes('data-documentary-home="v2"')){
  const a=html.indexOf(start);
  const b=html.indexOf(end);
  if(a<0||b<0||b<=a) throw new Error('Cannot inject documentary homepage: expected hero/throughline anchors missing');
  html=html.slice(0,a)+documentary+html.slice(b);
  fs.writeFileSync(htmlPath,html);
  console.log('Injected 7YA documentary homepage v2');
}else{
  console.log('7YA documentary homepage v2 already present');
}

const documentaryCss=`
/* 7YA DOCUMENTARY HOME V2 */
.documentary-hero{position:relative;min-height:100svh;overflow:hidden;background:#070807;color:#f7f3eb}.documentary-hero-media{position:absolute;inset:0;margin:0}.documentary-hero-media img{width:100%;height:100%;object-fit:cover;object-position:center 20%;filter:saturate(.88) contrast(1.04)}.documentary-hero-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,6,5,.18) 0%,rgba(5,6,5,.38) 42%,rgba(5,6,5,.96) 88%),linear-gradient(0deg,rgba(5,6,5,.9),transparent 45%)}.documentary-hero-copy{position:relative;z-index:2;min-height:100svh;max-width:760px;margin-inline-start:auto;padding:clamp(110px,13vh,160px) 5vw 52px;display:flex;flex-direction:column;justify-content:flex-end}.documentary-kicker{margin:0;color:#f0d49a;font:800 11px/1.4 var(--mono);letter-spacing:.15em}.documentary-hero h1{margin:22px 0 20px;font:500 clamp(64px,8.2vw,140px)/.82 var(--serif);letter-spacing:-.075em}.documentary-hero h1 em{font-style:normal;color:#f0d49a}.documentary-lead{max-width:690px;margin:0;color:#dad6cd;font-size:clamp(17px,1.45vw,23px);line-height:1.65}.documentary-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:30px}.documentary-actions a{min-height:50px;padding:0 16px;display:inline-flex;align-items:center;justify-content:space-between;gap:28px;border:1px solid rgba(255,255,255,.3);text-decoration:none;font:850 10px/1 var(--mono);letter-spacing:.05em;background:rgba(7,8,7,.32);backdrop-filter:blur(10px)}.documentary-actions .documentary-primary{background:#f2ede3;color:#090a08;border-color:#f2ede3}.documentary-signature{margin:26px 0 0;color:#aaa69f;font:800 9px/1.3 var(--mono);letter-spacing:.1em}.life-film{background:#f0ece3;color:#0b0d0c;padding-bottom:clamp(80px,9vw,140px)}.life-film-intro{padding:clamp(84px,10vw,150px) 5vw clamp(70px,8vw,120px);display:grid;grid-template-columns:.35fr 1fr .55fr;gap:4vw;align-items:end;border-bottom:1px solid rgba(0,0,0,.16)}.life-film-intro>p:first-child{margin:0;font:900 10px/1.3 var(--mono);letter-spacing:.12em;color:#73766f}.life-film-intro h2{margin:0;font:500 clamp(54px,6.4vw,104px)/.88 var(--serif);letter-spacing:-.06em}.life-film-intro>p:last-child{margin:0;color:#50554e;font-size:16px;line-height:1.68}.documentary-moment{min-height:82svh;display:grid;grid-template-columns:minmax(0,1.12fr) minmax(360px,.88fr);border-bottom:1px solid rgba(0,0,0,.18)}.documentary-moment:nth-of-type(odd) .documentary-media{order:2}.documentary-media{position:relative;min-height:82svh;display:block;overflow:hidden;background:#111;color:#fff;text-decoration:none}.documentary-media>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.86) contrast(1.03);transition:transform .7s cubic-bezier(.2,.7,.2,1)}.documentary-media:hover>img{transform:scale(1.018)}.documentary-media:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 54%,rgba(5,6,5,.82))}.documentary-source{position:absolute;z-index:2;right:18px;bottom:18px;padding:8px 10px;background:rgba(7,8,7,.62);backdrop-filter:blur(10px);font:850 9px/1 var(--mono);letter-spacing:.08em}.documentary-story{padding:clamp(48px,7vw,110px) clamp(28px,5vw,78px);display:flex;flex-direction:column;justify-content:center}.documentary-story>small{font:900 10px/1.2 var(--mono);letter-spacing:.13em;color:#767a72}.documentary-story h3{max-width:12ch;margin:26px 0 22px;font:500 clamp(44px,5.2vw,82px)/.93 var(--serif);letter-spacing:-.055em}.documentary-story p{max-width:620px;margin:0;color:#4b5149;font-size:clamp(16px,1.2vw,20px);line-height:1.72}.documentary-story>a{width:max-content;margin-top:30px;padding-bottom:5px;border-bottom:1px solid #171a16;text-decoration:none;font:850 10px/1 var(--mono);letter-spacing:.06em}.documentary-source-frame{padding:clamp(28px,4vw,62px);display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at 80% 14%,rgba(240,212,154,.2),transparent 34%),linear-gradient(145deg,#181b18,#090b0a 72%)}.documentary-source-frame:before{content:'';position:absolute;inset:7%;border:1px solid rgba(255,255,255,.09);box-shadow:0 0 0 34px rgba(255,255,255,.012)}.documentary-source-frame:after{background:linear-gradient(180deg,transparent 45%,rgba(5,6,5,.68))}.documentary-source-frame span,.documentary-source-frame strong,.documentary-source-frame small{position:relative;z-index:2}.documentary-source-frame span{font:900 10px/1 var(--mono);letter-spacing:.12em;color:#f0d49a}.documentary-source-frame strong{margin:auto 0;font:500 clamp(52px,7vw,120px)/.82 var(--serif);letter-spacing:-.065em}.documentary-source-frame small{font:800 9px/1.35 var(--mono);letter-spacing:.09em;color:#a7aaa4}.service-frame{background:radial-gradient(circle at 15% 15%,rgba(132,154,169,.18),transparent 34%),linear-gradient(145deg,#151a1d,#080a0b 72%)}.leadership-frame{background:radial-gradient(circle at 70% 20%,rgba(219,184,120,.18),transparent 35%),linear-gradient(145deg,#1a1815,#090908 72%)}.documentary-moment.is-feature{min-height:92svh;background:#0c0e0d;color:#f5f1e8}.documentary-moment.is-feature .documentary-media{min-height:92svh}.documentary-moment.is-feature .documentary-story p{color:#b9beb6}.documentary-moment.is-feature .documentary-story>small{color:#f0d49a}.documentary-moment.is-feature .documentary-story>a{border-color:#f0d49a;color:#f0d49a}.documentary-moment.is-now{background:#171a16;color:#f6f2e9}.documentary-moment.is-now .documentary-story p{color:#bdc2b9}.documentary-moment.is-now .documentary-story>small{color:#f0d49a}.documentary-moment.is-now .documentary-story>a{border-color:#f0d49a;color:#f0d49a}.documentary-hero~.throughline{display:none!important}@media(max-width:980px){.life-film-intro{grid-template-columns:1fr;gap:18px}.documentary-moment{grid-template-columns:1fr;min-height:0}.documentary-moment:nth-of-type(odd) .documentary-media{order:0}.documentary-media,.documentary-moment.is-feature .documentary-media{min-height:64svh}.documentary-story{min-height:52svh}.documentary-story h3{max-width:15ch}}@media(max-width:720px){.documentary-hero{min-height:100svh}.documentary-hero-media img{object-position:center 16%}.documentary-hero-shade{background:linear-gradient(0deg,rgba(5,6,5,.98) 0%,rgba(5,6,5,.72) 42%,rgba(5,6,5,.12) 76%)}.documentary-hero-copy{min-height:100svh;padding:92px 18px 30px;justify-content:flex-end}.documentary-kicker{font-size:8px}.documentary-hero h1{font-size:clamp(58px,17vw,90px);margin:17px 0 15px}.documentary-lead{font-size:15px;line-height:1.6}.documentary-actions{display:grid;width:100%}.documentary-actions a{width:100%}.documentary-signature{font-size:7px}.life-film-intro{padding:72px 18px 58px}.life-film-intro h2{font-size:clamp(48px,14vw,72px)}.documentary-media,.documentary-moment.is-feature .documentary-media{min-height:62svh}.documentary-story{min-height:auto;padding:48px 18px 62px}.documentary-story h3{font-size:clamp(42px,12.5vw,64px);margin:19px 0 18px}.documentary-story p{font-size:16px}.documentary-source-frame{padding:24px}.documentary-source-frame strong{font-size:clamp(52px,17vw,82px)}.documentary-source{right:12px;bottom:12px;font-size:7px}}@media(prefers-reduced-motion:reduce){.documentary-media>img{transition:none!important}.documentary-media:hover>img{transform:none!important}}
`;
if(!css.includes('/* 7YA DOCUMENTARY HOME V2 */')){
  fs.appendFileSync(cssPath,documentaryCss);
  console.log('Appended 7YA documentary homepage v2 styles');
}
