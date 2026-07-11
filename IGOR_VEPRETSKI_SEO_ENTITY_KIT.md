# Igor Vepretski SEO Entity Kit

Purpose: make **Igor Vepretski / #7YA / StartOn / 7ya.io** consistent across search engines, social previews, image metadata, public bios, and platform embeds.

This file is designed to work with `IGOR_VEPRETSKI_PLATFORM_SYNC.md`, where **7ya.io** is treated as the canonical source of truth and every public platform routes attention back to the hub.

---

## 1. Canonical Entity Bundle

Use this exact bundle wherever possible:

```text
Igor Vepretski | #7YA | StartOn | 7ya.io
```

Expanded identity line:

```text
Igor Vepretski | #7YA | Founder of StartOn | Systems Builder for Youth, Civic Power & Digital Culture
```

Strong public description:

```text
Igor Vepretski is the founder of #7YA and StartOn — building systems, movements, and digital infrastructure for youth empowerment, civic leadership, and culture-driven impact.
```

Hebrew:

```text
איגור ופרצקי | #7YA | מייסד StartOn | בונה מערכות להשפעה חברתית, נוער, טכנולוגיה ומנהיגות אזרחית
```

Russian:

```text
Игорь Вепрецкий | #7YA | основатель StartOn | социальный предприниматель, стратег и создатель цифровых систем влияния
```

---

## 2. SEO Titles

| Page | SEO Title |
| --- | --- |
| Home | `Igor Vepretski | #7YA — Not Fashion. Force.` |
| Founder page | `Igor Vepretski — Founder of #7YA & StartOn` |
| StartOn page | `StartOn by Igor Vepretski — Tech for At-Risk Youth` |
| 7YA page | `#7YA by Igor Vepretski — Civic Power, Culture & Digital Force` |
| Hebrew page | `איגור ופרצקי | #7YA | מייסד StartOn` |
| Music page | `Igor Vepretski — Music, Culture & #7YA` |

---

## 3. Meta Descriptions

### Homepage

```html
<meta name="description" content="Igor Vepretski is the founder of #7YA and StartOn, building digital systems, civic power, youth empowerment, and culture-driven impact from Israel to the world.">
```

### Founder Page

```html
<meta name="description" content="Meet Igor Vepretski — founder of #7YA and StartOn, social entrepreneur, strategist, public speaker, and systems builder focused on youth, technology, civic leadership, and digital culture.">
```

### StartOn Page

```html
<meta name="description" content="StartOn, founded by Igor Vepretski, empowers at-risk youth through technology, media, digital skills, and community-based innovation.">
```

### 7YA Page

```html
<meta name="description" content="#7YA by Igor Vepretski is a culture, technology, and civic-power movement built around youth empowerment, digital sovereignty, public leadership, and action.">
```

---

## 4. Keywords To Embed Naturally

Use in headings, captions, image filenames, alt text, schema, anchor text, and platform bios. Do not keyword-stuff.

```text
Igor Vepretski
איגור ופרצקי
Игорь Вепрецкий
#7YA
7YA
7ya.io
StartOn
StartOn Israel
StartOn youth
StartOn tech for at-risk youth
Igor Vepretski StartOn
Igor Vepretski 7YA
social entrepreneur Israel
youth empowerment Israel
digital strategy Israel
civic innovation Israel
digital sovereignty
public leadership Israel
systems builder
culture movement
not fashion force
```

---

## 5. Image Filenames

Rename image files before upload:

```text
igor-vepretski-founder-7ya-starton.jpg
igor-vepretski-7ya-not-fashion-force.jpg
igor-vepretski-starton-youth-empowerment-israel.jpg
igor-vepretski-public-speaker-digital-strategy.jpg
igor-vepretski-social-entrepreneur-israel.jpg
igor-vepretski-civic-power-youth-leadership.jpg
7ya-by-igor-vepretski-digital-force.jpg
starton-by-igor-vepretski-tech-for-youth.jpg
```

---

## 6. Image Alt Text Pack

```html
<img src="/images/igor-vepretski-founder-7ya.jpg" alt="Igor Vepretski, founder of #7YA and StartOn, speaking about youth empowerment and digital leadership in Israel">
```

