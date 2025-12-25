Short version: there’s no definitive, up-to-date master list of *all* government news/data feeds by country, and this changes constantly. But:

* We *can* enumerate the countries that currently have national-level open data portals (which almost always expose APIs / machine-readable feeds).
* Many more countries publish RSS/Atom feeds for press releases/ministry news, but those are scattered; there is no global canonical index.
* I’ll give you:

  1. A country list based on official national open-data portals (your best “from-the-source” backbone).
  2. Examples of true “news from origin” feeds (White House, GOV.UK, Canada, etc.).
  3. A repeatable method to discover and onboard feeds for *any* country into your dashboard.

---

## 1. Countries with official national-level open data portals (API-friendly)

Wikipedia maintains a “List of open government data sites” with national-level portals. These portals generally provide machine-readable formats (CSV/JSON) and often REST APIs or bulk downloads.([Wikipedia][1]) That’s the closest thing to a global backbone you can build on.

Below is the national-level list from that page as of December 2025 (all are government-run unless noted; many use CKAN/DKAN or custom solutions, which implies an HTTP API):

**Americas**

* **Argentina** – datos.gob.ar
* **Brazil** – dados.gov.br
* **Canada** – open.canada.ca (Open Government / Open Data)([Wikipedia][1])
* **Chile** – datos.gob.cl
* **Colombia** – datos.gov.co
* **Ecuador** – catalogo.datosabiertos.gob.ec
* **Guatemala** – datos.gob.gt
* **Honduras** – datos.gob.hn
* **Mexico** – datos.gob.mx
* **Panama** – datosabiertos.gob.pa
* **Paraguay** – gobiernoabierto.gov.py / datos.gov.py
* **Peru** – datosabiertos.gob.pe
* **United States** – data.gov (US government open data portal)([Data.gov][2])
* **Uruguay** – catalogodatos.gub.uy

(**Note:** The US also has specialized feeds for many agencies; more below.)

**Europe**

* **Austria** – data.gv.at
* **Belgium** – data.gov.be
* **Bosnia and Herzegovina** – cbbh.ba open data section
* **Bulgaria** – data.egov.bg
* **Croatia** – data.gov.hr
* **Cyprus** – data.gov.cy
* **Czech Republic** – data.gov.cz
* **Denmark** – opendata.dk
* **Estonia** – andmed.eesti.ee
* **Finland** – avoindata.fi
* **France** – data.gouv.fr
* **Georgia** – data.gov.ge
* **Germany** – govdata.de
* **Greece** – data.gov.gr
* **Hungary** – opendata.hu
* **Iceland** – island.is (open data section)
* **Ireland** – data.gov.ie
* **Italy** – dati.gov.it
* **Latvia** – data.gov.lv
* **Lithuania** – data.gov.lt
* **Luxembourg** – data.public.lu
* **North Macedonia** – government portal vlada.mk (open data page)
* **Netherlands** – data.overheid.nl
* **Norway** – data.norge.no
* **Poland** – stat.gov.pl (open data)
* **Portugal** – dados.gov.pt
* **Romania** – data.gov.ro
* **Russia** – data.gov.ru
* **Rwanda** – open data portal listed as “under development”([Wikipedia][1])
* **Serbia** – data.gov.rs
* **Sierra Leone** – opendatasl.gov.sl
* **Slovakia** – data.gov.sk
* **Slovenia** – podatki.gov.si
* **Spain** – datos.gob.es
* **Sweden** – dataportal.se
* **Switzerland** – opendata.swiss
* **Ukraine** – data.gov.ua
* **United Kingdom** – data.gov.uk (central UK government open data)([Wikipedia][1])

**Middle East & North Africa**

* **Bahrain** – data.gov.bh
* **Iran** – data.gov.ir
* **Israel** – info.data.gov.il
* **Jordan** – portal.jordan.gov.jo (Open Data)
* **Kuwait** – e.gov.kw (Open Data section)
* **Morocco** – data.gov.ma
* **Oman** – data.gov.om / omanportal.gov.om (Open Data)
* **Qatar** – data.gov.qa
* **Saudi Arabia** – data.gov.sa / open.data.gov.sa
* **Tunisia** – data.gov.tn
* **United Arab Emirates** – bayanat.ae

**Sub-Saharan Africa**

* **Burkina Faso** – data.gov.bf
* **Ghana** – data.gov.gh
* **Namibia** – nsa.org.na open data portal
* **Rwanda** – (under development, as mentioned)
* **Sierra Leone** – opendatasl.gov.sl
* **Tanzania** – opendata.go.tz

(Additional African data portals exist via regional/NGO hosts; many are *not* official government portals, so I’m excluding them here.)

**Asia**

