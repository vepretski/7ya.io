# Vercel rebuild trigger — 2026-08-24

Reason: independent production recovery check after AppDeploy custom-domain serving remained stale despite newer applied source snapshots.

Target branch: restoration-plus/ui-shell-20260815

This commit intentionally changes no runtime behavior. Its only purpose is to trigger a fresh Vercel preview build and verify whether the last failure was the transient GitHub 504 while resolving ghostty-web.