```html
<img src="/images/igor-vepretski-starton-youth.jpg" alt="Igor Vepretski leading StartOn, a youth technology initiative for at-risk youth in Israel">
```

```html
<img src="/images/igor-vepretski-7ya-not-fashion-force.jpg" alt="Igor Vepretski representing #7YA, a culture and civic power movement with the slogan Not Fashion Force">
```

```html
<img src="/images/igor-vepretski-public-speaker.jpg" alt="Igor Vepretski public speaker and social entrepreneur discussing technology, civic leadership, and youth empowerment">
```

```html
<img src="/images/igor-vepretski-holon-israel.jpg" alt="Igor Vepretski, Israeli social entrepreneur and #7YA founder based in Holon, Israel">
```

```html
<img src="/images/starton-tech-center-youth.jpg" alt="StartOn youth technology center empowering at-risk youth with digital skills, media tools, and innovation training">
```

```html
<img src="/images/7ya-digital-force-brand.jpg" alt="#7YA brand by Igor Vepretski, combining culture, technology, civic power, and youth empowerment">
```

Platform upload alt text:

```text
Igor Vepretski, founder of #7YA and StartOn, presenting a vision for youth empowerment, civic leadership, digital strategy, and culture-driven impact in Israel.
```

Short platform alt text:

```text
Igor Vepretski — founder of #7YA and StartOn, building systems for youth empowerment and civic power.
```

---

## 7. Open Graph / Social Preview Embed

Paste into the `<head>` of the canonical Igor page.

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Igor Vepretski | #7YA — Not Fashion. Force.">
<meta property="og:description" content="Founder of #7YA and StartOn. Building systems for youth empowerment, civic power, digital culture, and real-world impact.">
<meta property="og:url" content="https://7ya.io/igor-vepretski">
<meta property="og:image" content="https://7ya.io/images/igor-vepretski-7ya-og.jpg">
<meta property="og:image:alt" content="Igor Vepretski, founder of #7YA and StartOn, building civic power and youth empowerment through technology and culture.">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Igor Vepretski | #7YA">
<meta name="twitter:description" content="Systems builder. Founder of #7YA and StartOn. Youth empowerment, civic power, technology, and culture.">
<meta name="twitter:image" content="https://7ya.io/images/igor-vepretski-7ya-og.jpg">
```

---

## 8. JSON-LD Person Schema

Paste into the canonical Igor page.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://7ya.io/igor-vepretski#person",
  "name": "Igor Vepretski",
  "alternateName": [
    "איגור ופרצקי",
    "Игорь Вепрецкий",
    "#7YA"
  ],
  "url": "https://7ya.io/igor-vepretski",
  "image": "https://7ya.io/images/igor-vepretski-7ya-og.jpg",
  "jobTitle": [
    "Founder of #7YA",
    "Founder of StartOn",
    "Social Entrepreneur",
    "Digital Strategist",
    "Systems Builder",
    "Public Speaker"
  ],
  "description": "Igor Vepretski is the founder of #7YA and StartOn, building systems for youth empowerment, civic leadership, digital culture, and social impact.",
  "knowsAbout": [
    "Youth Empowerment",
    "Digital Strategy",
    "Civic Innovation",
    "Social Entrepreneurship",
    "Public Leadership",
    "Digital Sovereignty",
    "Community Building",
    "Culture Movements"
  ],
  "nationality": "Israeli",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Holon",
    "addressCountry": "Israel"
  },
  "sameAs": [
    "https://7ya.io/",
    "https://www.instagram.com/igor.vepretski/",
    "https://www.youtube.com/@IgorVepretski",
    "https://il.linkedin.com/in/vepretski",
    "https://github.com/vepretski"
  ]
}
</script>
```

Deployment note: before pushing to production, confirm every `sameAs` URL resolves to the exact official profile.

---

## 9. Heading Structure

