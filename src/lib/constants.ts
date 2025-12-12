// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com

import type { FeedConfig } from './types';

export const RSS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url='
];

export const EDGE_PROXY_URL = 'https://stacknews-proxy.launch-maniac.workers.dev/proxy';
export const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

export const CATEGORIES = [
  // Overview
  { id: 'ALL', label: 'OVERVIEW' },

  // UNITED STATES (alphabetical)
  { id: 'EXECUTIVE', label: 'EXECUTIVE' },
  { id: 'FEDERAL RESERVE', label: 'FEDERAL RESERVE' },
  { id: 'MILITARY', label: 'U.S. MILITARY' },
  { id: 'MORTGAGE', label: 'MORTGAGE' },
  { id: 'REAL ESTATE', label: 'REAL ESTATE' },
  { id: 'REGULATION', label: 'REGULATION' },
  { id: 'STATE_DEPT', label: 'STATE DEPT.' },
  { id: 'TREASURY', label: 'TREASURY' },
  { id: 'US CONGRESS', label: 'US CONGRESS' },

  // AMERICAS (alphabetical)
  { id: 'CANADA', label: 'CANADA' },

  // ASIA (alphabetical)
  { id: 'ASIA_PACIFIC', label: 'ASIA PACIFIC' },
  { id: 'CHINA', label: 'CHINA' },
  { id: 'JAPAN', label: 'JAPAN' },

  // EUROPE (alphabetical)
  { id: 'BULGARIA', label: 'BULGARIA' },
  { id: 'EUROZONE', label: 'EUROZONE' },
  { id: 'UK', label: 'UNITED KINGDOM' },

  // SUB-SAHARA AFRICA (alphabetical)
  { id: 'AFRICA', label: 'AFRICA' },

  // GLOBAL (alphabetical)
  { id: 'CRYPTO', label: 'CRYPTO CURRENCY' },
  { id: 'ENERGY', label: 'ENERGY SECTOR' },
  { id: 'GLOBAL_MACRO', label: 'GLOBAL MACRO' },
  { id: 'NASA', label: 'NASA & SPACE' },
  { id: 'NEWS', label: 'NEWS' },
  { id: 'RESEARCH', label: 'RESEARCH & GRANT' },
] as const;

