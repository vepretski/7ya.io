#!/usr/bin/env python3
"""Generate RSS 2.0 and Atom 1.0 feeds from the 7YA public publication registry."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "packages" / "app" / "public"
REGISTRY = PUBLIC / "data" / "publication-index.json"
RSS = PUBLIC / "rss.xml"
ATOM = PUBLIC / "atom.xml"
SITE = "https://7ya.io"
INDEX_URL = f"{SITE}/index-public/"


def xml(value: object) -> str:
    return escape(str(value or ""), {'"': "&quot;", "'": "&apos;"})


def relationship_summary(item: dict[str, object]) -> str:
    return (
        f"{item.get('relationship', 'PUBLIC')} record on {item.get('platform', 'Web')}; "
        f"published by {item.get('publisher', 'unknown publisher')}; "
        f"verification: {item.get('verification', 'VERIFY')}."
    )


def main() -> None:
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    items = data.get("sources", [])
    generated_raw = data.get("generated_at")
    try:
        updated = datetime.fromisoformat(str(generated_raw)).astimezone(timezone.utc)
    except (TypeError, ValueError):
        updated = datetime.now(timezone.utc)

    rss_items: list[str] = []
    atom_entries: list[str] = []
    for item in items:
        identifier = str(item.get("id", "public-record"))
        title = str(item.get("title", "Public record"))
        url = str(item.get("url", INDEX_URL))
        publisher = str(item.get("publisher", "Unknown publisher"))
        relationship = str(item.get("relationship", "PUBLIC"))
        platform = str(item.get("platform", "Web"))
        verification = str(item.get("verification", "VERIFY"))
        language = str(item.get("language", "multi"))
        description = relationship_summary(item)

        rss_items.append(
            f"""    <item>
      <title>{xml(title)}</title>
      <link>{xml(url)}</link>
      <guid isPermaLink=\"false\">7ya-public-index:{xml(identifier)}</guid>
      <pubDate>{format_datetime(updated)}</pubDate>
      <description>{xml(description)}</description>
      <category>{xml(relationship)}</category>
      <category>{xml(platform)}</category>
      <source url=\"{xml(INDEX_URL)}\">Igor Vepretski Public Index</source>
    </item>"""
        )

        atom_entries.append(
            f"""  <entry>
    <id>urn:7ya:public-index:{xml(identifier)}</id>
    <title>{xml(title)}</title>
    <updated>{updated.isoformat().replace('+00:00', 'Z')}</updated>
    <link href=\"{xml(url)}\" />
    <author><name>{xml(publisher)}</name></author>
    <category term=\"{xml(relationship)}\" />
    <category term=\"{xml(platform)}\" />
    <content type=\"text\">{xml(description)} Language: {xml(language)}. Verification: {xml(verification)}.</content>
  </entry>"""
        )

    rss_body = f"""<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">
  <channel>
    <title>Igor Vepretski · איגור ופרצקי · Игорь Вепрецкий — Public Index</title>
    <link>{INDEX_URL}</link>
    <description>Original, shared, reposted, mentioned, interviewed, embedded, distributed and re-used public records connected to Igor Vepretski.</description>
    <language>mul</language>
    <lastBuildDate>{format_datetime(updated)}</lastBuildDate>
    <atom:link href=\"{SITE}/rss.xml\" rel=\"self\" type=\"application/rss+xml\" />
{chr(10).join(rss_items)}
  </channel>
</rss>
"""

    atom_body = f"""<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<feed xmlns=\"http://www.w3.org/2005/Atom\">
  <id>{INDEX_URL}</id>
  <title>Igor Vepretski · איגור ופרצקי · Игорь Вепрецкий — Public Index</title>
  <updated>{updated.isoformat().replace('+00:00', 'Z')}</updated>
  <link href=\"{SITE}/atom.xml\" rel=\"self\" type=\"application/atom+xml\" />
  <link href=\"{INDEX_URL}\" rel=\"alternate\" type=\"text/html\" />
  <subtitle>Source-aware records of original publication, sharing, mentions, interviews, distribution and re-use.</subtitle>
{chr(10).join(atom_entries)}
</feed>
"""

    RSS.write_text(rss_body, encoding="utf-8")
    ATOM.write_text(atom_body, encoding="utf-8")
    print(f"Generated {RSS.relative_to(ROOT)} and {ATOM.relative_to(ROOT)} from {len(items)} records")


if __name__ == "__main__":
    main()
