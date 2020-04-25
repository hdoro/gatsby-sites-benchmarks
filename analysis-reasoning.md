# Thought process behind results analysis

## How widely-adopted that is and are people using it for external images?

- Understand the usage of gatsby-image
- Could use the audits:
  - Oversized images
  - Offscreen images
  - Optimize images
  - Unoptimized images
  - Save images in Next-Gen formats

## How many websites could benefit from serving fonts locally? ✅

- Check for pages using Google Fonts served from fonts.googleapis.com
  - filter `audits["network-requests"].details.items` for items that connect to `fonts.googleapis.com`

## How much content duplication is out-there?

- Get the average size of page-data.json ✅
- Ideally we could infer the presence of content in the JS bundle, but that's nearly impossible
  - so we can approximate it by getting the average size of HTML content ✅
  - and comparing it to page-data.json
  - if enourmous HTML but tiny JSON, we probably have tons of data in JS files

## How much Javascript can we easily save?

I don't currently have the expertise to work on these:

- Figure which pages are using CSS-in-JS, versions, etc.
- Figure which pages are using Preact

## What's the impact of JS in Gatsby sites? ✅

- Get the average and median JS bundle size
  - Filter `audits["network-requests"].details.items` for items with `mimeType === "application/javascript"`
  - Differentiate between internal and external
- Differentiate between local and thirdParty bundles
- Eventually, with more reliable test re-runs, we could use metrics on main thread being blocked and the likes, but right now I'm not confident enough to do so
- Get the average amount of origins pages are connecting to

## How much are we abusing of users' bandwidth

- Some of the previous items start answering this
- But we can go further and investigate how many page-data.json files are being downloaded in the test with the mindset that most users _won't_ access these pages, so this data was wasted