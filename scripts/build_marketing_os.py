#!/usr/bin/env python3
"""Build a source-gated marketing queue from the 7YA public publication index."""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INDEX = ROOT / "packages" / "app" / "public" / "data" / "publication-index.json"
DEFAULT_CONFIG = ROOT / "marketing" / "viral-archetypes.json"
DEFAULT_OUTPUT_DIR = ROOT / "artifacts" / "marketing"

VERIFICATION_WEIGHT = {
    "VERIFIED_SOURCE": 50,
    "USER_EXPORT_VERIFIED": 46,
    "PUBLIC_INDEXED": 40,
    "PUBLIC_SNAPSHOT": 36,
    "CURATED_SOURCE": 32,
    "VERIFY": 0,
}
RELATIONSHIP_WEIGHT = {
    "ORIGINAL": 28,
    "INTERVIEWED": 25,
    "DISTRIBUTED": 22,
    "REPOSTED": 20,
    "RE_USED": 18,
    "MENTIONED": 16,
    "OWNED_MIRROR": 15,
    "EMBEDDED": 12,
    "SHARED": 10,
}
PLATFORM_WEIGHT = {
    "Television": 8,
    "Press": 8,
    "Podcast": 7,
    "Education": 7,
    "YouTube": 6,
    "Facebook": 5,
    "Instagram": 5,
    "TikTok": 5,
    "LinkedIn": 5,
    "Web": 4,
}

CTA_BY_PILLAR = {
    "origin_to_service": "Read the documented journey on 7ya.io/journey/",
    "fatherhood_and_presence": "Join the public conversation through 7ya.io/talk/",
    "immigrant_identity": "Explore the multilingual documented journey on 7ya.io/igor-vepretski/",
    "protection_and_trust": "Open the cited source and use the evidence before sharing.",
    "starton_social_impact": "See the StartOn mission at starton.org.il and 7ya.io/starton/",
    "public_safety_explainer": "Review the source and share only the verified guidance.",
    "creator_archive": "Explore the indexed public archive at 7ya.io/index-public/",
    "civic_voice": "Read the source before responding or reposting.",
    "documented_public_history": "Open the evidence-linked public record.",
}

FORMAT_ROTATION = (
    "short_video_hook",
    "carousel_or_thread",
    "authority_post",
)


@dataclass(frozen=True)
class Candidate:
    item: dict[str, Any]
    pillar: str
    score: int
    gate: str
    reasons: tuple[str, ...]


def load_json(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"Missing required file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {path}: {exc}") from exc


def classify_pillar(item: dict[str, Any], rules: list[dict[str, Any]]) -> str:
    haystack = " ".join(
        str(item.get(key, "")).lower()
        for key in ("title", "publisher", "platform", "relationship")
    )
    for rule in rules:
        if any(str(keyword).lower() in haystack for keyword in rule.get("keywords", [])):
            return str(rule["pillar"])

    relationship = str(item.get("relationship", ""))
    if relationship in {"DISTRIBUTED", "RE_USED"}:
        return "civic_voice"
    return "documented_public_history"


def score_item(
    item: dict[str, Any],
    pillar: str,
    priority_sources: dict[str, Any],
) -> Candidate:
    verification = str(item.get("verification", "VERIFY"))
    relationship = str(item.get("relationship", ""))
    platform = str(item.get("platform", ""))

    verification_score = VERIFICATION_WEIGHT.get(verification, 0)
    relationship_score = RELATIONSHIP_WEIGHT.get(relationship, 0)
    platform_score = PLATFORM_WEIGHT.get(platform, 3)
    priority = priority_sources.get(str(item.get("id", "")), {})
    priority_score = int(priority.get("bonus", 0)) if isinstance(priority, dict) else 0
    priority_reason = (
        str(priority.get("reason", "historic public resonance signal"))
        if isinstance(priority, dict)
        else ""
    )

    reasons = [
        f"verification={verification} (+{verification_score})",
        f"relationship={relationship} (+{relationship_score})",
        f"platform={platform or 'unknown'} (+{platform_score})",
        f"pillar={pillar}",
    ]
    if priority_score:
        reasons.append(f"priority_signal={priority_reason} (+{priority_score})")

    gate = (
        "APPROVE"
        if verification
        in {
            "VERIFIED_SOURCE",
            "USER_EXPORT_VERIFIED",
            "PUBLIC_INDEXED",
            "PUBLIC_SNAPSHOT",
            "CURATED_SOURCE",
        }
        else "VERIFY"
    )

    return Candidate(
        item=item,
        pillar=pillar,
        score=verification_score
        + relationship_score
        + platform_score
        + priority_score,
        gate=gate,
        reasons=tuple(reasons),
    )