* **Azerbaijan** – opendata.az
* **Bangladesh** – data.gov.bd
* **China** – data.stats.gov.cn
* **India** – data.gov.in
* **Indonesia** – data.go.id
* **Japan** – data.go.jp
* **Kazakhstan** – data.egov.kz
* **South Korea** – data.go.kr
* **Kyrgyzstan** – stat.gov.kg (open data)
* **Malaysia** – data.gov.my
* **Mongolia** – opendata.burtgel.gov.mn
* **Nepal** – nationaldata.gov.np
* **Philippines** – data.gov.ph
* **Sri Lanka** – data.gov.lk
* **Thailand** – data.go.th
* **Vietnam** – data.gov.vn

**Pacific / Oceania**

* **Australia** – data.gov.au
* **New Zealand** – data.govt.nz
* **Cook Islands** – via Pacific regional portal
* **Fiji** – via Pacific data portal
* **Kiribati** – via Pacific data portal
* **Marshall Islands** – via Pacific data portal
* **Micronesia** – via Pacific data portal
* **Nauru** – via Pacific data portal
* **Niue** – via Pacific data portal
* **Palau** – via Pacific data portal
* **Papua New Guinea** – via Pacific data portal
* **Solomon Islands** – via Pacific data portal
* **Tokelau** – via Pacific data portal
* **Tuvalu** – via Pacific data portal
* **Vanuatu** – via Pacific data portal

**Caribbean**

* **Jamaica** – data.gov.jm
* **Saint Lucia** – data.govt.lc
* **Trinidad and Tobago** – data.gov.tt

**Other**

* **Taiwan** – data.gov.tw
* **Mauritius** – data.govmu.org
* **Uruguay** – catalogodatos.gub.uy
* **Venezuela** – datos.gob.ve

This is *just* the national open-data layer. It does **not** include:

* Sub-national portals (states/provinces/cities).
* Ministry-specific news feeds.
* Central bank / statistics office feeds.

For a more expansive directory of portals (mix of official and non-official) you can also lean on DataPortals.org, which catalogs hundreds of government data portals worldwide.([Data Portals][3])

---

## 2. Examples of “news from the origin” feeds (RSS/Atom/API)

Here are some concrete examples of the *kind* of thing you’re asking for – direct government streams you can wire into a dashboard:

### United States

* **White House – News / Briefings / Presidential Actions**

  * News and press releases are listed under `/news/`, `/briefings-statements/`, and `/presidential-actions/`.([The White House][4])
  * Under the hood, these are paginated HTML lists; you can scrape them or sometimes find JSON endpoints (check the network panel).
* **Data.gov** – Core U.S. open data API across agencies (CKAN style, JSON APIs for datasets, metadata).([Data.gov][2])

### United Kingdom

* **GOV.UK – News and communications**

  * Central feed for announcements, written statements, speeches, etc. There is a “Subscribe to feed” option that exposes an Atom/RSS feed.([GOV.UK][5])
* **Office for National Statistics (ONS)** – Release calendar with RSS / email; good for economic/statistical releases.([Office for National Statistics][6])

### Canada

* **Canada News Centre – Web feeds**

  * Government-wide set of feeds (web feeds page lists RSS/Atom for different categories).([Canada][7])
* **Shared Services Canada / Health Canada / CRA**

  * Each has its own “Media room” or “Newsroom” and RSS feed for releases, advisories, recalls, etc.([Canada][8])

### EU & international

* **EU** – data.europa.eu (open data), plus RSS/Atom feeds for press releases by the Commission, Parliament, etc.([Wikipedia][1])
* **UN, OECD, IMF, World Bank, WHO, etc.** – all have APIs / data portals with structured feeds of official releases and indicators (often JSON).([Wikipedia][1])

You’ll see similar patterns for many countries:

* A central government news page with RSS/Atom.
* Individual ministries (health, finance, transport, etc.) with their own feeds.
* An open data portal with an API for structured datasets.

---

## 3. Why we *can’t* reliably give “every country with any official RSS/API”

A truly exhaustive list would require:

* Enumerating all ~195 countries and territories.
* Checking every national website + ministries + statistics offices for RSS/Atom links or API docs.
* Re-checking frequently, because feeds are added/removed/renamed.

There is no central registry of *all* government RSS/Atom/news APIs, and many are only discoverable by manual inspection or scraping each site, which I can’t do comprehensively in one shot. So:

* The **national open-data list** above is a solid, structured baseline (APIs, bulk data).([Wikipedia][1])
* On top of that, you can **programmatically discover** RSS/Atom/news endpoints country-by-country using patterns (next section), and store them in your own registry.

---

## 4. How to systematically discover official feeds for *any* country

Here’s a repeatable process you can automate:

### Step 1 – Start from the country’s main government domains

Common patterns:

* `*.gov.xx`, `*.gouv.xx`, `*.go.xx`, `*.govt.xx`, `president.xx`, `pm.xx`, `parliament.xx`, `stat.xx`, `nationalbank.xx`, etc.

Programmatically:

1. Seed with known open-data portals (list above).
2. Add high-authority government domains from:

   * the country’s Wikipedia page (Government, Politics, or External Links sections),
   * known lists of government domains when available,
   * DNS/TLS cert transparency logs (if you want to go hardcore).