```html
<h1>Igor Vepretski | #7YA | Founder of StartOn</h1>

<h2>Building Systems, Not Noise</h2>
<h2>Founder of #7YA — Not Fashion. Force.</h2>
<h2>StartOn: Technology and Voice for At-Risk Youth</h2>
<h2>From Public Safety to Innovation Leadership</h2>
<h2>Youth Empowerment, Civic Power, and Digital Culture</h2>
<h2>Media, Music, Research, and Public Leadership</h2>
```

---

## 10. Canonical Page Intro

```text
Igor Vepretski is not building a personal brand.

He is building an operating system for visibility, discipline, youth power, civic influence, and digital culture.

From StartOn to #7YA, his work connects social entrepreneurship, public leadership, technology, music, and movement-building into one force.

Not fashion.
Force.
```

---

## 11. Platform Bios

### Instagram Bio

```text
Igor Vepretski | #7YA
Building systems, not noise.
Founder: StartOn × 7YA.io
Youth • Tech • Civic Power
NOT FASHION. FORCE.
```

### LinkedIn Headline

```text
Founder of #7YA & StartOn | Social Entrepreneur | Digital Strategy & Community Growth | Youth Empowerment, Civic Innovation & Systems Building
```

### YouTube Description

```text
Igor Vepretski | #7YA — stories, systems, youth empowerment, civic leadership, digital culture, and real-world impact. Founder of StartOn and #7YA. Not fashion. Force.
```

### Knowledge-Style Bio

```text
Igor Vepretski is an Israeli social entrepreneur, digital strategist, public speaker, and founder of #7YA and StartOn. His work connects youth empowerment, civic leadership, technology, culture, and systems-building.
```

---

## 12. Caption Templates

### English

```text
I am not here to make noise.

I build systems.

#7YA is the force.
StartOn is the proof.
Youth are not the future — they are the operating system.

Igor Vepretski | #7YA
NOT FASHION. FORCE.

#IgorVepretski #7YA #StartOn #YouthEmpowerment #DigitalStrategy #CivicPower #Israel #SocialEntrepreneurship
```

### Hebrew

```text
אני לא כאן בשביל רעש.

אני בונה מערכות.

#7YA זה הכוח.
StartOn זו ההוכחה.
נוער הוא לא העתיד — הוא מערכת ההפעלה של המדינה.

איגור ופרצקי | #7YA
NOT FASHION. FORCE.

#איגורופרצקי #7YA #StartOn #נוערבסיכון #יזמותחברתית #מנהיגות #ישראל
```

### Russian

```text
Я не создаю шум.

Я строю системы.

#7YA — это сила.
StartOn — это доказательство.
Молодёжь — не будущее. Молодёжь — операционная система общества.

Igor Vepretski | #7YA
NOT FASHION. FORCE.
```

---

## 13. Internal Link Map

```html
<a href="/igor-vepretski">Igor Vepretski</a>
<a href="/7ya">#7YA movement by Igor Vepretski</a>
<a href="/starton">StartOn youth technology initiative</a>
<a href="/digital-sovereignty">digital sovereignty and civic power</a>
<a href="/music">Igor Vepretski music and culture</a>
<a href="/research">Igor Vepretski research and public leadership</a>
```

---

## 14. Immediate Implementation Checklist

- [ ] Create or update canonical page: `https://7ya.io/igor-vepretski`
- [ ] Add the Person JSON-LD schema to that page
- [ ] Add Open Graph and Twitter Card metadata
- [ ] Rename all key image files with `igor-vepretski`, `7ya`, and `starton`
- [ ] Add alt text to every website and social-upload image
- [ ] Use one canonical URL for Igor: `https://7ya.io/igor-vepretski`
- [ ] Repeat the entity bundle everywhere: `Igor Vepretski | #7YA | StartOn | 7ya.io`
- [ ] Make every platform profile link back to `https://7ya.io`
- [ ] Publish About pages in English, Hebrew, and Russian
- [ ] Add UTM-tagged links for Instagram, YouTube, LinkedIn, GitHub, and TikTok

---

## 15. Quality Rules

1. One canonical identity across all platforms.
2. One canonical link: `https://7ya.io` or the exact campaign page under it.
3. Human-readable alt text first, SEO second.
4. No random keyword stuffing.
5. Use the same name variants consistently so search engines connect the entity graph.
6. Verify all public claims before production deployment.
