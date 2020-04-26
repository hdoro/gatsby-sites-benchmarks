# Gatsby showcase sites benchmark

922 websites profiled for performance with [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) to put "Fast in every way that matters" to the test 😊

---

Hey there, [Henrique](https://twitter.com/hcavaliericodes) here 👋

I've ran these tests and analyses made for my talk ["Speed up you Gatsby app in a day"](https://docs.google.com/presentation/d/1_OYE6qUB9WPPFs-HCRrWFw6rcov5mk0Kxa1_e9VtMkQ/edit?usp=sharing), be sure to check that out if the subject interests you.

🤚 Be sure to **read the section on problems with my approach below**, don't use these results as a weapon against Gatsby and don't come with torches and forks against me, this is an investigation that _doesn't claim to have all the definitive answers!_

## Conclusions

💡 See [aggregateStats.json](https://github.com/kaordica/gatsby-sites-benchmarks/blob/master/results/aggregateStats.json) or [individualStats.json](https://github.com/kaordica/gatsby-sites-benchmarks/blob/master/results/individualStats.json) for the raw results.

- 😥 **We aren't doing very well as a community.**
- The median Lighthouse v5 score for Gatsby showcase sites is **`75`**, and the average (mean) is **`69`**
  - For Lighthouse scores, these results is far from a reliable source, we need more tests on more machines before we can say for sure
- 🚨 [Lighthouse v6](https://github.com/GoogleChrome/lighthouse/releases/tag/v6.0.0-beta.0) seems to penalize Gatsby sites even more, with the median dropping to **`71`** and the average to **`67`**
  - This has to do with changes in how scores are calculated, [as covered here](https://web.dev/lighthouse-evolution-cds-2019/)
  - My hypothesis (I haven't had much time to look into it) is that Total Blocking Time is the metric working against Gatsby sites, as its low grade is the result of large Javascript bundles
- More than a third of the sites tested use Google Fonts without serving the font-files locally, which adds more requests and origins to resolve.
  - Thankfully, though, this is an easy change!
  - 💡 Follow [this post by Sia Karamalegos](https://sia.codes/posts/making-google-fonts-faster/) if you want to improve your own site
- 😳 The median Gatsby site ship **`891kb`** of minified Javascript (`267kb` download)
  - And on average, sites ship **`1.58mb` of Javascript** to users (`430kb` of download size), which means there are some _really_ js-heavy websites out there!
- The smallest JS bundle from the sample was **`224kb`**, still a lot for low-end phones
- And this translates in a **poorer user experience**:
  - After seeing the [first contentful paint](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint), the median site still forces users to wait **`5095ms`** until they can interact with the page (_time to interactive_)
    - Read more: [Time to Interactive documentation](https://developers.google.com/web/tools/lighthouse/audits/time-to-interactive)
  - We're draining devices' batteries with so much Javascript: the median site takes **`4.5s`** to finally allow the CPU to be idle for the first time. And this doesn't even mean the work if done
    - Read more: [First CPU Idle documentation](https://developers.google.com/web/tools/lighthouse/audits/first-cpu-idle)
- Gatsby's content duplication can be really impactful, with the median homepage `page-data.json` + `index.html` combination weighting **`114kb`**
  - This has a huge standard deviation as some will have very few data to display and others will have very minimal pre-rendered HTML (everything built on mount), so it's worth considering the **average of `212kb`**.
  - Download sizes are considerably smaller (`28.5kb` for the median and`56kb` for the average), but we must remember the processing cost of hydrating/rendering this much data / HTML nodes.
- ☀ _Most_ Gatsby sites correctly use Gatsby images
  - medians of `offscreen-images` and `responsive-images` score are **`1`** (at least half of the sites scored 1!)
  - the standard deviation is `0.23` and `0.27`, respectively, not bad!
  - the conclusion here is that most of the community is well educated around images, we just have to reach the last ~10% (this percentage is a guess) of sites that might have a problem with it 🙌

What do you think? Go through the data ([aggregateStats.json](https://github.com/kaordica/gatsby-sites-benchmarks/blob/master/results/aggregateStats.json) and [individualStats.json](https://github.com/kaordica/gatsby-sites-benchmarks/blob/master/results/individualStats.json)) and share your thoughts! Issues and Twitter mentions are welcomed :)

## 🚨 Problems with the approach

Don't treat this as a canonical investigation of Gatsby sites' performance. At least not yet, here's why

- I **only ran one test per page**, per version
  - There are several aspects that can impact performance scores and timings (a page's server load; variable data, ads and scripts; network and laptop processing conditions; etc.), so ideally we'd run _at least_ 5 tests per page
  - However, most of the analysis was focused on objective metrics such as Javascript bundles weight and number of origins connected to
- Lighthouse v6 was currently in `beta-0` when I ran this, so it certainly includes bugs and unreliable metrics
- I ran Lighthouse v5 tests from 7:30pm to 10pm of a Friday, where my network was probably more loaded than Saturday morning (6am to 7:50am, when I ran Lighthouse v6 tests), as the former is prime time for neighbors streaming and gaming during the COVID lockdown.
- I didn't do any statistical work here, just the most basic math possible, so we can't extrapolate any conclusions for the whole Gatsby ecosystem
- I haven't gone deep into potential problems with Lighthouse and have not normalized the data

💡 I've zipped my test results, [which you can find here](https://drive.google.com/file/d/1w1na5YGyit5zeqMJ4fQ9xuXpFcgeKwcY/view?usp=sharing)

### Found anomalies

- https://www.zensum.se/ isn't a Gatsby site anymore, it's Webflow, so I removed it from the list
- https://hackclub.com/ loads scripts from v3.hackclub.com, and hence it shows up as if `jsBundles.local` was empty.
  - Removed it from the `jsBundles` analysis
- `https://dispel.io/` has a weird test result that doesn't load `page-data.json` for the homepage, and hence shows as if `indexPageData.transferSize = 0`. Removed from the analysis

## Gathering and analyzing data yourself

- stop doing anything you're doing in your computer
- `cd` into `tests-v5`, `npm i` and run `node index` -> it should take _at least_ 1h30 to finish the process, it's a list with **937** sites, after all
- do the same for `tests-v6`
- if tests fail, re-run `node index` and it'll pick up what sites already have been tested
- then `cd` into the root directory and run `node analyze-results`

## Step-by-step I took when building this

- Got the data from Gatsby showcase ([gatsbyjs/gatsby/master/docs/sites.yml](https://raw.githubusercontent.com/gatsbyjs/gatsby/master/docs/sites.yml))
  - the latest version is from 2020.04.24
- Transformed it into JSON and save it as a local file
- Imported them and ran [Lighthouse](https://developers.google.com/web/tools/lighthouse) tests for each page
  - 💡 I ran them with a _fresh install of Google Chrome_ through the `chrome-launcher` package, with laptop dedicated solely to the test to prevent hiccups from affecting test results
  - I work on a Windows 10 machine, see [my specs below](#my-specs)
- Also took the opportunity to run tests with [Lighthouse v6 beta](https://github.com/GoogleChrome/lighthouse/releases/tag/v6.0.0-beta.0) as it introduces tons of
- Figured out which information I wanted to extract from results
- Made some custom Node code to parse results
- And took the conclusions

## Contributing

I'm super excited about diving deeper in this topic. If you share the interest, let's explore it together! DM or mention [me on Twitter](https://twitter.com/hcavaliericodes) or open an issue here in GitHub.

🙌 Suggestions for how to help:

- If you have a background in data analysis and testing, _please_ criticize this project as much as you can.
- Know Gatsby in and out and have a clear path for websites that have terrible performance? Reach their creators and help them improve!
- Spread the word on this work
- Mention [Gatsby on Twitter](https://twitter.com/gatsbyjs) and let them know you'd like me to speak at [Gatsby Days Virtual Edition](https://www.gatsbyjs.com/resources/gatsby-days/) about what can be learned from investigating 1000 Gatsby websites o/
- Take a look at [kommunity.dev](https://kommunity.dev), a project for collaboratively curating Gatsby and JAMstack content

## My Specs

This is the machine I used to run the tests

- Operating System: Windows 10 Home Insider Preview 64-bit (10.0, Build 19546) (19546.rs_prerelease.200110-1443)
- System Model: Aspire F5-573G
- Processor: Intel(R) Core(TM) i7-7500U CPU @ 2.70GHz (4 CPUs), ~2.9GHz
- Memory: 16384MB RAM
- Available OS Memory: 16252MB RAM
- Page File: 9906MB used, 11209MB available
