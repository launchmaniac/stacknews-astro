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
  { id: 'ARGENTINA', label: 'ARGENTINA' },
  { id: 'BRAZIL', label: 'BRAZIL' },
  { id: 'CANADA', label: 'CANADA' },
  { id: 'CHILE', label: 'CHILE' },
  { id: 'COLOMBIA', label: 'COLOMBIA' },
  { id: 'ECUADOR', label: 'ECUADOR' },
  { id: 'GUATEMALA', label: 'GUATEMALA' },
  { id: 'HONDURAS', label: 'HONDURAS' },
  { id: 'MEXICO', label: 'MEXICO' },
  { id: 'PANAMA', label: 'PANAMA' },
  { id: 'PARAGUAY', label: 'PARAGUAY' },
  { id: 'PERU', label: 'PERU' },
  { id: 'URUGUAY', label: 'URUGUAY' },

  // ASIA (alphabetical)
  { id: 'ASIA_PACIFIC', label: 'ASIA PACIFIC' },
  { id: 'CHINA', label: 'CHINA' },
  { id: 'JAPAN', label: 'JAPAN' },

  // EUROPE (alphabetical)
  { id: 'AUSTRIA', label: 'AUSTRIA' },
  { id: 'BELGIUM', label: 'BELGIUM' },
  { id: 'BOSNIA', label: 'BOSNIA & HERZ.' },
  { id: 'BULGARIA', label: 'BULGARIA' },
  { id: 'CROATIA', label: 'CROATIA' },
  { id: 'CYPRUS', label: 'CYPRUS' },
  { id: 'CZECHIA', label: 'CZECHIA' },
  { id: 'DENMARK', label: 'DENMARK' },
  { id: 'ESTONIA', label: 'ESTONIA' },
  { id: 'EUROZONE', label: 'EUROZONE' },
  { id: 'FINLAND', label: 'FINLAND' },
  { id: 'FRANCE', label: 'FRANCE' },
  { id: 'GEORGIA', label: 'GEORGIA' },
  { id: 'GERMANY', label: 'GERMANY' },
  { id: 'GREECE', label: 'GREECE' },
  { id: 'HUNGARY', label: 'HUNGARY' },
  { id: 'ICELAND', label: 'ICELAND' },
  { id: 'IRELAND', label: 'IRELAND' },
  { id: 'ITALY', label: 'ITALY' },
  { id: 'LATVIA', label: 'LATVIA' },
  { id: 'LITHUANIA', label: 'LITHUANIA' },
  { id: 'LUXEMBOURG', label: 'LUXEMBOURG' },
  { id: 'NETHERLANDS', label: 'NETHERLANDS' },
  { id: 'NORTH_MACEDONIA', label: 'N. MACEDONIA' },
  { id: 'NORWAY', label: 'NORWAY' },
  { id: 'POLAND', label: 'POLAND' },
  { id: 'PORTUGAL', label: 'PORTUGAL' },
  { id: 'ROMANIA', label: 'ROMANIA' },
  { id: 'RUSSIA', label: 'RUSSIA' },
  { id: 'SERBIA', label: 'SERBIA' },
  { id: 'SLOVAKIA', label: 'SLOVAKIA' },
  { id: 'SLOVENIA', label: 'SLOVENIA' },
  { id: 'SPAIN', label: 'SPAIN' },
  { id: 'SWEDEN', label: 'SWEDEN' },
  { id: 'SWITZERLAND', label: 'SWITZERLAND' },
  { id: 'UK', label: 'UNITED KINGDOM' },
  { id: 'UKRAINE', label: 'UKRAINE' },

  // SUB-SAHARA AFRICA (alphabetical)
  { id: 'AFRICA', label: 'AFRICA' },
  { id: 'RWANDA', label: 'RWANDA' },
  { id: 'SIERRA_LEONE', label: 'SIERRA LEONE' },

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

  // Argentina Feeds
  {
    id: 'arg-bcra',
    url: 'https://www.bcra.gob.ar/Noticias/Noticias_i.xml',
    name: 'BCRA (CENTRAL BANK)',
    color: '#75aadb',
    category: 'ARGENTINA'
  },
  {
    id: 'arg-infobae',
    url: 'https://www.infobae.com/feeds/rss/',
    name: 'INFOBAE',
    color: '#1a1a1a',
    category: 'ARGENTINA'
  },
  {
    id: 'arg-lanacion',
    url: 'https://www.lanacion.com.ar/arcio/rss/',
    name: 'LA NACION',
    color: '#004a8c',
    category: 'ARGENTINA'
  },
  {
    id: 'arg-clarin',
    url: 'https://www.clarin.com/rss/lo-ultimo/',
    name: 'CLARIN',
    color: '#d52b1e',
    category: 'ARGENTINA'
  },

  // Brazil Feeds
  {
    id: 'bra-bcb',
    url: 'https://www.bcb.gov.br/api/feed/sitebcb/sitefeeds/noticias',
    name: 'BCB (CENTRAL BANK)',
    color: '#009b3a',
    category: 'BRAZIL'
  },
  {
    id: 'bra-gov',
    url: 'https://www.gov.br/pt-br/noticias/RSS',
    name: 'GOV.BR NEWS',
    color: '#009c3b',
    category: 'BRAZIL'
  },
  {
    id: 'bra-folha',
    url: 'https://feeds.folha.uol.com.br/poder/rss091.xml',
    name: 'FOLHA POLITICA',
    color: '#f7941d',
    category: 'BRAZIL'
  },
  {
    id: 'bra-estadao',
    url: 'https://www.estadao.com.br/arc/outboundfeeds/rss/',
    name: 'ESTADAO',
    color: '#005a9c',
    category: 'BRAZIL'
  },
  {
    id: 'bra-globo',
    url: 'https://g1.globo.com/rss/g1/',
    name: 'GLOBO G1',
    color: '#c62828',
    category: 'BRAZIL'
  },

  // Chile Feeds
  {
    id: 'chl-bcc',
    url: 'https://www.bcentral.cl/web/banco-central-de-chile/-/rss/notas_de_prensa_xml',
    name: 'BCC (CENTRAL BANK)',
    color: '#0033a0',
    category: 'CHILE'
  },
  {
    id: 'chl-emol',
    url: 'https://www.emol.com/rss/rss.asp',
    name: 'EMOL',
    color: '#003366',
    category: 'CHILE'
  },
  {
    id: 'chl-latercera',
    url: 'https://www.latercera.com/arc/outboundfeeds/rss/',
    name: 'LA TERCERA',
    color: '#0066cc',
    category: 'CHILE'
  },
  {
    id: 'chl-df',
    url: 'https://www.df.cl/noticias/rss/economia.xml',
    name: 'DIARIO FINANCIERO',
    color: '#1a5276',
    category: 'CHILE'
  },

  // Colombia Feeds
  {
    id: 'col-banrep',
    url: 'https://www.banrep.gov.co/es/rss.xml',
    name: 'BANREP (CENTRAL BANK)',
    color: '#fcd116',
    category: 'COLOMBIA'
  },
  {
    id: 'col-eltiempo',
    url: 'https://www.eltiempo.com/rss/economia.xml',
    name: 'EL TIEMPO',
    color: '#003366',
    category: 'COLOMBIA'
  },
  {
    id: 'col-semana',
    url: 'https://www.semana.com/rss',
    name: 'SEMANA',
    color: '#c41230',
    category: 'COLOMBIA'
  },
  {
    id: 'col-portafolio',
    url: 'https://www.portafolio.co/rss.xml',
    name: 'PORTAFOLIO',
    color: '#1a5276',
    category: 'COLOMBIA'
  },

  // Ecuador Feeds
  {
    id: 'ecu-bce',
    url: 'https://www.bce.fin.ec/rss.xml',
    name: 'BCE (CENTRAL BANK)',
    color: '#ffd100',
    category: 'ECUADOR'
  },
  {
    id: 'ecu-universo',
    url: 'https://www.eluniverso.com/arc/outboundfeeds/rss/',
    name: 'EL UNIVERSO',
    color: '#003399',
    category: 'ECUADOR'
  },
  {
    id: 'ecu-comercio',
    url: 'https://www.elcomercio.com/feed/',
    name: 'EL COMERCIO',
    color: '#1a1a1a',
    category: 'ECUADOR'
  },

  // Guatemala Feeds
  {
    id: 'gtm-banguat',
    url: 'https://www.banguat.gob.gt/rss/noticias.xml',
    name: 'BANGUAT (CENTRAL BANK)',
    color: '#0047ab',
    category: 'GUATEMALA'
  },
  {
    id: 'gtm-prensa',
    url: 'https://www.prensalibre.com/feed/',
    name: 'PRENSA LIBRE',
    color: '#003366',
    category: 'GUATEMALA'
  },

  // Honduras Feeds
  {
    id: 'hnd-bch',
    url: 'https://www.bch.hn/rss/noticias.xml',
    name: 'BCH (CENTRAL BANK)',
    color: '#0073cf',
    category: 'HONDURAS'
  },
  {
    id: 'hnd-laprensa',
    url: 'https://www.laprensa.hn/feed/',
    name: 'LA PRENSA HN',
    color: '#003366',
    category: 'HONDURAS'
  },

  // Mexico Feeds
  {
    id: 'mex-banxico',
    url: 'https://www.banxico.org.mx/rss/banxico.xml',
    name: 'BANXICO (CENTRAL BANK)',
    color: '#006847',
    category: 'MEXICO'
  },
  {
    id: 'mex-gob',
    url: 'https://www.gob.mx/gobierno/rss.xml',
    name: 'GOB.MX',
    color: '#9e2343',
    category: 'MEXICO'
  },
  {
    id: 'mex-reforma',
    url: 'https://www.reforma.com/rss/',
    name: 'REFORMA',
    color: '#e31937',
    category: 'MEXICO'
  },
  {
    id: 'mex-elfinanciero',
    url: 'https://www.elfinanciero.com.mx/arc/outboundfeeds/rss/',
    name: 'EL FINANCIERO',
    color: '#002f6c',
    category: 'MEXICO'
  },
  {
    id: 'mex-expansion',
    url: 'https://expansion.mx/rss',
    name: 'EXPANSION MX',
    color: '#1a5276',
    category: 'MEXICO'
  },
  {
    id: 'mex-jornada',
    url: 'https://www.jornada.com.mx/rss/economia.xml',
    name: 'LA JORNADA',
    color: '#003366',
    category: 'MEXICO'
  },

  // Panama Feeds
  {
    id: 'pan-bnp',
    url: 'https://www.bfrb.gob.pa/rss/noticias.xml',
    name: 'SUPERINTENDENCIA BANCOS',
    color: '#005eb8',
    category: 'PANAMA'
  },
  {
    id: 'pan-prensa',
    url: 'https://www.prensa.com/feed/',
    name: 'LA PRENSA PA',
    color: '#003366',
    category: 'PANAMA'
  },
  {
    id: 'pan-estrella',
    url: 'https://www.laestrella.com.pa/feed/',
    name: 'LA ESTRELLA PANAMA',
    color: '#1a5276',
    category: 'PANAMA'
  },

  // Paraguay Feeds
  {
    id: 'pry-bcp',
    url: 'https://www.bcp.gov.py/rss/noticias.xml',
    name: 'BCP (CENTRAL BANK)',
    color: '#0038a8',
    category: 'PARAGUAY'
  },
  {
    id: 'pry-abc',
    url: 'https://www.abc.com.py/rss/',
    name: 'ABC COLOR',
    color: '#003366',
    category: 'PARAGUAY'
  },
  {
    id: 'pry-lanacion',
    url: 'https://www.lanacion.com.py/feed/',
    name: 'LA NACION PY',
    color: '#1a5276',
    category: 'PARAGUAY'
  },

  // Peru Feeds
  {
    id: 'per-bcrp',
    url: 'https://www.bcrp.gob.pe/rss/noticias.xml',
    name: 'BCRP (CENTRAL BANK)',
    color: '#d91023',
    category: 'PERU'
  },
  {
    id: 'per-elcomercio',
    url: 'https://elcomercio.pe/arcio/rss/',
    name: 'EL COMERCIO PE',
    color: '#003366',
    category: 'PERU'
  },
  {
    id: 'per-gestion',
    url: 'https://gestion.pe/arcio/rss/',
    name: 'GESTION',
    color: '#ff6600',
    category: 'PERU'
  },
  {
    id: 'per-larepublica',
    url: 'https://larepublica.pe/rss/',
    name: 'LA REPUBLICA',
    color: '#c41230',
    category: 'PERU'
  },

  // Uruguay Feeds
  {
    id: 'ury-bcu',
    url: 'https://www.bcu.gub.uy/RSS/Paginas/Noticias.aspx',
    name: 'BCU (CENTRAL BANK)',
    color: '#0038a8',
    category: 'URUGUAY'
  },
  {
    id: 'ury-pais',
    url: 'https://www.elpais.com.uy/rss/',
    name: 'EL PAIS UY',
    color: '#003366',
    category: 'URUGUAY'
  },
  {
    id: 'ury-observador',
    url: 'https://www.elobservador.com.uy/rss/',
    name: 'EL OBSERVADOR',
    color: '#1a5276',
    category: 'URUGUAY'
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

  // =============================================================================
  // EUROPE FEEDS
  // =============================================================================

  // Austria Feeds
  {
    id: 'aut-oenb',
    url: 'https://www.oenb.at/en/rss/press-releases.xml',
    name: 'OENB (CENTRAL BANK)',
    color: '#ed1c24',
    category: 'AUSTRIA'
  },
  {
    id: 'aut-derstandard',
    url: 'https://www.derstandard.at/rss',
    name: 'DER STANDARD',
    color: '#1a1a1a',
    category: 'AUSTRIA'
  },
  {
    id: 'aut-wienerzeitung',
    url: 'https://www.wienerzeitung.at/rss/',
    name: 'WIENER ZEITUNG',
    color: '#003366',
    category: 'AUSTRIA'
  },

  // Belgium Feeds
  {
    id: 'bel-nbb',
    url: 'https://www.nbb.be/en/rss/press-releases',
    name: 'NBB (CENTRAL BANK)',
    color: '#fdda24',
    category: 'BELGIUM'
  },
  {
    id: 'bel-rtbf',
    url: 'https://www.rtbf.be/article/rss',
    name: 'RTBF NEWS',
    color: '#0055a4',
    category: 'BELGIUM'
  },
  {
    id: 'bel-lesoir',
    url: 'https://www.lesoir.be/rss/homepage.xml',
    name: 'LE SOIR',
    color: '#1a1a1a',
    category: 'BELGIUM'
  },

  // Bosnia and Herzegovina Feeds
  {
    id: 'bih-cbbh',
    url: 'https://www.cbbh.ba/en/rss/news',
    name: 'CBBH (CENTRAL BANK)',
    color: '#002395',
    category: 'BOSNIA'
  },
  {
    id: 'bih-klix',
    url: 'https://www.klix.ba/rss',
    name: 'KLIX.BA',
    color: '#ef4444',
    category: 'BOSNIA'
  },

  // Bulgaria Feeds (already exists, adding central bank)
  {
    id: 'bgr-bnb',
    url: 'https://www.bnb.bg/RSS/rss.xml',
    name: 'BNB (CENTRAL BANK)',
    color: '#00966e',
    category: 'BULGARIA'
  },

  // Croatia Feeds
  {
    id: 'hrv-hnb',
    url: 'https://www.hnb.hr/en/rss/press-releases',
    name: 'HNB (CENTRAL BANK)',
    color: '#ff0000',
    category: 'CROATIA'
  },
  {
    id: 'hrv-index',
    url: 'https://www.index.hr/rss',
    name: 'INDEX.HR',
    color: '#1a5276',
    category: 'CROATIA'
  },
  {
    id: 'hrv-vecernji',
    url: 'https://www.vecernji.hr/rss/',
    name: 'VECERNJI LIST',
    color: '#003366',
    category: 'CROATIA'
  },

  // Cyprus Feeds
  {
    id: 'cyp-cbc',
    url: 'https://www.centralbank.cy/en/rss/press-releases',
    name: 'CBC (CENTRAL BANK)',
    color: '#d57500',
    category: 'CYPRUS'
  },
  {
    id: 'cyp-cna',
    url: 'https://in-cyprus.philenews.com/feed/',
    name: 'IN-CYPRUS NEWS',
    color: '#003366',
    category: 'CYPRUS'
  },

  // Czech Republic Feeds
  {
    id: 'cze-cnb',
    url: 'https://www.cnb.cz/en/rss/press_releases.xml',
    name: 'CNB (CENTRAL BANK)',
    color: '#11457e',
    category: 'CZECHIA'
  },
  {
    id: 'cze-idnes',
    url: 'https://www.idnes.cz/rss',
    name: 'IDNES.CZ',
    color: '#e31e24',
    category: 'CZECHIA'
  },
  {
    id: 'cze-aktualne',
    url: 'https://www.aktualne.cz/rss/',
    name: 'AKTUALNE.CZ',
    color: '#003366',
    category: 'CZECHIA'
  },

  // Denmark Feeds
  {
    id: 'dnk-nationalbanken',
    url: 'https://www.nationalbanken.dk/en/rss/news',
    name: 'NATIONALBANKEN',
    color: '#c60c30',
    category: 'DENMARK'
  },
  {
    id: 'dnk-dr',
    url: 'https://www.dr.dk/nyheder/service/feeds/allenyheder',
    name: 'DR NYHEDER',
    color: '#e31837',
    category: 'DENMARK'
  },
  {
    id: 'dnk-berlingske',
    url: 'https://www.berlingske.dk/rss/',
    name: 'BERLINGSKE',
    color: '#003366',
    category: 'DENMARK'
  },

  // Estonia Feeds
  {
    id: 'est-eestipank',
    url: 'https://www.eestipank.ee/en/rss/press-releases',
    name: 'EESTI PANK',
    color: '#0072ce',
    category: 'ESTONIA'
  },
  {
    id: 'est-err',
    url: 'https://news.err.ee/rss',
    name: 'ERR NEWS',
    color: '#003366',
    category: 'ESTONIA'
  },

  // Finland Feeds
  {
    id: 'fin-bof',
    url: 'https://www.suomenpankki.fi/en/rss/press-releases/',
    name: 'SUOMEN PANKKI',
    color: '#003580',
    category: 'FINLAND'
  },
  {
    id: 'fin-yle',
    url: 'https://feeds.yle.fi/uutiset/v1/majorHeadlines/YLE_UUTISET.rss',
    name: 'YLE UUTISET',
    color: '#00b4e6',
    category: 'FINLAND'
  },
  {
    id: 'fin-hs',
    url: 'https://www.hs.fi/rss/',
    name: 'HELSINGIN SANOMAT',
    color: '#1a1a1a',
    category: 'FINLAND'
  },

  // France Feeds
  {
    id: 'fra-bdf',
    url: 'https://www.banque-france.fr/en/rss/press-releases',
    name: 'BANQUE DE FRANCE',
    color: '#002654',
    category: 'FRANCE'
  },
  {
    id: 'fra-lemonde',
    url: 'https://www.lemonde.fr/rss/une.xml',
    name: 'LE MONDE',
    color: '#1a1a1a',
    category: 'FRANCE'
  },
  {
    id: 'fra-figaro',
    url: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
    name: 'LE FIGARO',
    color: '#005a9c',
    category: 'FRANCE'
  },
  {
    id: 'fra-lesechos',
    url: 'https://www.lesechos.fr/rss/rss_une.xml',
    name: 'LES ECHOS',
    color: '#e85d04',
    category: 'FRANCE'
  },

  // Georgia Feeds
  {
    id: 'geo-nbg',
    url: 'https://nbg.gov.ge/en/rss/news',
    name: 'NBG (CENTRAL BANK)',
    color: '#da291c',
    category: 'GEORGIA'
  },
  {
    id: 'geo-civil',
    url: 'https://civil.ge/feed',
    name: 'CIVIL GEORGIA',
    color: '#003366',
    category: 'GEORGIA'
  },

  // Germany Feeds
  {
    id: 'deu-bundesbank',
    url: 'https://www.bundesbank.de/en/rss/press-releases.rss',
    name: 'BUNDESBANK',
    color: '#ffcc00',
    category: 'GERMANY'
  },
  {
    id: 'deu-spiegel',
    url: 'https://www.spiegel.de/schlagzeilen/index.rss',
    name: 'DER SPIEGEL',
    color: '#e64415',
    category: 'GERMANY'
  },
  {
    id: 'deu-faz',
    url: 'https://www.faz.net/rss/aktuell/',
    name: 'FAZ',
    color: '#003366',
    category: 'GERMANY'
  },
  {
    id: 'deu-handelsblatt',
    url: 'https://www.handelsblatt.com/contentexport/feed/top-themen',
    name: 'HANDELSBLATT',
    color: '#e85d04',
    category: 'GERMANY'
  },
  {
    id: 'deu-dw',
    url: 'https://rss.dw.com/rss/rdf/rss-en-all',
    name: 'DW NEWS',
    color: '#0055a4',
    category: 'GERMANY'
  },

  // Greece Feeds
  {
    id: 'grc-bog',
    url: 'https://www.bankofgreece.gr/en/rss/press-releases',
    name: 'BANK OF GREECE',
    color: '#0d5eaf',
    category: 'GREECE'
  },
  {
    id: 'grc-kathimerini',
    url: 'https://www.ekathimerini.com/rss/',
    name: 'EKATHIMERINI',
    color: '#003366',
    category: 'GREECE'
  },

  // Hungary Feeds
  {
    id: 'hun-mnb',
    url: 'https://www.mnb.hu/en/rss/press-releases',
    name: 'MNB (CENTRAL BANK)',
    color: '#477050',
    category: 'HUNGARY'
  },
  {
    id: 'hun-index',
    url: 'https://index.hu/24ora/rss/',
    name: 'INDEX.HU',
    color: '#ff6600',
    category: 'HUNGARY'
  },
  {
    id: 'hun-hvg',
    url: 'https://hvg.hu/rss/hvg.hu.rss',
    name: 'HVG',
    color: '#003366',
    category: 'HUNGARY'
  },

  // Iceland Feeds
  {
    id: 'isl-cb',
    url: 'https://www.cb.is/rss/news/',
    name: 'CENTRAL BANK ICE',
    color: '#003897',
    category: 'ICELAND'
  },
  {
    id: 'isl-ruv',
    url: 'https://www.ruv.is/rss/frettir',
    name: 'RUV NEWS',
    color: '#dc143c',
    category: 'ICELAND'
  },

  // Ireland Feeds
  {
    id: 'irl-cbi',
    url: 'https://www.centralbank.ie/rss/news',
    name: 'CENTRAL BANK IRL',
    color: '#169b62',
    category: 'IRELAND'
  },
  {
    id: 'irl-rte',
    url: 'https://www.rte.ie/news/rss/news-headlines.xml',
    name: 'RTE NEWS',
    color: '#00a651',
    category: 'IRELAND'
  },
  {
    id: 'irl-irishtimes',
    url: 'https://www.irishtimes.com/rss/',
    name: 'IRISH TIMES',
    color: '#003366',
    category: 'IRELAND'
  },

  // Italy Feeds
  {
    id: 'ita-bdi',
    url: 'https://www.bancaditalia.it/rss/comunicati-stampa.xml',
    name: 'BANCA D\'ITALIA',
    color: '#009246',
    category: 'ITALY'
  },
  {
    id: 'ita-corriere',
    url: 'https://xml2.corriereobjects.it/rss/homepage.xml',
    name: 'CORRIERE DELLA SERA',
    color: '#003366',
    category: 'ITALY'
  },
  {
    id: 'ita-repubblica',
    url: 'https://www.repubblica.it/rss/homepage/rss2.0.xml',
    name: 'LA REPUBBLICA',
    color: '#e31937',
    category: 'ITALY'
  },
  {
    id: 'ita-sole24',
    url: 'https://www.ilsole24ore.com/rss/mondo.xml',
    name: 'IL SOLE 24 ORE',
    color: '#f7941d',
    category: 'ITALY'
  },

  // Latvia Feeds
  {
    id: 'lva-lb',
    url: 'https://www.bank.lv/en/rss/press-releases',
    name: 'LATVIJAS BANKA',
    color: '#9e3039',
    category: 'LATVIA'
  },
  {
    id: 'lva-lsm',
    url: 'https://eng.lsm.lv/rss/',
    name: 'LSM NEWS',
    color: '#003366',
    category: 'LATVIA'
  },

  // Lithuania Feeds
  {
    id: 'ltu-lb',
    url: 'https://www.lb.lt/en/rss/press-releases',
    name: 'LIETUVOS BANKAS',
    color: '#fdb913',
    category: 'LITHUANIA'
  },
  {
    id: 'ltu-lrt',
    url: 'https://www.lrt.lt/rss/naujienos',
    name: 'LRT NEWS',
    color: '#006a44',
    category: 'LITHUANIA'
  },
  {
    id: 'ltu-delfi',
    url: 'https://www.delfi.lt/rss/',
    name: 'DELFI.LT',
    color: '#003366',
    category: 'LITHUANIA'
  },

  // Luxembourg Feeds
  {
    id: 'lux-bcl',
    url: 'https://www.bcl.lu/en/rss/press-releases',
    name: 'BCL (CENTRAL BANK)',
    color: '#00a2e8',
    category: 'LUXEMBOURG'
  },
  {
    id: 'lux-wort',
    url: 'https://www.wort.lu/en/rss/',
    name: 'LUXEMBURGER WORT',
    color: '#003366',
    category: 'LUXEMBOURG'
  },

  // Netherlands Feeds
  {
    id: 'nld-dnb',
    url: 'https://www.dnb.nl/en/rss/press-releases/',
    name: 'DNB (CENTRAL BANK)',
    color: '#ff6600',
    category: 'NETHERLANDS'
  },
  {
    id: 'nld-nos',
    url: 'https://feeds.nos.nl/nosnieuwsalgemeen',
    name: 'NOS NEWS',
    color: '#f26c22',
    category: 'NETHERLANDS'
  },
  {
    id: 'nld-telegraaf',
    url: 'https://www.telegraaf.nl/rss',
    name: 'DE TELEGRAAF',
    color: '#003366',
    category: 'NETHERLANDS'
  },
  {
    id: 'nld-fd',
    url: 'https://fd.nl/rss',
    name: 'FIN. DAGBLAD',
    color: '#e85d04',
    category: 'NETHERLANDS'
  },

  // North Macedonia Feeds
  {
    id: 'mkd-nbrm',
    url: 'https://www.nbrm.mk/en/rss/press-releases',
    name: 'NBRM (CENTRAL BANK)',
    color: '#d20000',
    category: 'NORTH_MACEDONIA'
  },
  {
    id: 'mkd-mkd',
    url: 'https://www.mkd.mk/rss/',
    name: 'MKD.MK',
    color: '#ffcd00',
    category: 'NORTH_MACEDONIA'
  },

  // Norway Feeds
  {
    id: 'nor-norgesbank',
    url: 'https://www.norges-bank.no/en/rss/press-releases/',
    name: 'NORGES BANK',
    color: '#ba0c2f',
    category: 'NORWAY'
  },
  {
    id: 'nor-nrk',
    url: 'https://www.nrk.no/toppsaker.rss',
    name: 'NRK NEWS',
    color: '#0070b8',
    category: 'NORWAY'
  },
  {
    id: 'nor-vg',
    url: 'https://www.vg.no/rss/feed/',
    name: 'VG',
    color: '#ef4444',
    category: 'NORWAY'
  },
  {
    id: 'nor-aftenposten',
    url: 'https://www.aftenposten.no/rss/',
    name: 'AFTENPOSTEN',
    color: '#003366',
    category: 'NORWAY'
  },

  // Poland Feeds
  {
    id: 'pol-nbp',
    url: 'https://www.nbp.pl/en/rss/press.xml',
    name: 'NBP (CENTRAL BANK)',
    color: '#dc143c',
    category: 'POLAND'
  },
  {
    id: 'pol-tvn24',
    url: 'https://tvn24.pl/najnowsze.xml',
    name: 'TVN24',
    color: '#f26c22',
    category: 'POLAND'
  },
  {
    id: 'pol-wyborcza',
    url: 'https://wyborcza.pl/rss/0,0.html',
    name: 'GAZETA WYBORCZA',
    color: '#003366',
    category: 'POLAND'
  },
  {
    id: 'pol-parkiet',
    url: 'https://www.parkiet.com/rss',
    name: 'PARKIET',
    color: '#e85d04',
    category: 'POLAND'
  },

  // Portugal Feeds
  {
    id: 'prt-bportugal',
    url: 'https://www.bportugal.pt/en/rss/press-releases',
    name: 'BANCO PORTUGAL',
    color: '#006600',
    category: 'PORTUGAL'
  },
  {
    id: 'prt-publico',
    url: 'https://feeds.feedburner.com/PublicoRSS',
    name: 'PUBLICO',
    color: '#1a1a1a',
    category: 'PORTUGAL'
  },
  {
    id: 'prt-jornaldenegocios',
    url: 'https://www.jornaldenegocios.pt/rss',
    name: 'JORNAL DE NEGOCIOS',
    color: '#e85d04',
    category: 'PORTUGAL'
  },

  // Romania Feeds
  {
    id: 'rou-bnr',
    url: 'https://www.bnr.ro/rss/press-releases-en.xml',
    name: 'BNR (CENTRAL BANK)',
    color: '#002b7f',
    category: 'ROMANIA'
  },
  {
    id: 'rou-digi24',
    url: 'https://www.digi24.ro/rss',
    name: 'DIGI24',
    color: '#0055a4',
    category: 'ROMANIA'
  },
  {
    id: 'rou-hotnews',
    url: 'https://www.hotnews.ro/rss/',
    name: 'HOTNEWS.RO',
    color: '#ef4444',
    category: 'ROMANIA'
  },

  // Russia Feeds
  {
    id: 'rus-cbr',
    url: 'http://www.cbr.ru/rss/EngRssPress',
    name: 'CBR (CENTRAL BANK)',
    color: '#0039a6',
    category: 'RUSSIA'
  },
  {
    id: 'rus-tass',
    url: 'https://tass.com/rss/v2.xml',
    name: 'TASS',
    color: '#dc2626',
    category: 'RUSSIA'
  },
  {
    id: 'rus-rt',
    url: 'https://www.rt.com/rss/',
    name: 'RT NEWS',
    color: '#6cbd45',
    category: 'RUSSIA'
  },

  // Serbia Feeds
  {
    id: 'srb-nbs',
    url: 'https://www.nbs.rs/en/rss/press-releases',
    name: 'NBS (CENTRAL BANK)',
    color: '#c6363c',
    category: 'SERBIA'
  },
  {
    id: 'srb-b92',
    url: 'https://www.b92.net/rss/',
    name: 'B92',
    color: '#003366',
    category: 'SERBIA'
  },

  // Slovakia Feeds
  {
    id: 'svk-nbs',
    url: 'https://www.nbs.sk/en/rss/press-releases',
    name: 'NBS (CENTRAL BANK)',
    color: '#0b4ea2',
    category: 'SLOVAKIA'
  },
  {
    id: 'svk-sme',
    url: 'https://www.sme.sk/rss',
    name: 'SME.SK',
    color: '#003366',
    category: 'SLOVAKIA'
  },
  {
    id: 'svk-aktuality',
    url: 'https://www.aktuality.sk/rss/',
    name: 'AKTUALITY.SK',
    color: '#ef4444',
    category: 'SLOVAKIA'
  },

  // Slovenia Feeds
  {
    id: 'svn-bsi',
    url: 'https://www.bsi.si/en/rss/press-releases',
    name: 'BSI (CENTRAL BANK)',
    color: '#005da4',
    category: 'SLOVENIA'
  },
  {
    id: 'svn-rtv',
    url: 'https://www.rtvslo.si/feeds/00.xml',
    name: 'RTV SLOVENIA',
    color: '#003366',
    category: 'SLOVENIA'
  },

  // Spain Feeds
  {
    id: 'esp-bde',
    url: 'https://www.bde.es/rss/webbde/SectionesEN/SalaPrensa/ComunicadosBCE/',
    name: 'BANCO DE ESPANA',
    color: '#aa151b',
    category: 'SPAIN'
  },
  {
    id: 'esp-elpais',
    url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada',
    name: 'EL PAIS',
    color: '#1a1a1a',
    category: 'SPAIN'
  },
  {
    id: 'esp-elmundo',
    url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml',
    name: 'EL MUNDO',
    color: '#003366',
    category: 'SPAIN'
  },
  {
    id: 'esp-expansion',
    url: 'https://e00-expansion.uecdn.es/rss/portada.xml',
    name: 'EXPANSION ES',
    color: '#e85d04',
    category: 'SPAIN'
  },
  {
    id: 'esp-cincodias',
    url: 'https://cincodias.elpais.com/rss/portada.xml',
    name: 'CINCO DIAS',
    color: '#0055a4',
    category: 'SPAIN'
  },

  // Sweden Feeds
  {
    id: 'swe-riksbank',
    url: 'https://www.riksbank.se/en/rss/press-releases/',
    name: 'RIKSBANK',
    color: '#006aa7',
    category: 'SWEDEN'
  },
  {
    id: 'swe-svd',
    url: 'https://www.svd.se/feed/articles.rss',
    name: 'SVD',
    color: '#003366',
    category: 'SWEDEN'
  },
  {
    id: 'swe-dn',
    url: 'https://www.dn.se/rss/',
    name: 'DAGENS NYHETER',
    color: '#1a1a1a',
    category: 'SWEDEN'
  },
  {
    id: 'swe-di',
    url: 'https://www.di.se/rss',
    name: 'DAGENS INDUSTRI',
    color: '#e85d04',
    category: 'SWEDEN'
  },

  // Switzerland Feeds
  {
    id: 'che-snb',
    url: 'https://www.snb.ch/en/rss/mmr/press-releases',
    name: 'SNB (CENTRAL BANK)',
    color: '#d52b1e',
    category: 'SWITZERLAND'
  },
  {
    id: 'che-nzz',
    url: 'https://www.nzz.ch/recent.rss',
    name: 'NZZ',
    color: '#003366',
    category: 'SWITZERLAND'
  },
  {
    id: 'che-swissinfo',
    url: 'https://www.swissinfo.ch/eng/rss/news',
    name: 'SWISSINFO',
    color: '#ef4444',
    category: 'SWITZERLAND'
  },
  {
    id: 'che-letemps',
    url: 'https://www.letemps.ch/rss.xml',
    name: 'LE TEMPS',
    color: '#1a1a1a',
    category: 'SWITZERLAND'
  },

  // Ukraine Feeds
  {
    id: 'ukr-nbu',
    url: 'https://bank.gov.ua/en/rss/news',
    name: 'NBU (CENTRAL BANK)',
    color: '#0057b7',
    category: 'UKRAINE'
  },
  {
    id: 'ukr-pravda',
    url: 'https://www.pravda.com.ua/rss/',
    name: 'UKRAINSKA PRAVDA',
    color: '#ffd700',
    category: 'UKRAINE'
  },
  {
    id: 'ukr-kyivindependent',
    url: 'https://kyivindependent.com/feed/',
    name: 'KYIV INDEPENDENT',
    color: '#0057b7',
    category: 'UKRAINE'
  },
  {
    id: 'ukr-unian',
    url: 'https://www.unian.net/rss/',
    name: 'UNIAN',
    color: '#003366',
    category: 'UKRAINE'
  },

  // =============================================================================
  // AFRICA FEEDS (NEW)
  // =============================================================================

  // Rwanda Feeds
  {
    id: 'rwa-bnr',
    url: 'https://www.bnr.rw/rss/news',
    name: 'BNR (CENTRAL BANK)',
    color: '#00a2e8',
    category: 'RWANDA'
  },
  {
    id: 'rwa-newtimes',
    url: 'https://www.newtimes.co.rw/rssFeed',
    name: 'NEW TIMES',
    color: '#1a1a1a',
    category: 'RWANDA'
  },

  // Sierra Leone Feeds
  {
    id: 'sle-bsl',
    url: 'https://www.bsl.gov.sl/rss/news',
    name: 'BSL (CENTRAL BANK)',
    color: '#1eb53a',
    category: 'SIERRA_LEONE'
  },
  {
    id: 'sle-awoko',
    url: 'https://awokonewspaper.sl/feed/',
    name: 'AWOKO',
    color: '#003366',
    category: 'SIERRA_LEONE'
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
