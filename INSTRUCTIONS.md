# User Instructions: Video Learning Mapper

This guide explains how to use the CloudPedagogy Video Learning Mapper to process your video transcripts.

## 1. Uploading Transcripts
- Supported formats: `.txt`, `.vtt`, `.srt`, and `.csv`.
- Drag and drop your transcript files into the upload zone, or click to open the file browser.
- You can upload multiple files at once. Use the sidebar to switch between the active file being processed.

## 2. Cleaning Transcripts
- Select the **Clean Transcript** tab to view the output.
- In the Configuration Panel, you can toggle:
  - **Remove filler words**: Strips words like "um", "uh", "ah" from the text.
  - **Remove duplicate lines**: Helps clean up auto-generated captions that repeat phrases.
  - **Merge short broken lines**: Combines fragmented captions into readable paragraphs.

## 3. Generating Timestamp Maps
- Select the **Video Map** tab.
- This view breaks the video down into chronological segments.
- Adjust the **Segment Length (Minutes)** in the Configuration Panel to change the size of the blocks (default is 3 minutes).

## 4. Extracting Keywords
- Select the **Keywords** tab.
- The tool automatically filters out standard English stopwords and displays the top 50 most frequently used terms.
- This is useful for building glossaries or understanding the core themes of the video.

## 5. Running the Audit
- Select the **Audit** tab.
- This view analyses all uploaded files simultaneously and flags potential issues such as:
  - Missing timestamps (which will degrade the mapping quality).
  - Videos longer than 20 minutes.
  - Low word-per-minute density (indicating large silent gaps).
  - Long unbroken segments.

## 6. Using Quarto Outputs
- Select the **Quarto Output** tab.
- This generates a structured Markdown scaffold designed to be dropped directly into a Quarto course site.
- It includes "Before Watching", "While Watching" (with the timestamp map), and "After Watching" reflection prompts.

## 7. Exporting Outputs
Use the buttons at the top of the Results panel to download your data:
- **Export TXT**: Downloads the clean, readable transcript.
- **Export Quarto MD**: Downloads the generated learning guide.
- **Export Map / Keywords / Audit CSV**: Downloads the structured data tables for use in Excel or other tools.

---

## Demo Mode
The app loads with a demo by default to illustrate functionality.

- Use **Load Demo** to restore the example
- Use **Start Fresh** to begin from an empty state

## Transcript Format
The demo uses WebVTT format for structured timestamps.

## Typical Workflow
1. Load or paste transcript
2. Define segments
3. Assign themes and learning objectives
4. Review structured mapping

---

## Capability & Governance

**What this tool does:** This tool transforms raw video transcripts into structured, easily reviewed learning objects.

**How capability is developed:** By systematically reviewing and mapping transcripts, users develop their ability to critically evaluate and structure AI-assisted or raw content into effective learning designs.

**How governance is supported:** The configuration panel includes an optional Capability & Governance section. This allows you to document the context of your work directly within the tool.

**Explanation of Optional Fields:**
- **AI Involvement:** Detail if/how AI was used in creating or reviewing the content.
- **Assumptions:** Note any underlying assumptions made during the mapping process.
- **Risks or concerns:** Highlight any potential issues (e.g., bias, privacy, inaccuracies).
- **Rationale:** Justify the structural choices and themes assigned.
- **Human review notes:** Record who reviewed the output and any final judgements.

These fields will automatically be appended to your exported Quarto Markdown file if filled out.
