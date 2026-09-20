# Lap Sum Chan — academic homepage

A small static homepage adapted from Plain Academic. `index.html` contains
the content, `styles.css` contains the presentation, and `headshot.jpg` is the
unchanged original portrait. No build step, JavaScript or external font/CSS
dependency is required.

## Preview

From this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`. Check navigation and links at desktop and narrow
mobile widths, keyboard focus, the skip link, and text enlargement.

## First review: content decisions

- Current role and institutional affiliation are supported by the
  [Hopkins postdoctoral directory](https://publichealth.jhu.edu/departments/biostatistics/people/postdoctoral-fellows).
- The email `lchan18@jh.edu`, Ph.D. institution and previous Minnesota
  appointment were checked against the user's September 17, 2026 CV.
- Research themes follow the user's supplied public-site brief. Additional
  research materials and the CV remain available upon request.
- The four existing citations, author lists and links are retained. The
  heading “Preprint versions” describes the linked versions without asserting
  that these works remain unpublished. Reconcile the selected publication list
  and bibliographic details against the current CV before release.
- Teaching and mentoring currently has a contact line; specific courses and
  roles require reconciliation. No teaching responsibilities are inferred.
- DrFARM links to its separate source repository. Its code and deployment
  are maintained independently.
- Existing LinkedIn and Twitter links are retained as secondary links. Confirm
  that both are still desired. Confirm the preferred public email and whether
  to retain CV-on-request or add a specifically approved public PDF.

## Scope and deployment

This review changes only the personal homepage. It preserves the existing
GitHub Pages setup and does not merge or deploy to `main`. Review and approve
the branch before any change to the live site. Do not add research-internal
results, working project details, or private files to this public repository.

Heritage Blue `#002D72` follows the
[Hopkins color guidance](https://brand.jhu.edu/visual-identity/colors/).
The original Plain Academic attribution is retained in the HTML and footer.

## Review checks (September 20, 2026)

- Static files served successfully over local HTTP; no build step is needed.
- Chromium screenshots inspected at desktop and mobile widths. Layout checks
  passed at 320, 375, 768 and 1440 pixels with JavaScript disabled.
- The keyboard skip link, all six navigation anchors, and 200% text enlargement
  at 375 pixels passed. No horizontal page overflow was detected.
- Heritage Blue text on white has a 12.98:1 contrast ratio; body and muted text
  also exceed 4.5:1. This is a focused accessibility check, not a full audit.
- All four existing citation texts and paper URLs are unchanged, and the
  headshot is byte-for-byte identical to the source branch. `git diff --check`
  passed.
- Eleven distinct external destinations were requested. Five returned HTTP
  200 (including the Nature link, which redirected to a cookie notice).
  Hopkins, Scholar, MDPI, bioRxiv and LinkedIn restricted automated access
  (403/429/999); manually verify these destinations before release. No 404
  response was observed. Email delivery was not tested.
