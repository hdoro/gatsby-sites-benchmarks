# Gatsby showcase sites benchmark

Hey there, [Henrique](https://twitter.com/hcavaliericodes) here 👋

I've ran these tests and analysis made for my talk ["Speed up you Gatsby app in a day"](https://docs.google.com/presentation/d/1_OYE6qUB9WPPFs-HCRrWFw6rcov5mk0Kxa1_e9VtMkQ/edit?usp=sharing), be sure to check that out if the subject interests you.

## Conclusions

## 🚨 Problems with the approach

Don't treat this as a canonical investigation of Gatsby sites' performance. At least not yet, here's why

- I **only ran one test per page**, per version
  - There are several aspects that can impact performance scores and timings (a page's server load; variable data, ads and scripts; network and laptop processing conditions; etc.), so ideally we'd run _at least_ 5 tests per page
  - However, most of the analysis was focused on objective metrics such as Javascript bundles weight and number of origins connected to
- Lighthouse v6 was currently in `beta-0` when I ran this, so it certainly includes bugs and unreliable metrics
- I ran Lighthouse v5 tests from 7:30pm to 10pm of a Friday, where my network was probably more loaded than Saturday morning (6am to 7:50am, when I ran Lighthouse v6 tests), as the former is prime time for neighbours streaming and gaming during the COVID lockdown.
- I didn't do any statistical work here, just the most basic math possible, so we can't extrapolate any conclusions for the whole Gatsby ecosystem
- I haven't gone deep into potential problems with Lighthouse and have not normalized the data

💡 I've zipped my test results, [which you can find here](https://drive.google.com/file/d/1w1na5YGyit5zeqMJ4fQ9xuXpFcgeKwcY/view?usp=sharing)

## Gathering and analyzing data yourself

- stop doing anything you're doing in your computer
- `cd` into `tests-v5`, `npm i` and run `node index` -> it should take _at least_ 1h30 to finish the process, it's a list with **937** sites, after all
- do the same for `tests-v6`
- if tests fail, re-run `node index` and it'll pick up what sites already have been tested
- then `cd` into the root directory and run `node analyze-results`

## Step-by-step I took when building this

- Got the data from Gatsby showcase ([gatsbyjs/gatsby/master/docs/sites.yml](https://raw.githubusercontent.com/gatsbyjs/gatsby/master/docs/sites.yml))
  - latest version is from 2020.04.24
- Transformed it into JSON and save it as a local file
- Imported them and ran [Lighthouse](https://developers.google.com/web/tools/lighthouse) tests for each page
  - 💡 I ran them with a _fresh install of Google Chrome_ through the `chrome-launcher` package, with laptop dedicated solely to the test to prevent hiccups from affecting test results
  - I work on a Windows 10 machine, see [my specs below](#my-specs)
- Also took the opportunity to run tests with [Lighthouse v6 beta](https://github.com/GoogleChrome/lighthouse/releases/tag/v6.0.0-beta.0) as it introduces tons of 
- Figured out which information I wanted to extract from results
- Made some custom Node code to parse results
- And took the conclusions

## My Specs

This is the machine I used to run the tests

- Operating System: Windows 10 Home Insider Preview 64-bit (10.0, Build 19546) (19546.rs_prerelease.200110-1443)
- System Model: Aspire F5-573G
- Processor: Intel(R) Core(TM) i7-7500U CPU @ 2.70GHz (4 CPUs), ~2.9GHz
- Memory: 16384MB RAM
- Available OS Memory: 16252MB RAM
- Page File: 9906MB used, 11209MB available