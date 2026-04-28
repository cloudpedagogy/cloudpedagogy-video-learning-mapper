# Project Specification: Video Learning Mapper

## Purpose
The primary purpose of this tool is to transform raw, unstructured transcript data into structured, reusable learning content. It acts as an intermediary layer between video hosting platforms and course authoring environments.

## Scope
- Local-first, browser-based transcript processing.
- Rule-based structuring (time-mapping, keyword extraction, and section segmenting).
- Output generation for human review and inclusion in static sites (like Quarto).

## Non-Goals (V1)
- **No AI:** The tool relies entirely on deterministic, rule-based algorithms. There is no LLM integration.
- **No Backend:** No server infrastructure is required to process data. All data remains on the user's machine.
- **No Platform-Specific Integrations:** It does not authenticate with Panopto or Zoom APIs. It relies on standard exported text formats.

## Architecture
- Built on **Vite + React + TypeScript**.
- Uses HTML5 `FileReader` API for ingestion.
- Functional processor modules (`parser.ts`, `cleaner.ts`, `mapper.ts`, etc.) operate purely on state data.
- React `useMemo` is heavily utilised to instantly recalculate outputs when configuration toggles change.

## Governance Alignment
- **Audit:** Generates an audit table flagging non-compliant or difficult-to-learn-from video assets (e.g. missing transcripts, long unsegmented durations).
- **Accessibility:** By producing clean text and Quarto markdown, it enables educators to easily provide high-quality text alternatives to video content.
- **Content Visibility:** Forces video content out of closed silos and into inspectable, searchable text documents.

## Capability Alignment
Supports the educator's ability to efficiently structure and reuse content without relying on opaque "black box" AI tools. It provides deterministic, editable outputs.

## Future Extensions (Post-V1)
- Optional, controlled AI layer for semantic summarisation (only if explicitly enabled).
- Panopto/Zoom API integration for direct fetching (would require an OAuth proxy or backend).
- CLI version for headless batch processing in CI/CD pipelines.