def brief_for(candidate: Candidate, language: str, day: int, slot: int) -> dict[str, Any]:
    item = candidate.item
    title = str(item.get("title", "Public record"))
    source_url = str(item.get("url", ""))
    format_name = FORMAT_ROTATION[(slot - 1) % len(FORMAT_ROTATION)]
    sensitive = candidate.pillar in {"public_safety_explainer", "civic_voice"}

    return {
        "day": day,
        "slot": slot,
        "language": language,
        "format": format_name,
        "pillar": candidate.pillar,
        "source_id": item.get("id"),
        "source_title": title,
        "source_url": source_url,
        "publisher": item.get("publisher"),
        "source_language": item.get("language", "multi"),
        "relationship": item.get("relationship"),
        "verification": item.get("verification"),
        "score": candidate.score,
        "hook_instruction": (
            f"Open with a first-person tension or concrete scene derived only from '{title}'. "
            "Do not add dates, numbers, affiliations, or outcomes absent from the source."
        ),
        "story_instruction": (
            "Connect the historic signal to Igor Vepretski's current founder-led themes: "
            "documented journey, public service, StartOn, digital trust, or multilingual public communication. "
            "Keep the source relationship explicit."
        ),
        "cta": CTA_BY_PILLAR[candidate.pillar],
        "publication_gate": candidate.gate,
        "manual_review_required": True,
        "extra_review": (
            "political_or_safety_review" if sensitive else "standard_source_review"
        ),
        "forbidden": [
            "invented reach, views, followers, awards, partnerships, or endorsements",
            "automated likes, follows, comments, or mass replies",
            "private details not contained in the cited public source",
            "copying third-party media without rights or meaningful original context",
        ],
        "score_reasons": list(candidate.reasons),
    }


def build_queue(index: dict[str, Any], config: dict[str, Any]) -> dict[str, Any]:
    rules = list(config.get("pillar_rules", []))
    priority_sources = dict(config.get("priority_sources", {}))
    candidates = [
        score_item(item, classify_pillar(item, rules), priority_sources)
        for item in index.get("sources", [])
        if isinstance(item, dict)
    ]
    approved = [candidate for candidate in candidates if candidate.gate == "APPROVE"]
    approved.sort(key=lambda candidate: (-candidate.score, str(candidate.item.get("id", ""))))

    if not approved:
        raise SystemExit("No source-gated records are eligible for campaign planning.")

    cadence = config.get("cadence", {})
    days = int(cadence.get("days", 7))
    slots_per_day = int(cadence.get("slots_per_day", 3))
    languages = list(config.get("languages", ["he", "ru", "en"]))
    total_slots = days * slots_per_day

    queue: list[dict[str, Any]] = []
    for index_position in range(total_slots):
        day = (index_position // slots_per_day) + 1
        slot = (index_position % slots_per_day) + 1
        candidate = approved[index_position % len(approved)]
        language = languages[index_position % len(languages)]
        queue.append(brief_for(candidate, language, day, slot))

    verify_backlog = [
        {
            "source_id": candidate.item.get("id"),
            "title": candidate.item.get("title"),
            "url": candidate.item.get("url"),
            "verification": candidate.item.get("verification"),
            "required_action": (
                "Attach a public URL, screenshot/export, capture date, and conservative wording before use."
            ),
        }
        for candidate in candidates
        if candidate.gate == "VERIFY"
    ]

    return {
        "schema_version": "1.0",
        "system": config.get("system", "7YA Viral Memory Engine"),
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "canonical_entity": index.get(
            "canonical_entity", {"name": "Igor Vepretski"}
        ),
        "objective": config.get("objective"),
        "policy": {
            "evidence_first": True,
            "manual_approval_required": True,
            "auto_publish_enabled": False,
            "reason": (
                "Platform authorization, rights review, factual review, and final human approval are required."
            ),
        },
        "source_summary": {
            "records_total": len(candidates),
            "eligible_records": len(approved),
            "verify_backlog": len(verify_backlog),
        },
        "queue": queue,
        "verify_backlog": verify_backlog,
    }


def render_markdown(queue: dict[str, Any]) -> str:
    summary = queue["source_summary"]
    lines = [
        "# 7YA Viral Memory Engine — Review Queue",
        "",
        f"Generated: `{queue['generated_at']}`",
        "",
        f"- Source records: **{summary['records_total']}**",
        f"- Eligible source-gated records: **{summary['eligible_records']}**",
        f"- Verification backlog: **{summary['verify_backlog']}**",
        f"- Planned briefs: **{len(queue['queue'])}**",
        "",
        "## Operating boundary",
        "",
        (
            "This queue automates discovery, ranking, multilingual briefing, and evidence checks. "
            "It does not auto-publish, fabricate metrics, automate engagement, or imply endorsements."
        ),
        "",
        "## Seven-day queue",
        "",
        "| Day | Slot | Language | Format | Pillar | Source | Gate |",
        "|---:|---:|:---:|---|---|---|:---:|",
    ]
    for item in queue["queue"]:
        source = str(item["source_title"]).replace("|", "\\|")
        lines.append(
            f"| {item['day']} | {item['slot']} | {item['language']} | "
            f"{item['format']} | {item['pillar']} | {source} | "
            f"{item['publication_gate']} |"
        )

    if queue["verify_backlog"]:
        lines.extend(["", "## Verification backlog", ""])
        for item in queue["verify_backlog"]:
            lines.append(
                f"- `{item['source_id']}` — {item['title']}: {item['required_action']}"
            )

    lines.append("")
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--index", type=Path, default=DEFAULT_INDEX)
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    index = load_json(args.index)
    config = load_json(args.config)
    queue = build_queue(index, config)

    args.output_dir.mkdir(parents=True, exist_ok=True)
    json_path = args.output_dir / "marketing-queue.json"
    md_path = args.output_dir / "marketing-brief.md"
    json_path.write_text(
        json.dumps(queue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    md_path.write_text(render_markdown(queue), encoding="utf-8")

    print(
        f"Built {len(queue['queue'])} briefs from "
        f"{queue['source_summary']['eligible_records']} eligible sources."
    )


if __name__ == "__main__":
    main()
