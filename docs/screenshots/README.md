# UI Screenshots

Screenshots and visual references for the Resume Intelligence Platform frontend. Use this folder for documentation, design reviews, and release notes.

## Upload

![Upload](upload/Screenshot%202026-02-02%20at%202.49.20%20PM.png)

## Resumes

![Resumes](resumes/Screenshot%202026-02-02%20at%202.46.30%20PM.png)

## Jobs

![Jobs list](jobs/Screenshot%202026-02-02%20at%202.47.44%20PM.png)

![Job detail](jobs/Screenshot%202026-02-02%20at%202.48.23%20PM.png)

## Analytics

![Analytics](analytics/Screenshot%202026-02-02%20at%202.47.12%20PM.png)

---

## Structure

| Folder       | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| `upload/`    | Upload page — single/batch upload, validation states |
| `resumes/`   | Resumes list, detail modal, filters, empty states    |
| `jobs/`      | Jobs list, job cards, detail modal                   |
| `analytics/` | Analytics page — charts, insights, export            |

## Naming convention

- **Format:** PNG or WebP preferred.
- **Names:** `kebab-case`, descriptive (e.g. `resumes-list-empty.png`, `upload-batch-success.png`).
- **Variants:** Suffix by state or breakpoint if needed (e.g. `resumes-list-mobile.png`, `upload-error-state.png`).

## Usage

- Add screenshots when documenting a feature or preparing release notes.
- Reference in docs with relative path: `![Description](docs/screenshots/resumes/filename.png)`.