export const FEEDS: FeedConfig[] = [
  // Treasury Category - Using GovInfo (Treasury Direct blocks Cloudflare)
  {
    id: 'treasury-budget',
    url: 'https://www.govinfo.gov/rss/budget.xml',
    name: 'US BUDGET',
    color: '#fbbf24',
    category: 'TREASURY'
  },
  {
    id: 'treasury-cbo',
    url: 'https://www.cbo.gov/publications/all/rss.xml',
    name: 'CBO REPORTS',
    color: '#84cc16',
    category: 'TREASURY'
  },

  // Federal Reserve Feeds
  {
    id: 'fed-monetary',
    url: 'https://www.federalreserve.gov/feeds/press_monetary.xml',
    name: 'MONETARY POLICY',
    color: '#a78bfa',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-reg',
    url: 'https://www.federalreserve.gov/feeds/press_bcreg.xml',
    name: 'REGULATORY POLICY',
    color: '#818cf8',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h10',
    url: 'https://www.federalreserve.gov/feeds/h10.xml',
    name: 'FX RATES (H.10)',
    color: '#c4b5fd',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-all',
    url: 'https://www.federalreserve.gov/feeds/press_all.xml',
    name: 'PRESS RELEASES',
    color: '#6366f1',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-speeches',
    url: 'https://www.federalreserve.gov/feeds/speeches.xml',
    name: 'SPEECHES',
    color: '#60a5fa',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-testimony',
    url: 'https://www.federalreserve.gov/feeds/testimony.xml',
    name: 'TESTIMONY',
    color: '#38bdf8',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-chgdel',
    url: 'https://www.federalreserve.gov/feeds/chgdel.xml',
    name: 'CHARGE-OFF RATES',
    color: '#e879f9',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-cp',
    url: 'https://www.federalreserve.gov/feeds/cp.xml',
    name: 'COMMERCIAL PAPER',
    color: '#c084fc',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-g19',
    url: 'https://www.federalreserve.gov/feeds/g19.xml',
    name: 'CONSUMER CREDIT (G.19)',
    color: '#8b5cf6',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h41',
    url: 'https://www.federalreserve.gov/feeds/h41.xml',
    name: 'RESERVE BALANCES',
    color: '#3b82f6',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-z1',
    url: 'https://www.federalreserve.gov/feeds/z1.xml',
    name: 'US FINANCIAL ACCOUNTS',
    color: '#0ea5e9',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-prates',
    url: 'https://www.federalreserve.gov/feeds/h15.xml',
    name: 'INTEREST RATES (H.15)',
    color: '#06b6d4',
    category: 'FEDERAL RESERVE'
  },

  // Energy Feeds
  {
    id: 'oilprice',
    url: 'https://oilprice.com/rss/main',
    name: 'OILPRICE.COM',
    color: '#f59e0b',
    category: 'ENERGY'
  },
  {
    id: 'rigzone',
    url: 'https://www.rigzone.com/news/rss/rigzone_headlines.aspx',
    name: 'RIGZONE',
    color: '#f97316',
    category: 'ENERGY'
  },
  {
    id: 'iaea-news',
    url: 'https://www.iaea.org/feeds/news',
    name: 'IAEA NUCLEAR',
    color: '#10b981',
    category: 'ENERGY'
  },

  // Crypto Feeds
  {
    id: 'crypto-reddit',
    url: 'https://www.reddit.com/r/CryptoCurrency.rss',
    name: 'CRYPTO REDDIT',
    color: '#f7931a',
    category: 'CRYPTO'
  },
  {
    id: 'btc-releases',
    url: 'https://bitcoin.org/en/rss/releases.rss',
    name: 'BITCOIN RELEASES',
    color: '#f7931a',
    category: 'CRYPTO'
  },
  {
    id: 'cointelegraph',
    url: 'https://cointelegraph.com/feed',
    name: 'COINTELEGRAPH',
    color: '#fca5a5',
    category: 'CRYPTO'
  },
  {
    id: 'btc-mag',
    url: 'https://bitcoinmagazine.com/feed',
    name: 'BITCOIN MAG',
    color: '#fcd34d',
    category: 'CRYPTO'
  },
  {
    id: 'decrypt',
    url: 'https://decrypt.co/feed',
    name: 'DECRYPT',
    color: '#a5f3fc',
    category: 'CRYPTO'
  },
  {
    id: 'blockworks',
    url: 'https://blockworks.co/feed/',
    name: 'BLOCKWORKS',
    color: '#2563eb',
    category: 'CRYPTO'
  },
  // Bitcoin Core official announcements
  {
    id: 'btc-core-announce',
    url: 'https://bitcoincore.org/en/announcements.xml',
    name: 'BTC CORE ANNOUNCE',
    color: '#f7931a',
    category: 'CRYPTO'
  },
  {
    id: 'btc-core-rss',
    url: 'https://bitcoincore.org/en/rss.xml',
    name: 'BTC CORE BLOG',
    color: '#f7931a',
    category: 'CRYPTO'
  },
  // Exchange blogs
  {
    id: 'kraken-blog',
    url: 'https://blog.kraken.com/feed/',
    name: 'KRAKEN BLOG',
    color: '#5741d9',
    category: 'CRYPTO'
  },
  // Hardware/Security
  {
    id: 'trezor-blog',
    url: 'https://blog.trezor.io/feed',
    name: 'TREZOR BLOG',
    color: '#00854d',
    category: 'CRYPTO'
  },
  // Professional newsrooms
  {
    id: 'cryptoslate',
    url: 'https://cryptoslate.com/feed/',
    name: 'CRYPTOSLATE',
    color: '#1a1a2e',
    category: 'CRYPTO'
  },
  {
    id: 'bravenewcoin',
    url: 'https://bravenewcoin.com/news/rss',
    name: 'BRAVE NEW COIN',
    color: '#00d4aa',
    category: 'CRYPTO'
  },
  {
    id: 'news-btc',
    url: 'https://news.bitcoin.com/feed/',
    name: 'NEWS.BITCOIN',
    color: '#0ac18e',
    category: 'CRYPTO'
  },
  {
    id: 'dcforecasts',
    url: 'https://www.dcforecasts.com/feed/',
    name: 'DCFORECASTS',
    color: '#3b82f6',
    category: 'CRYPTO'
  },
  {
    id: 'cryptobriefing',
    url: 'https://cryptobriefing.com/feed/',
    name: 'CRYPTOBRIEFING',
    color: '#6366f1',
    category: 'CRYPTO'
  },
  {
    id: 'cryptopotato',
    url: 'https://cryptopotato.com/feed/',
    name: 'CRYPTOPOTATO',
    color: '#f59e0b',
    category: 'CRYPTO'
  },
  // Education-first
  {
    id: '99bitcoins',
    url: 'https://99bitcoins.com/feed/',
    name: '99BITCOINS',
    color: '#22c55e',
    category: 'CRYPTO'
  },

  // News Feeds
  {
    id: 'bbc-world',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    name: 'BBC WORLD',
    color: '#ef4444',
    category: 'NEWS'
  },
  {
    id: 'npr-news',
    url: 'https://feeds.npr.org/1001/rss.xml',
    name: 'NPR NEWS',
    color: '#818cf8',
    category: 'NEWS'
  },
  {
    id: 'reuters-biz',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10001147',
    name: 'CNBC BUSINESS',
    color: '#fb923c',
    category: 'NEWS'
  },
  // Military Feeds
  {
    id: 'mil-leak',
    url: 'https://militaryleak.com/feed/',
    name: 'MILITARY LEAK',
    color: '#4ade80',
    category: 'MILITARY'
  },
  {
    id: 'usmc-news',
    url: 'https://www.marines.mil/DesktopModules/ArticleCS/RSS.ashx?max=10&ContentType=1&Site=481',
    name: 'MARINE CORPS NEWS',
    color: '#ef4444',
    category: 'MILITARY'
  },
  {
    id: 'army-tech',
    url: 'https://www.army-technology.com/feed/',
    name: 'ARMY TECHNOLOGY',
    color: '#16a34a',
    category: 'MILITARY'
  },
  {
    id: 'mil-headlines',
    url: 'https://www.military.com/rss-feeds/content?keyword=headlines&channel=news&type=news',
    name: 'MIL.COM HEADLINES',
    color: '#84cc16',
    category: 'MILITARY'
  },

  // State Dept Feeds (main state.gov RSS is down - "Technical Difficulties")
  {
    id: 'state-travel',
    url: 'https://travel.state.gov/_res/rss/TAsTWs.xml',
    name: 'TRAVEL ADVISORIES',
    color: '#ef4444',
    category: 'STATE_DEPT'
  },

  // UK Feeds
  {
    id: 'uk-mod',
    url: 'https://www.gov.uk/government/organisations/ministry-of-defence.atom',
    name: 'MINISTRY OF DEFENCE',
    color: '#2563eb',
    category: 'UK'
  },
  {
    id: 'uk-boe',
    url: 'https://www.bankofengland.co.uk/rss/publications',
    name: 'BANK OF ENGLAND',
    color: '#3b82f6',
    category: 'UK'
  },
  // UK Government departments (gov.uk Atom feeds)
  {
    id: 'uk-hmt',
    url: 'https://www.gov.uk/government/organisations/hm-treasury.atom',
    name: 'HM TREASURY',
    color: '#dc2626',
    category: 'UK'
  },
  {
    id: 'uk-hmrc',
    url: 'https://www.gov.uk/government/organisations/hm-revenue-customs.atom',
    name: 'HM REVENUE & CUSTOMS',
    color: '#16a34a',
    category: 'UK'
  },
  {
    id: 'uk-cabinet',
    url: 'https://www.gov.uk/government/organisations/cabinet-office.atom',
    name: 'CABINET OFFICE',
    color: '#7c3aed',
    category: 'UK'
  },
  {
    id: 'uk-dti',
    url: 'https://www.gov.uk/government/organisations/department-for-business-and-trade.atom',
    name: 'BUSINESS & TRADE',
    color: '#0891b2',
    category: 'UK'
  },
  {
    id: 'uk-fco',
    url: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office.atom',
    name: 'FCDO',
    color: '#1d4ed8',
    category: 'UK'
  },
  {
    id: 'uk-desnz',
    url: 'https://www.gov.uk/government/organisations/department-for-energy-security-and-net-zero.atom',
    name: 'ENERGY & NET ZERO',
    color: '#059669',
    category: 'UK'
  },
  {
    id: 'uk-ons',
    url: 'https://www.gov.uk/government/organisations/office-for-national-statistics.atom',
    name: 'ONS STATISTICS',
    color: '#f59e0b',
    category: 'UK'
  },
  {
    id: 'uk-nao',
    url: 'https://www.gov.uk/government/organisations/national-audit-office.atom',
    name: 'NAT AUDIT OFFICE',
    color: '#ef4444',
    category: 'UK'
  },

  // Eurozone Feeds
  {
    id: 'ecb-press',
    url: 'https://www.ecb.europa.eu/rss/press.xml',
    name: 'ECB PRESS',
    color: '#3b82f6',
    category: 'EUROZONE'
  },
  // Asia Pacific Feeds
  {
    id: 'boj',
    url: 'https://www.boj.or.jp/en/rss/whatsnew.xml',
    name: 'BANK OF JAPAN',
    color: '#f87171',
    category: 'ASIA_PACIFIC'
  },
  {
    id: 'rba',
    url: 'https://www.rba.gov.au/rss/rss-cb-media-releases.xml',
    name: 'RBA (AUSTRALIA)',
    color: '#fcd34d',
    category: 'ASIA_PACIFIC'
  },
  {
    id: 'cna-asia',
    url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml',
    name: 'CNA (SINGAPORE)',
    color: '#ef4444',
    category: 'ASIA_PACIFIC'
  },

  // Global Macro Feeds (World Bank/IMF RSS broken)
  {
    id: 'economist-finance',
    url: 'https://www.economist.com/finance-and-economics/rss.xml',
    name: 'THE ECONOMIST',
    color: '#3b82f6',
    category: 'GLOBAL_MACRO'
  },
  {
    id: 'un-economic',
    url: 'https://news.un.org/feed/subscribe/en/news/topic/economic-development/feed/rss.xml',
    name: 'UN ECONOMIC NEWS',
    color: '#60a5fa',
    category: 'GLOBAL_MACRO'
  },

  // Mortgage Feeds (mort-news-daily and fannie RSS are broken)
  {
    id: 'mort-mbs',
    url: 'https://www.insidemortgagefinance.com/rss/topic/3831-mbs',
    name: 'MBS MARKET',
    color: '#fdba74',
    category: 'MORTGAGE'
  },

  // Real Estate Feeds (HUD 404, USDA 520)
  {
    id: 'zillow-mkts',
    url: 'https://zillow.mediaroom.com/press-releases?pagetemplate=rss&category=816',
    name: 'ZILLOW MARKETS',
    color: '#38bdf8',
    category: 'REAL ESTATE'
  },

  // US Congress Feeds
  {
    id: 'bills',
    url: 'https://www.govinfo.gov/rss/bills.xml',
    name: 'CONGRESSIONAL BILLS',
    color: '#34d399',
    category: 'US CONGRESS'
  },
  {
    id: 'plaw',
    url: 'https://www.govinfo.gov/rss/plaw.xml',
    name: 'PUBLIC LAWS',
    color: '#4ade80',
    category: 'US CONGRESS'
  },
  {
    id: 'congress-notifications',
    url: 'https://www.congress.gov/rss/notification.xml',
    name: 'CONGRESS NOTIFICATIONS',
    color: '#818cf8',
    category: 'US CONGRESS'
  },
  {
    id: 'bills-to-president',
    url: 'https://www.congress.gov/rss/presented-to-president.xml',
    name: 'BILLS TO PRESIDENT',
    color: '#a78bfa',
    category: 'US CONGRESS'
  },
  {
    id: 'most-viewed-bills',
    url: 'https://www.congress.gov/rss/most-viewed-bills.xml',
    name: 'MOST VIEWED BILLS',
    color: '#c4b5fd',
    category: 'US CONGRESS'
  },
  {
    id: 'house-floor-today',
    url: 'https://www.congress.gov/rss/house-floor-today.xml',
    name: 'HOUSE FLOOR TODAY',
    color: '#2563eb',
    category: 'US CONGRESS'
  },
  {
    id: 'senate-floor-today',
    url: 'https://www.congress.gov/rss/senate-floor-today.xml',
    name: 'SENATE FLOOR TODAY',
    color: '#dc2626',
    category: 'US CONGRESS'
  },
  {
    id: 'loc-law-blog',
    url: 'https://blogs.loc.gov/law/feed/',
    name: 'LOC LAW LIBRARIANS',
    color: '#f59e0b',
    category: 'US CONGRESS'
  },

  // Regulation Feeds
  {
    id: 'cfr',
    url: 'https://www.govinfo.gov/rss/cfr.xml',
    name: 'CODE OF FED REGS',
    color: '#60a5fa',
    category: 'REGULATION'
  },
  {
    id: 'fr',
    url: 'https://www.govinfo.gov/rss/fr.xml',
    name: 'FEDERAL REGISTER',
    color: '#c084fc',
    category: 'REGULATION'
  },
  // Banking/Regulatory – Primary sources
  {
    id: 'fdic-press',
    url: 'https://www.fdic.gov/rss/press.xml',
    name: 'FDIC PRESS',
    color: '#16a34a',
    category: 'REGULATION'
  },
  {
    id: 'sec-litigation',
    url: 'https://www.sec.gov/rss/litigation/litreleases.xml',
    name: 'SEC LITIGATION',
    color: '#10b981',
    category: 'REGULATION'
  },

  // Executive Feeds
  {
    id: 'budget',
    url: 'https://www.govinfo.gov/rss/budget.xml',
    name: 'BUDGET OF THE US',
    color: '#fde047',
    category: 'EXECUTIVE'
  },
  {
    id: 'ppp',
    url: 'https://www.govinfo.gov/rss/ppp.xml',
    name: 'PRESIDENTIAL PAPERS',
    color: '#fbbf24',
    category: 'EXECUTIVE'
  },

  // Research Feeds
  {
    id: 'darpa-projects',
    url: 'https://www.darpa.mil/rss/opportunities.xml',
    name: 'DARPA PROJECTS',
    color: '#8b5cf6',
    category: 'RESEARCH'
  },

  // Canada Feeds (CBC blocks Cloudflare with 520)
  {
    id: 'can-stat',
    url: 'https://www150.statcan.gc.ca/n1/rss/dai-quo/0-eng.atom',
    name: 'STATCAN DAILY',
    color: '#ef4444',
    category: 'CANADA'
  },
  {
    id: 'globalnews',
    url: 'https://globalnews.ca/feed/',
    name: 'GLOBAL NEWS',
    color: '#dc2626',
    category: 'CANADA'
  },
  {
    id: 'globe-mail',
    url: 'https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/canada/',
    name: 'GLOBE & MAIL',
    color: '#1e40af',
    category: 'CANADA'
  },
  // Canadian Government News (api.io.canada.ca feeds)
  {
    id: 'can-national',
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?sort=publishedDate&orderBy=desc&publishedDate%3E=2021-10-25&pick=100&format=atom&atomtitle=National%20News',
    name: 'NATIONAL NEWS',
    color: '#dc2626',
    category: 'CANADA'
  },
  {
    id: 'can-business',
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?audience=business&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-10-25&pick=100&format=atom&atomtitle=business',
    name: 'BUSINESS NEWS',
    color: '#059669',
    category: 'CANADA'
  },
  {
    id: 'can-aboriginal',
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?audience=aboriginalpeoples&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-10-25&pick=100&format=atom&atomtitle=Aboriginal%20peoples',
    name: 'ABORIGINAL PEOPLES',
    color: '#2563eb',
    category: 'CANADA'
  },
  {
    id: 'can-ontario',
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?location=on35&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-10-25&pick=100&format=atom&atomtitle=Ontario',
    name: 'ONTARIO NEWS',
    color: '#16a34a',
    category: 'CANADA'
  },
  {
    id: 'can-bc',
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?location=bc59&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-10-25&pick=100&format=atom&atomtitle=British%20Columbia',
    name: 'BRITISH COLUMBIA',
    color: '#7c3aed',
    category: 'CANADA'
  },
  {
    id: 'can-quebec',
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?location=qc24&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-10-25&pick=100&format=atom&atomtitle=Quebec',
    name: 'QUEBEC NEWS',
    color: '#0891b2',
    category: 'CANADA'
  },
  {
    id: 'can-alberta',
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?location=ab48&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-10-25&pick=100&format=atom&atomtitle=Alberta',
    name: 'ALBERTA NEWS',
    color: '#f59e0b',
    category: 'CANADA'
  },

  // US Civil Air Patrol (under U.S. Military)
  {
    id: 'cap-news',
    url: 'https://www.cap.news/tagfeed/en-us/tags/feature',
    name: 'CAP NEWS',
    color: '#0ea5e9',
    category: 'MILITARY'
  },
  {
    id: 'cap-cadet-blogs',
    url: 'https://www.gocivilairpatrol.com/programs/cadets/cadetblog/rss.xml',
    name: 'CAP CADET BLOGS',
    color: '#22c55e',
    category: 'MILITARY'
  },
  {
    id: 'cap-learning-videos',
    url: 'https://www.gocivilairpatrol.com/programs/aerospace-education/curriculum/lessonandactivityvideos/rss.xml',
    name: 'CAP LEARNING VIDEOS',
    color: '#14b8a6',
    category: 'MILITARY'
  },
  {
    id: 'cap-stem-lessons',
    url: 'https://www.gocivilairpatrol.com/programs/aerospace-education/programs/stem-kits/stem-kit-lessons-and-activities/rss.xml',
    name: 'CAP STEM LESSONS',
    color: '#06b6d4',
    category: 'MILITARY'
  },

  // Bulgaria
  {
    id: 'bulgarian-military',
    url: 'https://bulgarianmilitary.com/feed/',
    name: 'BULGARIAN MILITARY',
    color: '#f59e0b',
    category: 'BULGARIA'
  },

  // China
  {
    id: 'china-defense-blog',
    url: 'http://china-defense.blogspot.com/feeds/posts/default',
    name: 'CHINA DEFENSE BLOG',
    color: '#ef4444',
    category: 'CHINA'
  },
  // Note: The following sources were requested but lack confirmed RSS endpoints.
  // - China Military Aviation (URL incomplete in request)
  // - China Military Official (site homepage provided; RSS endpoint not specified)
  // They can be added once valid RSS/Atom URLs are provided.

  // Africa
  {
    id: 'africa-defense-news',
    url: 'https://www.military.africa/feed/',
    name: 'AFRICA DEFENSE NEWS',
    color: '#10b981',
    category: 'AFRICA'
  },
  
  // Added feeds per build plan
  // TreasuryDirect (Auctions)
  {
    id: 'treasury-auction-results',
    url: 'https://www.treasurydirect.gov/rss/auction_results.xml',
    name: 'TREASURY AUCTION RESULTS',
    color: '#fbbf24',
    category: 'TREASURY'
  },
  {
    id: 'treasury-offering-announcements',
    url: 'https://www.treasurydirect.gov/rss/offering_announcements.xml',
    name: 'TREASURY OFFERINGS',
    color: '#f59e0b',
    category: 'TREASURY'
  },

  // Energy - EIA + Nuclear + Clean Tech
  {
    id: 'eia-today-energy',
    url: 'https://www.eia.gov/rss/todayinenergy.xml',
    name: 'EIA TODAY IN ENERGY',
    color: '#10b981',
    category: 'ENERGY'
  },
  {
    id: 'eia-press',
    url: 'https://www.eia.gov/rss/press_rss.xml',
    name: 'EIA PRESS RELEASES',
    color: '#22c55e',
    category: 'ENERGY'
  },
  {
    id: 'world-nuclear-news',
    url: 'https://world-nuclear-news.org/RSS/WNN-News.xml',
    name: 'WORLD NUCLEAR NEWS',
    color: '#84cc16',
    category: 'ENERGY'
  },
  {
    id: 'cleantechnica',
    url: 'https://cleantechnica.com/feed/',
    name: 'CLEANTECHNICA',
    color: '#34d399',
    category: 'ENERGY'
  },
  {
    id: 'hydrogen-central',
    url: 'https://hydrogen-central.com/feed/',
    name: 'HYDROGEN CENTRAL',
    color: '#2dd4bf',
    category: 'ENERGY'
  },

  // Mortgage & Real Estate
  {
    id: 'mnd-mbs',
    url: 'http://www.mortgagenewsdaily.com/rss/mbs',
    name: 'MND MBS COMMENTARY',
    color: '#fdba74',
    category: 'MORTGAGE'
  },
  {
    id: 'mnd-rates',
    url: 'http://www.mortgagenewsdaily.com/rss/rates',
    name: 'MND MORTGAGE RATES',
    color: '#fcd34d',
    category: 'MORTGAGE'
  },
  {
    id: 'mnd-news',
    url: 'http://www.mortgagenewsdaily.com/rss/news',
    name: 'MND INDUSTRY NEWS',
    color: '#fbbf24',
    category: 'MORTGAGE'
  },
  {
    id: 'fannie-news',
    url: 'https://www.fanniemae.com/rss/rss.xml',
    name: 'FANNIE MAE NEWS',
    color: '#60a5fa',
    category: 'MORTGAGE'
  },
  {
    id: 'freddie-news',
    url: 'https://freddiemac.gcs-web.com/rss/news-releases.xml',
    name: 'FREDDIE MAC NEWS',
    color: '#38bdf8',
    category: 'MORTGAGE'
  },
  {
    id: 'redfin-news',
    url: 'https://www.redfin.com/news/feed',
    name: 'REDFIN NEWS',
    color: '#ef4444',
    category: 'REAL ESTATE'
  },
  {
    id: 'realtor-news',
    url: 'https://www.realtor.com/news/feed',
    name: 'REALTOR.COM NEWS',
    color: '#f97316',
    category: 'REAL ESTATE'
  },
  {
    id: 'connect-cre',
    url: 'https://www.connectcre.com/feed',
    name: 'CONNECT CRE',
    color: '#84cc16',
    category: 'REAL ESTATE'
  },
  {
    id: 'nar-news',
    url: 'https://www.nar.realtor/rss/news-releases.xml',
    name: 'NAR NEWS RELEASES',
    color: '#22c55e',
    category: 'REAL ESTATE'
  },

  // International Central Banks
  {
    id: 'boe-news',
    url: 'https://www.bankofengland.co.uk/rss/news',
    name: 'BOE NEWS',
    color: '#3b82f6',
    category: 'UK'
  },
  {
    id: 'boc-press',
    url: 'https://www.bankofcanada.ca/content_type/press-releases/feed/',
    name: 'BANK OF CANADA PRESS',
    color: '#2563eb',
    category: 'CANADA'
  },

  // Japan Feeds
  {
    id: 'jp-mof',
    url: 'https://www.mof.go.jp/english/news.rss',
    name: 'MINISTRY OF FINANCE',
    color: '#dc2626',
    category: 'JAPAN'
  },
  {
    id: 'jp-boj',
    url: 'https://www.boj.or.jp/en/rss/whatsnew.xml',
    name: 'BANK OF JAPAN',
    color: '#ef4444',
    category: 'JAPAN'
  },
  {
    id: 'jp-nhk',
    url: 'https://www3.nhk.or.jp/rss/news/cat0.xml',
    name: 'NHK NEWS',
    color: '#f97316',
    category: 'JAPAN'
  },
  {
    id: 'jp-today',
    url: 'https://japantoday.com/feed',
    name: 'JAPAN TODAY',
    color: '#f59e0b',
    category: 'JAPAN'
  },
  {
    id: 'jp-nikkei',
    url: 'https://asia.nikkei.com/rss/feed/nar',
    name: 'NIKKEI ASIA',
    color: '#0ea5e9',
    category: 'JAPAN'
  },

  {
    id: 'cbr-press',
    url: 'http://www.cbr.ru/rss/EngRssPress',
    name: 'RUSSIA CBR PRESS',
    color: '#ef4444',
    category: 'GLOBAL_MACRO'
  },

  // Science & Research
  {
    id: 'arxiv-energy',
    url: 'http://export.arxiv.org/api/query?search_query=cat:q-fin.ST+OR+cat:physics.soc-ph&sortBy=submittedDate&sortOrder=descending',
    name: 'ARXIV (SELECTED)',
    color: '#a78bfa',
    category: 'RESEARCH'
  },
  {
    id: 'llnl',
    url: 'https://www.llnl.gov/rss.xml',
    name: 'LAWRENCE LIVERMORE',
    color: '#8b5cf6',
    category: 'RESEARCH'
  },
  {
    id: 'ornl',
    url: 'https://www.ornl.gov/feeds/news-releases.xml',
    name: 'OAK RIDGE NL',
    color: '#60a5fa',
    category: 'RESEARCH'
  },
  {
    id: 'mit-energy',
    url: 'https://energy.mit.edu/feed',
    name: 'MIT ENERGY',
    color: '#06b6d4',
    category: 'RESEARCH'
  },
  // EurekAlert - University & Lab Press Releases
  {
    id: 'eurekalert-all',
    url: 'https://www.eurekalert.org/rss/technology_engineering.xml',
    name: 'EUREKALERT TECH',
    color: '#10b981',
    category: 'RESEARCH'
  },
  {
    id: 'eurekalert-science',
    url: 'https://www.eurekalert.org/rss/physics_math.xml',
    name: 'EUREKALERT PHYSICS',
    color: '#14b8a6',
    category: 'RESEARCH'
  },
  {
    id: 'eurekalert-earth',
    url: 'https://www.eurekalert.org/rss/earth_environ.xml',
    name: 'EUREKALERT EARTH',
    color: '#22c55e',
    category: 'RESEARCH'
  },
  // ScienceDaily - Research News
  {
    id: 'sciencedaily-ai',
    url: 'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml',
    name: 'SCIENCEDAILY AI',
    color: '#3b82f6',
    category: 'RESEARCH'
  },
  {
    id: 'sciencedaily-energy',
    url: 'https://www.sciencedaily.com/rss/matter_energy/energy_technology.xml',
    name: 'SCIENCEDAILY ENERGY',
    color: '#f59e0b',
    category: 'RESEARCH'
  },
  {
    id: 'sciencedaily-nuclear',
    url: 'https://www.sciencedaily.com/rss/matter_energy/nuclear_energy.xml',
    name: 'SCIENCEDAILY NUCLEAR',
    color: '#84cc16',
    category: 'RESEARCH'
  },
  {
    id: 'sciencedaily-climate',
    url: 'https://www.sciencedaily.com/rss/earth_climate/climate.xml',
    name: 'SCIENCEDAILY CLIMATE',
    color: '#0ea5e9',
    category: 'RESEARCH'
  },
  {
    id: 'sciencedaily-econ',
    url: 'https://www.sciencedaily.com/rss/science_society/economics.xml',
    name: 'SCIENCEDAILY ECONOMICS',
    color: '#8b5cf6',
    category: 'RESEARCH'
  },
  // Phys.org - Science News
  {
    id: 'phys-tech',
    url: 'https://phys.org/rss-feed/technology-news/',
    name: 'PHYS.ORG TECH',
    color: '#ec4899',
    category: 'RESEARCH'
  },
  {
    id: 'phys-physics',
    url: 'https://phys.org/rss-feed/physics-news/',
    name: 'PHYS.ORG PHYSICS',
    color: '#f43f5e',
    category: 'RESEARCH'
  },
  // Nature - Scientific Journals
  {
    id: 'nature-news',
    url: 'https://www.nature.com/nature.rss',
    name: 'NATURE',
    color: '#dc2626',
    category: 'RESEARCH'
  },
  {
    id: 'science-news',
    url: 'https://www.science.org/rss/news_current.xml',
    name: 'SCIENCE MAG',
    color: '#be185d',
    category: 'RESEARCH'
  },

  // NASA Feeds - Planetary Intelligence
  // News & General
  {
    id: 'nasa-news',
    url: 'https://www.nasa.gov/news-release/feed/',
    name: 'NASA NEWS RELEASES',
    color: '#0b3d91',
    category: 'NASA'
  },
  {
    id: 'nasa-iotd',
    url: 'https://www.nasa.gov/feeds/iotd-feed/',
    name: 'NASA IMAGE OF DAY',
    color: '#fc3d21',
    category: 'NASA'
  },
  {
    id: 'nasa-recent',
    url: 'https://www.nasa.gov/feed/',
    name: 'NASA RECENT',
    color: '#1e90ff',
    category: 'NASA'
  },
  // Mission-specific
  {
    id: 'nasa-artemis',
    url: 'https://www.nasa.gov/missions/artemis/feed/',
    name: 'ARTEMIS PROGRAM',
    color: '#f4f4f4',
    category: 'NASA'
  },
  {
    id: 'nasa-iss',
    url: 'https://www.nasa.gov/missions/station/feed/',
    name: 'SPACE STATION',
    color: '#00a3e0',
    category: 'NASA'
  },
  // Technology & Aeronautics
  {
    id: 'nasa-tech',
    url: 'https://www.nasa.gov/technology/feed/',
    name: 'NASA TECHNOLOGY',
    color: '#8b5cf6',
    category: 'NASA'
  },
  {
    id: 'nasa-aero',
    url: 'https://www.nasa.gov/aeronautics/feed/',
    name: 'NASA AERONAUTICS',
    color: '#22c55e',
    category: 'NASA'
  },
  // Research Centers (primary science/climate focus)
  {
    id: 'nasa-goddard',
    url: 'https://www.nasa.gov/centers-and-facilities/goddard/feed/',
    name: 'GODDARD SPACE CENTER',
    color: '#3b82f6',
    category: 'NASA'
  },
  {
    id: 'nasa-jpl',
    url: 'https://www.nasa.gov/centers-and-facilities/jpl/feed/',
    name: 'JET PROPULSION LAB',
    color: '#ef4444',
    category: 'NASA'
  },
  {
    id: 'nasa-giss',
    url: 'https://www.nasa.gov/centers-and-facilities/giss/feed/',
    name: 'GODDARD CLIMATE',
    color: '#10b981',
    category: 'NASA'
  },
];
