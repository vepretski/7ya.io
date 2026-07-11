#!/usr/bin/env python3
"""Fail a 7YA.IO release when Evidence Ledger v3 regresses."""

from __future__ import annotations

import json
from pathlib import Path

LEDGER_PATH = Path("packages/app/public/data/igor-evidence-ledger-v3.json")


def fail(message: str) -> None:
    raise SystemExit(f"Evidence Ledger v3 validation failed: {message}")


def main() -> None:
    if not LEDGER_PATH.is_file():
        fail(f"missing {LEDGER_PATH}")

    ledger = json.loads(LEDGER_PATH.read_text(encoding="utf-8"))
    if ledger.get("ledger_name") != "7YA.IO Igor Vepretski Evidence Ledger":
        fail("unexpected ledger_name")
    if ledger.get("version") != "v3":
        fail("version must be v3")

    records = ledger.get("records", [])
    held = ledger.get("held", [])
    if len(records) != 22:
        fail(f"expected 22 public records, found {len(records)}")
    if len(held) != 5:
        fail(f"expected 5 held records, found {len(held)}")

    ids = [item.get("record_id") for item in records]
    if len(ids) != len(set(ids)):
        fail("duplicate public record IDs")
    if "REC110" in ids:
        fail("REC110 must remain outside the public record list")
    if "REC110" not in {item.get("record_id") for item in held}:
        fail("REC110 must remain explicitly held")

    expected_levels = {"A": 9, "B": 8, "C": 5}
    actual_levels = {
        level: sum(item.get("evidence_level") == level for item in records)
        for level in expected_levels
    }
    if actual_levels != expected_levels:
        fail(f"level counts changed: {actual_levels}")

    by_id = {item["record_id"]: item for item in records}
    required_corrections = {
        "REC104": ("published_date", "2022-11-10"),
        "REC105": ("published_date", "2022-11-27"),
        "REC106": ("published_date", "2024-01-07"),
        "REC108": ("published_date", "2022-09-20"),
        "REC120": ("evidence_level", "C"),
    }
    for record_id, (field, expected) in required_corrections.items():
        if by_id.get(record_id, {}).get(field) != expected:
            fail(f"{record_id}.{field} must be {expected!r}")

    rec113 = by_id.get("REC113", {})
    if rec113.get("media_type") != "audio":
        fail("REC113 must be classified as audio")
    if rec113.get("category") != "audio_narrative":
        fail("REC113 must be classified as audio_narrative")
    if "B0D3YKRH3Q" not in rec113.get("source_url", ""):
        fail("REC113 must use corrected ASIN B0D3YKRH3Q")
    if "book" in (rec113.get("category", "") + " " + rec113.get("media_type", "")).lower():
        fail("REC113 must not be classified as a book")

    for item in records:
        url = item.get("source_url", "")
        if not url.startswith("https://"):
            fail(f"{item.get('record_id')} has no canonical HTTPS URL")
        lowered = url.lower()
        if "..." in url or "to be confirmed" in lowered or "utm_source=" in lowered:
            fail(f"{item.get('record_id')} contains a placeholder or tracking URL")
        if not item.get("source_establishes"):
            fail(f"{item.get('record_id')} lacks source_establishes")
        if not item.get("source_does_not_independently_establish"):
            fail(f"{item.get('record_id')} lacks source boundary")
        if item.get("evidence_level") not in {"A", "B", "C"}:
            fail(f"{item.get('record_id')} is not public-safe")

    summary = ledger.get("summary", {})
    if summary.get("placeholder_urls") != 0:
        fail("placeholder_urls must remain zero")
    if summary.get("public_records") != len(records):
        fail("summary public_records does not match records")
    if summary.get("held_records") != len(held):
        fail("summary held_records does not match held list")

    print(
        "Evidence Ledger v3 valid: "
        f"{len(records)} public records, {len(held)} held, levels {actual_levels}"
    )


if __name__ == "__main__":
    main()