### Step 2 – Probe for RSS/Atom/news endpoints

For each domain, test for:

* URLs containing typical structures:

  * `/rss`, `/feed`, `/feeds`, `/atom`, `/news/rss`, `/press/rss`, `/media/rss`, `/latestnews`, `/press-releases.atom`, etc.
* HTML `<link rel="alternate" type="application/rss+xml">` or `application/atom+xml` tags.
* JSON APIs:

  * Look for `/api/`, `/wp-json/` (if they use WordPress), `/feeds?format=json`, or documented APIs.

You can automate discovery by:

* Fetching the HTML of `/`, `/news`, `/press`, `/media`, `/announcements`, `/releases`, `/rss`, etc.
* Parsing `<link>` and `<a>` tags with “RSS”, “Atom”, “Web feed”, “Subscribe” in the surrounding text.

### Step 3 – Validate “official, non-opinion, news”

To fit your “news from the source of origin” constraint:

* Only accept feeds where:

  * Domain is clearly governmental (TLD + known name).
  * Content is labeled as: **press releases**, **announcements**, **statements**, **proclamations**, **bulletins**, **advisories**, etc.
  * No commentary/op-ed tone (you may still ingest but tag it as “opinion/analysis” to exclude it downstream).

You can classify feeds by:

* Path/category (`/news-releases/`, `/speeches/`, `/opinion/`).
* Keyword filters in titles and section labels.
* Source type: “executive office”, “legislature”, “ministry of X”, “statistics office”, etc.

### Step 4 – Normalize into your dashboard schema

Define a simple internal schema, e.g.:

```json
{
  "source_id": "gov.uk_news_central",
  "country": "UK",
  "level": "national",
  "branch": "executive",
  "agency": "HM Government",
  "feed_type": "rss",        // rss | atom | json_api | html_scrape
  "url": "https://www.gov.uk/search/news-and-communications.atom",
  "topic_tags": ["general", "government"],
  "language": "en",
  "format": "xml",
  "notes": "Official news communications from GOV.UK"
}
```

Then build adapters:

* **RSS/Atom ingester** ⇒ normalized items `{source_id, published_at, title, summary, url}`.
* **JSON API ingester** ⇒ map their fields (e.g., `headline`, `bodyText`) into the same schema.
* **HTML scraper** (fallback when no feed) ⇒ still normalized into the same schema, but with `feed_type = "html_scrape"`.

---

## 5. Using global “meta-sources” as country proxies

Sometimes you don’t need every ministry feed; you just want trusted, country-level official data:

* **National statistics offices** – often publish release calendars and RSS for new reports (ONS for UK, StatsCan, US Census, etc.).([Office for National Statistics][6])
* **Central banks** – monetary policy statements, financial stability reports, FX reserves, often via RSS or email API.
* **Supranational portals** – EU, UN, IMF, World Bank, OECD, WHO all provide structured APIs keyed by country.([Wikipedia][1])

These can cover a lot of “hard news” (laws, economic measures, health advisories) even where the national government’s own site is limited.

---

## 6. What you effectively have now

* A large **country list** whose governments expose at least one official, structured data portal (often with APIs).
* Clear **examples of first-class government news feeds** in the US, UK, Canada, EU, etc.
* A **playbook** for discovering and vetting official feeds for any additional country you care about.

If you’d like, I can next:

* Design a **config format + small fetcher architecture** for your dashboard, or
* Prioritize a short list of **“high-signal” government feeds** (e.g., G7 + major emerging markets) and sketch how to wire them in first.

---

**Relevant Frameworks:**

* Source Taxonomy: `country → branch (exec/leg/jud) → agency → feed_type (RSS/API/HTML)`.
* Funnel for Feed Discovery: `domains → likely paths → feed tags → validation (gov + non-opinion) → ingestion`.
* Normalization Pipeline: `raw feed → parse → normalize schema → tag (country/topic/agency) → store → dashboard`.
* Coverage Strategy: `national open data portals + core statistics/CB feeds + priority ministries` before long tail.

[1]: https://en.wikipedia.org/wiki/List_of_Open_Government_Data_Sites "List of open government data sites - Wikipedia"
[2]: https://data.gov/?utm_source=chatgpt.com "Data.gov Home - Data.gov"
[3]: https://dataportals.org/search/?utm_source=chatgpt.com "Search - Data Portals"
[4]: https://www.whitehouse.gov/news/?utm_source=chatgpt.com "News – The White House"
[5]: https://www.gov.uk/search/news-and-communications?utm_source=chatgpt.com "News and communications - GOV.UK"
[6]: https://www.ons.gov.uk/releasecalendar?utm_source=chatgpt.com "Release calendar - Office for National Statistics"
[7]: https://www.canada.ca/en/news/web-feeds.html?utm_source=chatgpt.com "Web Feeds - Canada News Centre - Canada.ca"
[8]: https://www.canada.ca/en/shared-services/corporate/stay-connected/rss-feeds.html?utm_source=chatgpt.com "RSS feeds - Canada.ca"
