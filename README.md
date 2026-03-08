# Pharma eCommerce Platform

## Product Description Markdown

The `Full Product Description` field in the admin product form now supports a safe markdown subset.

Supported syntax:

- `#` through `######` for headings
- Plain paragraphs
- `- item` or `* item` for bullet lists
- `1. item` for numbered lists
- `**bold**`
- `*italic*`
- `` `inline code` ``
- `[link text](https://example.com)`

Notes:

- Raw HTML is not rendered.
- Markdown is only applied to the full product description accordion on the product page.
- The short product description remains plain text.

Example:

```md
# Common Use

The main component of Viagra is **Sildenafil Citrate**.

## Dosage and Direction

Usually the recommended dose is _50 mg_ before sexual activity.

### Key Benefits

- Fast acting
- Physician-guided use
- Trusted formulation
```
