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

  // Section: United States
  { id: '_SECTION_US', label: 'UNITED STATES', isSection: true },
  { id: 'EXECUTIVE', label: 'WHITE HOUSE' },
  { id: 'US CONGRESS', label: 'CONGRESS' },
  { id: 'TREASURY', label: 'TREASURY' },
  { id: 'FEDERAL RESERVE', label: 'FEDERAL RESERVE' },
  { id: 'STATE_DEPT', label: 'STATE DEPT.' },
  { id: 'MILITARY', label: 'DEFENSE & MILITARY' },
  { id: 'REGULATION', label: 'REGULATION' },
  { id: 'JUDICIAL', label: 'JUDICIAL' },
  { id: 'LABOR', label: 'LABOR & JOBS' },
  { id: 'ENERGY', label: 'ENERGY' },
  { id: 'REAL ESTATE', label: 'REAL ESTATE' },
  { id: 'MORTGAGE', label: 'MORTGAGE' },
  { id: 'NASA', label: 'NASA & SPACE' },
  { id: 'RESEARCH', label: 'RESEARCH' },
  { id: 'CYBERSECURITY', label: 'CYBERSECURITY' },

  // Section: Global & Markets
  { id: '_SECTION_GLOBAL', label: 'GLOBAL & MARKETS', isSection: true },
  { id: 'NEWS', label: 'WORLD NEWS' },
  { id: 'GLOBAL_MACRO', label: 'GLOBAL MACRO' },
  { id: 'CRYPTO', label: 'CRYPTO' },

  // Section: Americas
  { id: '_SECTION_AMERICAS', label: 'AMERICAS', isSection: true },
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
  { id: 'VENEZUELA', label: 'VENEZUELA' },

  // Section: Caribbean
  { id: '_SECTION_CARIBBEAN', label: 'CARIBBEAN', isSection: true },
  { id: 'JAMAICA', label: 'JAMAICA' },
  { id: 'SAINT_LUCIA', label: 'SAINT LUCIA' },
  { id: 'TRINIDAD', label: 'TRINIDAD & TOB.' },

  // Section: Europe
  { id: '_SECTION_EUROPE', label: 'EUROPE', isSection: true },
  { id: 'EUROZONE', label: 'EUROZONE' },
  { id: 'UK', label: 'UNITED KINGDOM' },
  { id: 'AUSTRIA', label: 'AUSTRIA' },
  { id: 'BELGIUM', label: 'BELGIUM' },
  { id: 'BOSNIA', label: 'BOSNIA & HERZ.' },
  { id: 'BULGARIA', label: 'BULGARIA' },
  { id: 'CROATIA', label: 'CROATIA' },
  { id: 'CYPRUS', label: 'CYPRUS' },
  { id: 'CZECHIA', label: 'CZECHIA' },
  { id: 'DENMARK', label: 'DENMARK' },
  { id: 'ESTONIA', label: 'ESTONIA' },
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
  { id: 'UKRAINE', label: 'UKRAINE' },

  // Section: Middle East & North Africa
  { id: '_SECTION_MENA', label: 'MIDDLE EAST & N. AFRICA', isSection: true },
  { id: 'BAHRAIN', label: 'BAHRAIN' },
  { id: 'IRAN', label: 'IRAN' },
  { id: 'ISRAEL', label: 'ISRAEL' },
  { id: 'JORDAN', label: 'JORDAN' },
  { id: 'KUWAIT', label: 'KUWAIT' },
  { id: 'MOROCCO', label: 'MOROCCO' },
  { id: 'OMAN', label: 'OMAN' },
  { id: 'QATAR', label: 'QATAR' },
  { id: 'SAUDI_ARABIA', label: 'SAUDI ARABIA' },
  { id: 'TUNISIA', label: 'TUNISIA' },
  { id: 'UAE', label: 'UAE' },

  // Section: Asia
  { id: '_SECTION_ASIA', label: 'ASIA', isSection: true },
  { id: 'ASIA_PACIFIC', label: 'ASIA PACIFIC' },
  { id: 'AZERBAIJAN', label: 'AZERBAIJAN' },
  { id: 'BANGLADESH', label: 'BANGLADESH' },
  { id: 'CHINA', label: 'CHINA' },
  { id: 'INDIA', label: 'INDIA' },
  { id: 'INDONESIA', label: 'INDONESIA' },
  { id: 'JAPAN', label: 'JAPAN' },
  { id: 'KAZAKHSTAN', label: 'KAZAKHSTAN' },
  { id: 'KYRGYZSTAN', label: 'KYRGYZSTAN' },
  { id: 'MALAYSIA', label: 'MALAYSIA' },
  { id: 'MONGOLIA', label: 'MONGOLIA' },
  { id: 'NEPAL', label: 'NEPAL' },
  { id: 'PHILIPPINES', label: 'PHILIPPINES' },
  { id: 'SOUTH_KOREA', label: 'SOUTH KOREA' },
  { id: 'SRI_LANKA', label: 'SRI LANKA' },
  { id: 'TAIWAN', label: 'TAIWAN' },
  { id: 'THAILAND', label: 'THAILAND' },
  { id: 'VIETNAM', label: 'VIETNAM' },

  // Section: Pacific & Oceania
  { id: '_SECTION_PACIFIC', label: 'PACIFIC & OCEANIA', isSection: true },
  { id: 'AUSTRALIA', label: 'AUSTRALIA' },
  { id: 'NEW_ZEALAND', label: 'NEW ZEALAND' },

  // Section: Africa
  { id: '_SECTION_AFRICA', label: 'AFRICA', isSection: true },
  { id: 'AFRICA', label: 'AFRICA' },
  { id: 'BURKINA_FASO', label: 'BURKINA FASO' },
  { id: 'GHANA', label: 'GHANA' },
  { id: 'MAURITIUS', label: 'MAURITIUS' },
  { id: 'NAMIBIA', label: 'NAMIBIA' },
  { id: 'RWANDA', label: 'RWANDA' },
  { id: 'SIERRA_LEONE', label: 'SIERRA LEONE' },
  { id: 'TANZANIA', label: 'TANZANIA' },
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
  {
    id: 'economic-indicators',
    url: 'https://www.govinfo.gov/rss/econi.xml',
    name: 'ECONOMIC INDICATORS',
    color: '#22c55e',
    category: 'TREASURY'
  },
  {
    id: 'economic-report',
    url: 'https://www.govinfo.gov/rss/erp.xml',
    name: 'ECONOMIC REPORT OF PRESIDENT',
    color: '#059669',
    category: 'TREASURY'
  },
  {
    id: 'treasury-mspd',
    url: 'https://www.treasurydirect.gov/rss/mspd.xml',
    name: 'MONTHLY PUBLIC DEBT STATEMENT',
    color: '#0d9488',
    category: 'TREASURY'
  },
  {
    id: 'treasury-sbpro',
    url: 'https://www.treasurydirect.gov/rss/sbpro.xml',
    name: 'SAVINGS BONDS PRO',
    color: '#0891b2',
    category: 'TREASURY'
  },
  {
    id: 'treasury-announced',
    url: 'https://www.treasurydirect.gov/TA_WS/securities/announced/rss',
    name: 'TREASURY OFFERING ANNOUNCEMENTS',
    color: '#06b6d4',
    category: 'TREASURY'
  },
  {
    id: 'treasury-auctioned',
    url: 'https://www.treasurydirect.gov/TA_WS/securities/auctioned/rss',
    name: 'TREASURY AUCTION RESULTS',
    color: '#0ea5e9',
    category: 'TREASURY'
  },
  {
    id: 'treasury-debt-penny',
    url: 'https://www.treasurydirect.gov/government/debt/feeds/recent',
    name: 'DEBT TO THE PENNY',
    color: '#3b82f6',
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
  {
    id: 'fed-h15-discount',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFSRP_F02_N.B.XML',
    name: 'DISCOUNT RATE',
    color: '#8b5cf6',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-tbill-3m',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFSGFSM03_N.B.XML',
    name: '3-MONTH T-BILL',
    color: '#a78bfa',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-tcy-1y',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFLGFCY01_N.B.XML',
    name: '1-YEAR TREASURY CMT',
    color: '#c4b5fd',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-tcy-2y',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFLGFCY02_N.B.XML',
    name: '2-YEAR TREASURY CMT',
    color: '#ddd6fe',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-tcy-3y',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFLGFCY03_N.B.XML',
    name: '3-YEAR TREASURY CMT',
    color: '#e9d5ff',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-tcy-5y',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFLGFCY05_N.B.XML',
    name: '5-YEAR TREASURY CMT',
    color: '#f3e8ff',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-tcy-7y',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFLGFCY07_N.B.XML',
    name: '7-YEAR TREASURY CMT',
    color: '#7c3aed',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-tcy-10y',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFLGFCY10_N.B.XML',
    name: '10-YEAR TREASURY CMT',
    color: '#6d28d9',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-tcy-20y',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFLGFCY20_N.B.XML',
    name: '20-YEAR TREASURY CMT',
    color: '#5b21b6',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-tcy-30y',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFLGFCY30_N.B.XML',
    name: '30-YEAR TREASURY CMT',
    color: '#4c1d95',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-fedfunds',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFSPFF_N.B.XML',
    name: 'FEDERAL FUNDS RATE',
    color: '#dc2626',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-h15-prime',
    url: 'https://www.federalreserve.gov/feeds/Data/H15_H15_RIFSPBLP_N.B.XML',
    name: 'PRIME RATE',
    color: '#ea580c',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-feds-notes',
    url: 'https://www.federalreserve.gov/feeds/feds_notes.xml',
    name: 'FEDS NOTES',
    color: '#0284c7',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-g17',
    url: 'https://www.federalreserve.gov/feeds/g17.xml',
    name: 'INDUSTRIAL PRODUCTION (G.17)',
    color: '#0891b2',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-sloos',
    url: 'https://www.federalreserve.gov/feeds/sloos.xml',
    name: 'SENIOR LOAN OFFICER SURVEY',
    color: '#0d9488',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-working-papers',
    url: 'https://www.federalreserve.gov/feeds/working_papers.xml',
    name: 'WORKING PAPERS',
    color: '#059669',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-feds',
    url: 'https://www.federalreserve.gov/feeds/feds.xml',
    name: 'FEDS RESEARCH PAPERS',
    color: '#10b981',
    category: 'FEDERAL RESERVE'
  },
  {
    id: 'fed-ifdp',
    url: 'https://www.federalreserve.gov/feeds/ifdp.xml',
    name: 'INTL FINANCE PAPERS',
    color: '#34d399',
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
  {
    id: 'theblock',
    url: 'https://www.theblock.co/rss.xml',
    name: 'THE BLOCK',
    color: '#1e3a5f',
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
  {
    id: 'cryptofacts',
    url: 'https://cryptocurrencyfacts.com/feed/',
    name: 'CRYPTO FACTS',
    color: '#8b5cf6',
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

  // State Dept Feeds - travel.state.gov works, main state.gov intermittent
  {
    id: 'state-travel',
    url: 'https://travel.state.gov/_res/rss/TAsTWs.xml',
    name: 'TRAVEL ADVISORIES',
    color: '#ef4444',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-press',
    url: 'https://www.state.gov/rss-feed/press-releases/feed/',
    name: 'PRESS RELEASES',
    color: '#3b82f6',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-briefings',
    url: 'https://www.state.gov/rss-feed/department-press-briefings/feed/',
    name: 'PRESS BRIEFINGS',
    color: '#6366f1',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-secretary',
    url: 'https://www.state.gov/rss-feed/secretary-remarks-statements/feed/',
    name: 'SECRETARY REMARKS',
    color: '#8b5cf6',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-schedule',
    url: 'https://www.state.gov/rss-feed/public-schedule/feed/',
    name: 'PUBLIC SCHEDULE',
    color: '#a855f7',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-africa',
    url: 'https://www.state.gov/rss-feed/bureau-of-african-affairs/feed/',
    name: 'AFRICA BUREAU',
    color: '#22c55e',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-eastasia',
    url: 'https://www.state.gov/rss-feed/bureau-of-east-asian-and-pacific-affairs/feed/',
    name: 'EAST ASIA PACIFIC',
    color: '#14b8a6',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-europe',
    url: 'https://www.state.gov/rss-feed/bureau-of-european-and-eurasian-affairs/feed/',
    name: 'EUROPE EURASIA',
    color: '#0ea5e9',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-neareast',
    url: 'https://www.state.gov/rss-feed/bureau-of-near-eastern-affairs/feed/',
    name: 'NEAR EAST',
    color: '#f59e0b',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-southasia',
    url: 'https://www.state.gov/rss-feed/bureau-of-south-and-central-asian-affairs/feed/',
    name: 'SOUTH CENTRAL ASIA',
    color: '#eab308',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-westhem',
    url: 'https://www.state.gov/rss-feed/bureau-of-western-hemisphere-affairs/feed/',
    name: 'WESTERN HEMISPHERE',
    color: '#84cc16',
    category: 'STATE_DEPT'
  },
  {
    id: 'state-fedreg',
    url: 'https://www.federalregister.gov/api/v1/documents.rss?conditions%5Bagencies%5D%5B%5D=state-department',
    name: 'FED REGISTER (STATE)',
    color: '#64748b',
    category: 'STATE_DEPT'
  },

  // CISA Cybersecurity Feeds
  {
    id: 'cisa-advisories',
    url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    name: 'CISA ADVISORIES',
    color: '#ef4444',
    category: 'CYBERSECURITY'
  },
  {
    id: 'cisa-news',
    url: 'https://www.cisa.gov/news.xml',
    name: 'CISA NEWS',
    color: '#3b82f6',
    category: 'CYBERSECURITY'
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

  // Eurozone Feeds
  {
    id: 'ecb-press',
    url: 'https://www.ecb.europa.eu/rss/press.xml',
    name: 'ECB PRESS',
    color: '#3b82f6',
    category: 'EUROZONE'
  },
  {
    id: 'bis-speeches',
    url: 'https://www.bis.org/doclist/cbspeeches.rss',
    name: 'BIS CB SPEECHES',
    color: '#6366f1',
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
    id: 'bills-enrolled',
    url: 'https://www.govinfo.gov/rss/bills-enr.xml',
    name: 'ENROLLED BILLS',
    color: '#22c55e',
    category: 'US CONGRESS'
  },
  {
    id: 'statute-compilations',
    url: 'https://www.govinfo.gov/rss/comps.xml',
    name: 'STATUTE COMPILATIONS',
    color: '#16a34a',
    category: 'US CONGRESS'
  },
  {
    id: 'statutes-at-large',
    url: 'https://www.govinfo.gov/rss/statute.xml',
    name: 'STATUTES AT LARGE',
    color: '#15803d',
    category: 'US CONGRESS'
  },
  {
    id: 'us-code',
    url: 'https://www.govinfo.gov/rss/uscode.xml',
    name: 'US CODE',
    color: '#166534',
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
    id: 'congressional-record',
    url: 'https://www.govinfo.gov/rss/crec.xml',
    name: 'CONGRESSIONAL RECORD',
    color: '#10b981',
    category: 'US CONGRESS'
  },
  {
    id: 'gao-reports',
    url: 'https://www.govinfo.gov/rss/gaoreports.xml',
    name: 'GAO REPORTS',
    color: '#f59e0b',
    category: 'US CONGRESS'
  },
  {
    id: 'congressional-hearings',
    url: 'https://www.govinfo.gov/rss/chrg.xml',
    name: 'CONGRESSIONAL HEARINGS',
    color: '#8b5cf6',
    category: 'US CONGRESS'
  },
  {
    id: 'congressional-reports',
    url: 'https://www.govinfo.gov/rss/crpt.xml',
    name: 'CONGRESSIONAL REPORTS',
    color: '#06b6d4',
    category: 'US CONGRESS'
  },
  {
    id: 'committee-prints',
    url: 'https://www.govinfo.gov/rss/cprt.xml',
    name: 'COMMITTEE PRINTS',
    color: '#14b8a6',
    category: 'US CONGRESS'
  },
  {
    id: 'congressional-documents',
    url: 'https://www.govinfo.gov/rss/cdoc.xml',
    name: 'CONGRESSIONAL DOCUMENTS',
    color: '#0ea5e9',
    category: 'US CONGRESS'
  },
  {
    id: 'serial-set',
    url: 'https://www.govinfo.gov/rss/serialset.xml',
    name: 'CONGRESSIONAL SERIAL SET',
    color: '#6366f1',
    category: 'US CONGRESS'
  },
  {
    id: 'mandated-reports',
    url: 'https://www.govinfo.gov/rss/cmr.xml',
    name: 'MANDATED REPORTS',
    color: '#ec4899',
    category: 'US CONGRESS'
  },
  // Note: Senate Floor Today and LOC Law Blog feeds no longer available

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
  // USITC EDIS (Trade Investigations) - API-based feeds
  {
    id: 'edis-section337',
    url: '/api/edis.json?feed=section337',
    name: 'USITC SECTION 337',
    color: '#f97316',
    category: 'REGULATION'
  },
  {
    id: 'edis-import-injury',
    url: '/api/edis.json?feed=import-injury',
    name: 'USITC IMPORT INJURY',
    color: '#3b82f6',
    category: 'REGULATION'
  },
  // Banking/Regulatory – Note: FDIC and SEC feeds blocked by Cloudflare

  // Judicial Feeds - Supreme Court
  {
    id: 'scotus-reports',
    url: 'https://www.govinfo.gov/rss/usreports.xml',
    name: 'US SUPREME COURT',
    color: '#7c3aed',
    category: 'JUDICIAL'
  },

  // Judicial Feeds - Appellate Courts
  {
    id: 'ca1',
    url: 'https://www.govinfo.gov/rss/uscourts-ca1.xml',
    name: '1ST CIRCUIT',
    color: '#8b5cf6',
    category: 'JUDICIAL'
  },
  {
    id: 'ca2',
    url: 'https://www.govinfo.gov/rss/uscourts-ca2.xml',
    name: '2ND CIRCUIT',
    color: '#a78bfa',
    category: 'JUDICIAL'
  },
  {
    id: 'ca3',
    url: 'https://www.govinfo.gov/rss/uscourts-ca3.xml',
    name: '3RD CIRCUIT',
    color: '#c4b5fd',
    category: 'JUDICIAL'
  },
  {
    id: 'ca4',
    url: 'https://www.govinfo.gov/rss/uscourts-ca4.xml',
    name: '4TH CIRCUIT',
    color: '#6366f1',
    category: 'JUDICIAL'
  },
  {
    id: 'ca5',
    url: 'https://www.govinfo.gov/rss/uscourts-ca5.xml',
    name: '5TH CIRCUIT',
    color: '#818cf8',
    category: 'JUDICIAL'
  },
  {
    id: 'ca6',
    url: 'https://www.govinfo.gov/rss/uscourts-ca6.xml',
    name: '6TH CIRCUIT',
    color: '#a5b4fc',
    category: 'JUDICIAL'
  },
  {
    id: 'ca7',
    url: 'https://www.govinfo.gov/rss/uscourts-ca7.xml',
    name: '7TH CIRCUIT',
    color: '#3b82f6',
    category: 'JUDICIAL'
  },
  {
    id: 'ca8',
    url: 'https://www.govinfo.gov/rss/uscourts-ca8.xml',
    name: '8TH CIRCUIT',
    color: '#60a5fa',
    category: 'JUDICIAL'
  },
  {
    id: 'ca9',
    url: 'https://www.govinfo.gov/rss/uscourts-ca9.xml',
    name: '9TH CIRCUIT',
    color: '#93c5fd',
    category: 'JUDICIAL'
  },
  {
    id: 'ca10',
    url: 'https://www.govinfo.gov/rss/uscourts-ca10.xml',
    name: '10TH CIRCUIT',
    color: '#0ea5e9',
    category: 'JUDICIAL'
  },
  {
    id: 'ca11',
    url: 'https://www.govinfo.gov/rss/uscourts-ca11.xml',
    name: '11TH CIRCUIT',
    color: '#38bdf8',
    category: 'JUDICIAL'
  },
  {
    id: 'cadc',
    url: 'https://www.govinfo.gov/rss/uscourts-cadc.xml',
    name: 'DC CIRCUIT',
    color: '#7dd3fc',
    category: 'JUDICIAL'
  },
  {
    id: 'ca13',
    url: 'https://www.govinfo.gov/rss/uscourts-ca13.xml',
    name: 'FEDERAL CIRCUIT',
    color: '#06b6d4',
    category: 'JUDICIAL'
  },

  // Judicial Feeds - National Courts
  {
    id: 'jpml',
    url: 'https://www.govinfo.gov/rss/uscourts-jpml.xml',
    name: 'MULTIDISTRICT LITIGATION',
    color: '#14b8a6',
    category: 'JUDICIAL'
  },
  {
    id: 'cit',
    url: 'https://www.govinfo.gov/rss/uscourts-cit.xml',
    name: 'INTL TRADE COURT',
    color: '#2dd4bf',
    category: 'JUDICIAL'
  },
  {
    id: 'cofc',
    url: 'https://www.govinfo.gov/rss/uscourts-cofc.xml',
    name: 'FEDERAL CLAIMS',
    color: '#5eead4',
    category: 'JUDICIAL'
  },

  // Judicial Feeds - District Courts
  {
    id: 'alnd',
    url: 'https://www.govinfo.gov/rss/uscourts-alnd.xml',
    name: 'N.D. ALABAMA',
    color: '#10b981',
    category: 'JUDICIAL'
  },
  {
    id: 'almd',
    url: 'https://www.govinfo.gov/rss/uscourts-almd.xml',
    name: 'M.D. ALABAMA',
    color: '#34d399',
    category: 'JUDICIAL'
  },
  {
    id: 'alsd',
    url: 'https://www.govinfo.gov/rss/uscourts-alsd.xml',
    name: 'S.D. ALABAMA',
    color: '#6ee7b7',
    category: 'JUDICIAL'
  },
  {
    id: 'akd',
    url: 'https://www.govinfo.gov/rss/uscourts-akd.xml',
    name: 'D. ALASKA',
    color: '#22c55e',
    category: 'JUDICIAL'
  },
  {
    id: 'azd',
    url: 'https://www.govinfo.gov/rss/uscourts-azd.xml',
    name: 'D. ARIZONA',
    color: '#4ade80',
    category: 'JUDICIAL'
  },
  {
    id: 'ared',
    url: 'https://www.govinfo.gov/rss/uscourts-ared.xml',
    name: 'E.D. ARKANSAS',
    color: '#86efac',
    category: 'JUDICIAL'
  },
  {
    id: 'caed',
    url: 'https://www.govinfo.gov/rss/uscourts-caed.xml',
    name: 'E.D. CALIFORNIA',
    color: '#84cc16',
    category: 'JUDICIAL'
  },
  {
    id: 'cand',
    url: 'https://www.govinfo.gov/rss/uscourts-cand.xml',
    name: 'N.D. CALIFORNIA',
    color: '#a3e635',
    category: 'JUDICIAL'
  },
  {
    id: 'casd',
    url: 'https://www.govinfo.gov/rss/uscourts-casd.xml',
    name: 'S.D. CALIFORNIA',
    color: '#bef264',
    category: 'JUDICIAL'
  },
  {
    id: 'cod',
    url: 'https://www.govinfo.gov/rss/uscourts-cod.xml',
    name: 'D. COLORADO',
    color: '#eab308',
    category: 'JUDICIAL'
  },
  {
    id: 'ctd',
    url: 'https://www.govinfo.gov/rss/uscourts-ctd.xml',
    name: 'D. CONNECTICUT',
    color: '#facc15',
    category: 'JUDICIAL'
  },
  {
    id: 'ded',
    url: 'https://www.govinfo.gov/rss/uscourts-ded.xml',
    name: 'D. DELAWARE',
    color: '#fde047',
    category: 'JUDICIAL'
  },
  {
    id: 'dcd',
    url: 'https://www.govinfo.gov/rss/uscourts-dcd.xml',
    name: 'D. COLUMBIA',
    color: '#f59e0b',
    category: 'JUDICIAL'
  },
  {
    id: 'flnd',
    url: 'https://www.govinfo.gov/rss/uscourts-flnd.xml',
    name: 'N.D. FLORIDA',
    color: '#fbbf24',
    category: 'JUDICIAL'
  },
  {
    id: 'flsd',
    url: 'https://www.govinfo.gov/rss/uscourts-flsd.xml',
    name: 'S.D. FLORIDA',
    color: '#fcd34d',
    category: 'JUDICIAL'
  },
  {
    id: 'gamd',
    url: 'https://www.govinfo.gov/rss/uscourts-gamd.xml',
    name: 'M.D. GEORGIA',
    color: '#f97316',
    category: 'JUDICIAL'
  },
  {
    id: 'gand',
    url: 'https://www.govinfo.gov/rss/uscourts-gand.xml',
    name: 'N.D. GEORGIA',
    color: '#fb923c',
    category: 'JUDICIAL'
  },
  {
    id: 'gud',
    url: 'https://www.govinfo.gov/rss/uscourts-gud.xml',
    name: 'D. GUAM',
    color: '#fdba74',
    category: 'JUDICIAL'
  },
  {
    id: 'hid',
    url: 'https://www.govinfo.gov/rss/uscourts-hid.xml',
    name: 'D. HAWAII',
    color: '#ef4444',
    category: 'JUDICIAL'
  },
  {
    id: 'idd',
    url: 'https://www.govinfo.gov/rss/uscourts-idd.xml',
    name: 'D. IDAHO',
    color: '#f87171',
    category: 'JUDICIAL'
  },
  {
    id: 'ilnd',
    url: 'https://www.govinfo.gov/rss/uscourts-ilnd.xml',
    name: 'N.D. ILLINOIS',
    color: '#fca5a5',
    category: 'JUDICIAL'
  },
  {
    id: 'ilsd',
    url: 'https://www.govinfo.gov/rss/uscourts-ilsd.xml',
    name: 'S.D. ILLINOIS',
    color: '#dc2626',
    category: 'JUDICIAL'
  },
  {
    id: 'insd',
    url: 'https://www.govinfo.gov/rss/uscourts-insd.xml',
    name: 'S.D. INDIANA',
    color: '#b91c1c',
    category: 'JUDICIAL'
  },
  {
    id: 'iand',
    url: 'https://www.govinfo.gov/rss/uscourts-iand.xml',
    name: 'N.D. IOWA',
    color: '#ec4899',
    category: 'JUDICIAL'
  },
  {
    id: 'ksd',
    url: 'https://www.govinfo.gov/rss/uscourts-ksd.xml',
    name: 'D. KANSAS',
    color: '#f472b6',
    category: 'JUDICIAL'
  },
  {
    id: 'kyed',
    url: 'https://www.govinfo.gov/rss/uscourts-kyed.xml',
    name: 'E.D. KENTUCKY',
    color: '#f9a8d4',
    category: 'JUDICIAL'
  },
  {
    id: 'kywd',
    url: 'https://www.govinfo.gov/rss/uscourts-kywd.xml',
    name: 'W.D. KENTUCKY',
    color: '#db2777',
    category: 'JUDICIAL'
  },
  {
    id: 'laed',
    url: 'https://www.govinfo.gov/rss/uscourts-laed.xml',
    name: 'E.D. LOUISIANA',
    color: '#be185d',
    category: 'JUDICIAL'
  },
  {
    id: 'lamd',
    url: 'https://www.govinfo.gov/rss/uscourts-lamd.xml',
    name: 'M.D. LOUISIANA',
    color: '#a855f7',
    category: 'JUDICIAL'
  },
  {
    id: 'med',
    url: 'https://www.govinfo.gov/rss/uscourts-med.xml',
    name: 'D. MAINE',
    color: '#c084fc',
    category: 'JUDICIAL'
  },
  {
    id: 'mdd',
    url: 'https://www.govinfo.gov/rss/uscourts-mdd.xml',
    name: 'D. MARYLAND',
    color: '#d8b4fe',
    category: 'JUDICIAL'
  },
  {
    id: 'mad',
    url: 'https://www.govinfo.gov/rss/uscourts-mad.xml',
    name: 'D. MASSACHUSETTS',
    color: '#9333ea',
    category: 'JUDICIAL'
  },
  {
    id: 'mied',
    url: 'https://www.govinfo.gov/rss/uscourts-mied.xml',
    name: 'E.D. MICHIGAN',
    color: '#7e22ce',
    category: 'JUDICIAL'
  },
  {
    id: 'miwd',
    url: 'https://www.govinfo.gov/rss/uscourts-miwd.xml',
    name: 'W.D. MICHIGAN',
    color: '#6b21a8',
    category: 'JUDICIAL'
  },
  {
    id: 'mnd',
    url: 'https://www.govinfo.gov/rss/uscourts-mnd.xml',
    name: 'D. MINNESOTA',
    color: '#7c3aed',
    category: 'JUDICIAL'
  },
  {
    id: 'moed',
    url: 'https://www.govinfo.gov/rss/uscourts-moed.xml',
    name: 'E.D. MISSOURI',
    color: '#8b5cf6',
    category: 'JUDICIAL'
  },
  {
    id: 'mowd',
    url: 'https://www.govinfo.gov/rss/uscourts-mowd.xml',
    name: 'W.D. MISSOURI',
    color: '#a78bfa',
    category: 'JUDICIAL'
  },
  {
    id: 'mtd',
    url: 'https://www.govinfo.gov/rss/uscourts-mtd.xml',
    name: 'D. MONTANA',
    color: '#6366f1',
    category: 'JUDICIAL'
  },
  {
    id: 'ned',
    url: 'https://www.govinfo.gov/rss/uscourts-ned.xml',
    name: 'D. NEBRASKA',
    color: '#818cf8',
    category: 'JUDICIAL'
  },
  {
    id: 'nhd',
    url: 'https://www.govinfo.gov/rss/uscourts-nhd.xml',
    name: 'D. NEW HAMPSHIRE',
    color: '#a5b4fc',
    category: 'JUDICIAL'
  },
  {
    id: 'njd',
    url: 'https://www.govinfo.gov/rss/uscourts-njd.xml',
    name: 'D. NEW JERSEY',
    color: '#3b82f6',
    category: 'JUDICIAL'
  },
  {
    id: 'nmd',
    url: 'https://www.govinfo.gov/rss/uscourts-nmd.xml',
    name: 'D. NEW MEXICO',
    color: '#60a5fa',
    category: 'JUDICIAL'
  },
  {
    id: 'nyed',
    url: 'https://www.govinfo.gov/rss/uscourts-nyed.xml',
    name: 'E.D. NEW YORK',
    color: '#93c5fd',
    category: 'JUDICIAL'
  },
  {
    id: 'nynd',
    url: 'https://www.govinfo.gov/rss/uscourts-nynd.xml',
    name: 'N.D. NEW YORK',
    color: '#2563eb',
    category: 'JUDICIAL'
  },
  {
    id: 'ncmd',
    url: 'https://www.govinfo.gov/rss/uscourts-ncmd.xml',
    name: 'M.D. N. CAROLINA',
    color: '#1d4ed8',
    category: 'JUDICIAL'
  },
  {
    id: 'ncwd',
    url: 'https://www.govinfo.gov/rss/uscourts-ncwd.xml',
    name: 'W.D. N. CAROLINA',
    color: '#1e40af',
    category: 'JUDICIAL'
  },
  {
    id: 'ndd',
    url: 'https://www.govinfo.gov/rss/uscourts-ndd.xml',
    name: 'D. N. DAKOTA',
    color: '#0ea5e9',
    category: 'JUDICIAL'
  },
  {
    id: 'nmid',
    url: 'https://www.govinfo.gov/rss/uscourts-nmid.xml',
    name: 'D. N. MARIANA IS.',
    color: '#38bdf8',
    category: 'JUDICIAL'
  },
  {
    id: 'ohnd',
    url: 'https://www.govinfo.gov/rss/uscourts-ohnd.xml',
    name: 'N.D. OHIO',
    color: '#7dd3fc',
    category: 'JUDICIAL'
  },
  {
    id: 'ohsd',
    url: 'https://www.govinfo.gov/rss/uscourts-ohsd.xml',
    name: 'S.D. OHIO',
    color: '#0284c7',
    category: 'JUDICIAL'
  },
  {
    id: 'oked',
    url: 'https://www.govinfo.gov/rss/uscourts-oked.xml',
    name: 'E.D. OKLAHOMA',
    color: '#0369a1',
    category: 'JUDICIAL'
  },
  {
    id: 'okwd',
    url: 'https://www.govinfo.gov/rss/uscourts-okwd.xml',
    name: 'W.D. OKLAHOMA',
    color: '#075985',
    category: 'JUDICIAL'
  },
  {
    id: 'ord',
    url: 'https://www.govinfo.gov/rss/uscourts-ord.xml',
    name: 'D. OREGON',
    color: '#06b6d4',
    category: 'JUDICIAL'
  },
  {
    id: 'paed',
    url: 'https://www.govinfo.gov/rss/uscourts-paed.xml',
    name: 'E.D. PENNSYLVANIA',
    color: '#22d3ee',
    category: 'JUDICIAL'
  },
  {
    id: 'pamd',
    url: 'https://www.govinfo.gov/rss/uscourts-pamd.xml',
    name: 'M.D. PENNSYLVANIA',
    color: '#67e8f9',
    category: 'JUDICIAL'
  },
  {
    id: 'pawd',
    url: 'https://www.govinfo.gov/rss/uscourts-pawd.xml',
    name: 'W.D. PENNSYLVANIA',
    color: '#0891b2',
    category: 'JUDICIAL'
  },
  {
    id: 'prd',
    url: 'https://www.govinfo.gov/rss/uscourts-prd.xml',
    name: 'D. PUERTO RICO',
    color: '#0e7490',
    category: 'JUDICIAL'
  },
  {
    id: 'rid',
    url: 'https://www.govinfo.gov/rss/uscourts-rid.xml',
    name: 'D. RHODE ISLAND',
    color: '#155e75',
    category: 'JUDICIAL'
  },
  {
    id: 'sdd',
    url: 'https://www.govinfo.gov/rss/uscourts-sdd.xml',
    name: 'D. S. DAKOTA',
    color: '#14b8a6',
    category: 'JUDICIAL'
  },
  {
    id: 'tned',
    url: 'https://www.govinfo.gov/rss/uscourts-tned.xml',
    name: 'E.D. TENNESSEE',
    color: '#2dd4bf',
    category: 'JUDICIAL'
  },
  {
    id: 'tnmd',
    url: 'https://www.govinfo.gov/rss/uscourts-tnmd.xml',
    name: 'M.D. TENNESSEE',
    color: '#5eead4',
    category: 'JUDICIAL'
  },
  {
    id: 'tnwd',
    url: 'https://www.govinfo.gov/rss/uscourts-tnwd.xml',
    name: 'W.D. TENNESSEE',
    color: '#0d9488',
    category: 'JUDICIAL'
  },
  {
    id: 'txed',
    url: 'https://www.govinfo.gov/rss/uscourts-txed.xml',
    name: 'E.D. TEXAS',
    color: '#0f766e',
    category: 'JUDICIAL'
  },
  {
    id: 'txnd',
    url: 'https://www.govinfo.gov/rss/uscourts-txnd.xml',
    name: 'N.D. TEXAS',
    color: '#115e59',
    category: 'JUDICIAL'
  },
  {
    id: 'txsd',
    url: 'https://www.govinfo.gov/rss/uscourts-txsd.xml',
    name: 'S.D. TEXAS',
    color: '#10b981',
    category: 'JUDICIAL'
  },
  {
    id: 'txwd',
    url: 'https://www.govinfo.gov/rss/uscourts-txwd.xml',
    name: 'W.D. TEXAS',
    color: '#34d399',
    category: 'JUDICIAL'
  },
  {
    id: 'utd',
    url: 'https://www.govinfo.gov/rss/uscourts-utd.xml',
    name: 'D. UTAH',
    color: '#6ee7b7',
    category: 'JUDICIAL'
  },
  {
    id: 'vtd',
    url: 'https://www.govinfo.gov/rss/uscourts-vtd.xml',
    name: 'D. VERMONT',
    color: '#059669',
    category: 'JUDICIAL'
  },
  {
    id: 'vid',
    url: 'https://www.govinfo.gov/rss/uscourts-vid.xml',
    name: 'D. VIRGIN ISLANDS',
    color: '#047857',
    category: 'JUDICIAL'
  },
  {
    id: 'waed',
    url: 'https://www.govinfo.gov/rss/uscourts-waed.xml',
    name: 'E.D. WASHINGTON',
    color: '#065f46',
    category: 'JUDICIAL'
  },
  {
    id: 'wvnd',
    url: 'https://www.govinfo.gov/rss/uscourts-wvnd.xml',
    name: 'N.D. W. VIRGINIA',
    color: '#84cc16',
    category: 'JUDICIAL'
  },
  {
    id: 'wiwd',
    url: 'https://www.govinfo.gov/rss/uscourts-wiwd.xml',
    name: 'W.D. WISCONSIN',
    color: '#a3e635',
    category: 'JUDICIAL'
  },
  {
    id: 'wyd',
    url: 'https://www.govinfo.gov/rss/uscourts-wyd.xml',
    name: 'D. WYOMING',
    color: '#bef264',
    category: 'JUDICIAL'
  },

  // Judicial Feeds - Bankruptcy Courts
  {
    id: 'almb',
    url: 'https://www.govinfo.gov/rss/uscourts-almb.xml',
    name: 'BANKR. M.D. AL',
    color: '#7c3aed',
    category: 'JUDICIAL'
  },
  {
    id: 'alnb',
    url: 'https://www.govinfo.gov/rss/uscourts-alnb.xml',
    name: 'BANKR. N.D. AL',
    color: '#8b5cf6',
    category: 'JUDICIAL'
  },
  {
    id: 'alsb',
    url: 'https://www.govinfo.gov/rss/uscourts-alsb.xml',
    name: 'BANKR. S.D. AL',
    color: '#a78bfa',
    category: 'JUDICIAL'
  },
  {
    id: 'akb',
    url: 'https://www.govinfo.gov/rss/uscourts-akb.xml',
    name: 'BANKR. D. AK',
    color: '#c4b5fd',
    category: 'JUDICIAL'
  },
  {
    id: 'areb',
    url: 'https://www.govinfo.gov/rss/uscourts-areb.xml',
    name: 'BANKR. E.D. AR',
    color: '#6366f1',
    category: 'JUDICIAL'
  },
  {
    id: 'arwb',
    url: 'https://www.govinfo.gov/rss/uscourts-arwb.xml',
    name: 'BANKR. W.D. AR',
    color: '#818cf8',
    category: 'JUDICIAL'
  },
  {
    id: 'azb',
    url: 'https://www.govinfo.gov/rss/uscourts-azb.xml',
    name: 'BANKR. D. AZ',
    color: '#a5b4fc',
    category: 'JUDICIAL'
  },
  {
    id: 'caeb',
    url: 'https://www.govinfo.gov/rss/uscourts-caeb.xml',
    name: 'BANKR. E.D. CA',
    color: '#3b82f6',
    category: 'JUDICIAL'
  },
  {
    id: 'canb',
    url: 'https://www.govinfo.gov/rss/uscourts-canb.xml',
    name: 'BANKR. N.D. CA',
    color: '#60a5fa',
    category: 'JUDICIAL'
  },
  {
    id: 'cacb',
    url: 'https://www.govinfo.gov/rss/uscourts-cacb.xml',
    name: 'BANKR. C.D. CA',
    color: '#93c5fd',
    category: 'JUDICIAL'
  },
  {
    id: 'cob',
    url: 'https://www.govinfo.gov/rss/uscourts-cob.xml',
    name: 'BANKR. D. CO',
    color: '#2563eb',
    category: 'JUDICIAL'
  },
  {
    id: 'dcb',
    url: 'https://www.govinfo.gov/rss/uscourts-dcb.xml',
    name: 'BANKR. D. DC',
    color: '#1d4ed8',
    category: 'JUDICIAL'
  },
  {
    id: 'ctb',
    url: 'https://www.govinfo.gov/rss/uscourts-ctb.xml',
    name: 'BANKR. D. CT',
    color: '#1e40af',
    category: 'JUDICIAL'
  },
  {
    id: 'deb',
    url: 'https://www.govinfo.gov/rss/uscourts-deb.xml',
    name: 'BANKR. D. DE',
    color: '#0ea5e9',
    category: 'JUDICIAL'
  },
  {
    id: 'flsb',
    url: 'https://www.govinfo.gov/rss/uscourts-flsb.xml',
    name: 'BANKR. S.D. FL',
    color: '#38bdf8',
    category: 'JUDICIAL'
  },
  {
    id: 'flmb',
    url: 'https://www.govinfo.gov/rss/uscourts-flmb.xml',
    name: 'BANKR. M.D. FL',
    color: '#7dd3fc',
    category: 'JUDICIAL'
  },
  {
    id: 'ganb',
    url: 'https://www.govinfo.gov/rss/uscourts-ganb.xml',
    name: 'BANKR. N.D. GA',
    color: '#0284c7',
    category: 'JUDICIAL'
  },
  {
    id: 'gamb',
    url: 'https://www.govinfo.gov/rss/uscourts-gamb.xml',
    name: 'BANKR. M.D. GA',
    color: '#0369a1',
    category: 'JUDICIAL'
  },
  {
    id: 'hib',
    url: 'https://www.govinfo.gov/rss/uscourts-hib.xml',
    name: 'BANKR. D. HI',
    color: '#075985',
    category: 'JUDICIAL'
  },
  {
    id: 'ilnb',
    url: 'https://www.govinfo.gov/rss/uscourts-ilnb.xml',
    name: 'BANKR. N.D. IL',
    color: '#06b6d4',
    category: 'JUDICIAL'
  },
  {
    id: 'ilsb',
    url: 'https://www.govinfo.gov/rss/uscourts-ilsb.xml',
    name: 'BANKR. S.D. IL',
    color: '#22d3ee',
    category: 'JUDICIAL'
  },
  {
    id: 'ilcb',
    url: 'https://www.govinfo.gov/rss/uscourts-ilcb.xml',
    name: 'BANKR. C.D. IL',
    color: '#67e8f9',
    category: 'JUDICIAL'
  },
  {
    id: 'insb',
    url: 'https://www.govinfo.gov/rss/uscourts-insb.xml',
    name: 'BANKR. S.D. IN',
    color: '#0891b2',
    category: 'JUDICIAL'
  },
  {
    id: 'ianb',
    url: 'https://www.govinfo.gov/rss/uscourts-ianb.xml',
    name: 'BANKR. N.D. IA',
    color: '#0e7490',
    category: 'JUDICIAL'
  },
  {
    id: 'kyeb',
    url: 'https://www.govinfo.gov/rss/uscourts-kyeb.xml',
    name: 'BANKR. E.D. KY',
    color: '#155e75',
    category: 'JUDICIAL'
  },
  {
    id: 'kywb',
    url: 'https://www.govinfo.gov/rss/uscourts-kywb.xml',
    name: 'BANKR. W.D. KY',
    color: '#14b8a6',
    category: 'JUDICIAL'
  },
  {
    id: 'laeb',
    url: 'https://www.govinfo.gov/rss/uscourts-laeb.xml',
    name: 'BANKR. E.D. LA',
    color: '#2dd4bf',
    category: 'JUDICIAL'
  },
  {
    id: 'lawb',
    url: 'https://www.govinfo.gov/rss/uscourts-lawb.xml',
    name: 'BANKR. W.D. LA',
    color: '#5eead4',
    category: 'JUDICIAL'
  },
  {
    id: 'lamb',
    url: 'https://www.govinfo.gov/rss/uscourts-lamb.xml',
    name: 'BANKR. M.D. LA',
    color: '#0d9488',
    category: 'JUDICIAL'
  },
  {
    id: 'meb',
    url: 'https://www.govinfo.gov/rss/uscourts-meb.xml',
    name: 'BANKR. D. ME',
    color: '#0f766e',
    category: 'JUDICIAL'
  },
  {
    id: 'mdb',
    url: 'https://www.govinfo.gov/rss/uscourts-mdb.xml',
    name: 'BANKR. D. MD',
    color: '#115e59',
    category: 'JUDICIAL'
  },
  {
    id: 'mab',
    url: 'https://www.govinfo.gov/rss/uscourts-mab.xml',
    name: 'BANKR. D. MA',
    color: '#10b981',
    category: 'JUDICIAL'
  },
  {
    id: 'miwb',
    url: 'https://www.govinfo.gov/rss/uscourts-miwb.xml',
    name: 'BANKR. W.D. MI',
    color: '#34d399',
    category: 'JUDICIAL'
  },
  {
    id: 'mnb',
    url: 'https://www.govinfo.gov/rss/uscourts-mnb.xml',
    name: 'BANKR. D. MN',
    color: '#6ee7b7',
    category: 'JUDICIAL'
  },
  {
    id: 'msnb',
    url: 'https://www.govinfo.gov/rss/uscourts-msnb.xml',
    name: 'BANKR. N.D. MS',
    color: '#059669',
    category: 'JUDICIAL'
  },
  {
    id: 'moeb',
    url: 'https://www.govinfo.gov/rss/uscourts-moeb.xml',
    name: 'BANKR. E.D. MO',
    color: '#047857',
    category: 'JUDICIAL'
  },
  {
    id: 'mowb',
    url: 'https://www.govinfo.gov/rss/uscourts-mowb.xml',
    name: 'BANKR. W.D. MO',
    color: '#065f46',
    category: 'JUDICIAL'
  },
  {
    id: 'mtb',
    url: 'https://www.govinfo.gov/rss/uscourts-mtb.xml',
    name: 'BANKR. D. MT',
    color: '#84cc16',
    category: 'JUDICIAL'
  },
  {
    id: 'neb',
    url: 'https://www.govinfo.gov/rss/uscourts-neb.xml',
    name: 'BANKR. D. NE',
    color: '#a3e635',
    category: 'JUDICIAL'
  },
  {
    id: 'nvb',
    url: 'https://www.govinfo.gov/rss/uscourts-nvb.xml',
    name: 'BANKR. D. NV',
    color: '#bef264',
    category: 'JUDICIAL'
  },
  {
    id: 'nhb',
    url: 'https://www.govinfo.gov/rss/uscourts-nhb.xml',
    name: 'BANKR. D. NH',
    color: '#65a30d',
    category: 'JUDICIAL'
  },
  {
    id: 'njb',
    url: 'https://www.govinfo.gov/rss/uscourts-njb.xml',
    name: 'BANKR. D. NJ',
    color: '#4d7c0f',
    category: 'JUDICIAL'
  },
  {
    id: 'nmb',
    url: 'https://www.govinfo.gov/rss/uscourts-nmb.xml',
    name: 'BANKR. D. NM',
    color: '#3f6212',
    category: 'JUDICIAL'
  },
  {
    id: 'nyeb',
    url: 'https://www.govinfo.gov/rss/uscourts-nyeb.xml',
    name: 'BANKR. E.D. NY',
    color: '#eab308',
    category: 'JUDICIAL'
  },
  {
    id: 'nynb',
    url: 'https://www.govinfo.gov/rss/uscourts-nynb.xml',
    name: 'BANKR. N.D. NY',
    color: '#facc15',
    category: 'JUDICIAL'
  },
  {
    id: 'nysb',
    url: 'https://www.govinfo.gov/rss/uscourts-nysb.xml',
    name: 'BANKR. S.D. NY',
    color: '#fde047',
    category: 'JUDICIAL'
  },
  {
    id: 'nywb',
    url: 'https://www.govinfo.gov/rss/uscourts-nywb.xml',
    name: 'BANKR. W.D. NY',
    color: '#ca8a04',
    category: 'JUDICIAL'
  },
  {
    id: 'nceb',
    url: 'https://www.govinfo.gov/rss/uscourts-nceb.xml',
    name: 'BANKR. E.D. NC',
    color: '#a16207',
    category: 'JUDICIAL'
  },
  {
    id: 'ncwb',
    url: 'https://www.govinfo.gov/rss/uscourts-ncwb.xml',
    name: 'BANKR. W.D. NC',
    color: '#854d0e',
    category: 'JUDICIAL'
  },
  {
    id: 'ndb',
    url: 'https://www.govinfo.gov/rss/uscourts-ndb.xml',
    name: 'BANKR. D. ND',
    color: '#f59e0b',
    category: 'JUDICIAL'
  },
  {
    id: 'ohnb',
    url: 'https://www.govinfo.gov/rss/uscourts-ohnb.xml',
    name: 'BANKR. N.D. OH',
    color: '#fbbf24',
    category: 'JUDICIAL'
  },
  {
    id: 'ohsb',
    url: 'https://www.govinfo.gov/rss/uscourts-ohsb.xml',
    name: 'BANKR. S.D. OH',
    color: '#fcd34d',
    category: 'JUDICIAL'
  },
  {
    id: 'okeb',
    url: 'https://www.govinfo.gov/rss/uscourts-okeb.xml',
    name: 'BANKR. E.D. OK',
    color: '#d97706',
    category: 'JUDICIAL'
  },
  {
    id: 'oknb',
    url: 'https://www.govinfo.gov/rss/uscourts-oknb.xml',
    name: 'BANKR. N.D. OK',
    color: '#b45309',
    category: 'JUDICIAL'
  },
  {
    id: 'okwb',
    url: 'https://www.govinfo.gov/rss/uscourts-okwb.xml',
    name: 'BANKR. W.D. OK',
    color: '#92400e',
    category: 'JUDICIAL'
  },
  {
    id: 'orb',
    url: 'https://www.govinfo.gov/rss/uscourts-orb.xml',
    name: 'BANKR. D. OR',
    color: '#f97316',
    category: 'JUDICIAL'
  },
  {
    id: 'paeb',
    url: 'https://www.govinfo.gov/rss/uscourts-paeb.xml',
    name: 'BANKR. E.D. PA',
    color: '#fb923c',
    category: 'JUDICIAL'
  },
  {
    id: 'pamb',
    url: 'https://www.govinfo.gov/rss/uscourts-pamb.xml',
    name: 'BANKR. M.D. PA',
    color: '#fdba74',
    category: 'JUDICIAL'
  },
  {
    id: 'pawb',
    url: 'https://www.govinfo.gov/rss/uscourts-pawb.xml',
    name: 'BANKR. W.D. PA',
    color: '#ea580c',
    category: 'JUDICIAL'
  },
  {
    id: 'prb',
    url: 'https://www.govinfo.gov/rss/uscourts-prb.xml',
    name: 'BANKR. D. PR',
    color: '#c2410c',
    category: 'JUDICIAL'
  },
  {
    id: 'rib',
    url: 'https://www.govinfo.gov/rss/uscourts-rib.xml',
    name: 'BANKR. D. RI',
    color: '#9a3412',
    category: 'JUDICIAL'
  },
  {
    id: 'scb',
    url: 'https://www.govinfo.gov/rss/uscourts-scb.xml',
    name: 'BANKR. D. SC',
    color: '#ef4444',
    category: 'JUDICIAL'
  },
  {
    id: 'sdb',
    url: 'https://www.govinfo.gov/rss/uscourts-sdb.xml',
    name: 'BANKR. D. SD',
    color: '#f87171',
    category: 'JUDICIAL'
  },
  {
    id: 'tneb',
    url: 'https://www.govinfo.gov/rss/uscourts-tneb.xml',
    name: 'BANKR. E.D. TN',
    color: '#fca5a5',
    category: 'JUDICIAL'
  },
  {
    id: 'tnmb',
    url: 'https://www.govinfo.gov/rss/uscourts-tnmb.xml',
    name: 'BANKR. M.D. TN',
    color: '#dc2626',
    category: 'JUDICIAL'
  },
  {
    id: 'txsb',
    url: 'https://www.govinfo.gov/rss/uscourts-txsb.xml',
    name: 'BANKR. S.D. TX',
    color: '#b91c1c',
    category: 'JUDICIAL'
  },
  {
    id: 'txwb',
    url: 'https://www.govinfo.gov/rss/uscourts-txwb.xml',
    name: 'BANKR. W.D. TX',
    color: '#991b1b',
    category: 'JUDICIAL'
  },
  {
    id: 'vawb',
    url: 'https://www.govinfo.gov/rss/uscourts-vawb.xml',
    name: 'BANKR. W.D. VA',
    color: '#ec4899',
    category: 'JUDICIAL'
  },
  {
    id: 'vib',
    url: 'https://www.govinfo.gov/rss/uscourts-vib.xml',
    name: 'BANKR. D. VI',
    color: '#f472b6',
    category: 'JUDICIAL'
  },
  {
    id: 'waeb',
    url: 'https://www.govinfo.gov/rss/uscourts-waeb.xml',
    name: 'BANKR. E.D. WA',
    color: '#f9a8d4',
    category: 'JUDICIAL'
  },
  {
    id: 'wawb',
    url: 'https://www.govinfo.gov/rss/uscourts-wawb.xml',
    name: 'BANKR. W.D. WA',
    color: '#db2777',
    category: 'JUDICIAL'
  },
  {
    id: 'wvnb',
    url: 'https://www.govinfo.gov/rss/uscourts-wvnb.xml',
    name: 'BANKR. N.D. WV',
    color: '#be185d',
    category: 'JUDICIAL'
  },
  {
    id: 'wieb',
    url: 'https://www.govinfo.gov/rss/uscourts-wieb.xml',
    name: 'BANKR. E.D. WI',
    color: '#9d174d',
    category: 'JUDICIAL'
  },
  {
    id: 'wiwb',
    url: 'https://www.govinfo.gov/rss/uscourts-wiwb.xml',
    name: 'BANKR. W.D. WI',
    color: '#a855f7',
    category: 'JUDICIAL'
  },
  {
    id: 'wyb',
    url: 'https://www.govinfo.gov/rss/uscourts-wyb.xml',
    name: 'BANKR. D. WY',
    color: '#c084fc',
    category: 'JUDICIAL'
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
  {
    id: 'wh-actions',
    url: 'https://www.whitehouse.gov/presidential-actions/feed/',
    name: 'PRESIDENTIAL ACTIONS',
    color: '#3b82f6',
    category: 'EXECUTIVE'
  },
  {
    id: 'presidential-docs',
    url: 'https://www.govinfo.gov/rss/dcpd.xml',
    name: 'PRESIDENTIAL DOCUMENTS',
    color: '#a855f7',
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
  // Note: CAP News feed no longer available
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
  
  // Treasury feeds via Federal Register (TreasuryDirect RSS discontinued)
  {
    id: 'treasury-fedreg',
    url: 'https://www.federalregister.gov/api/v1/documents.rss?conditions%5Bagencies%5D%5B%5D=treasury-department',
    name: 'FED REGISTER (TREASURY)',
    color: '#fbbf24',
    category: 'TREASURY'
  },
  {
    id: 'irs-fedreg',
    url: 'https://www.federalregister.gov/api/v1/documents.rss?conditions%5Bagencies%5D%5B%5D=internal-revenue-service',
    name: 'FED REGISTER (IRS)',
    color: '#f59e0b',
    category: 'TREASURY'
  },
  {
    id: 'gao-reports',
    url: 'https://www.gao.gov/rss/reports.xml',
    name: 'GAO REPORTS',
    color: '#8b5cf6',
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
    id: 'iaea-news',
    url: 'https://www.iaea.org/feeds/topnews',
    name: 'IAEA TOP NEWS',
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
  // Note: Fannie Mae no longer provides RSS feed
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
    url: 'https://www.realtor.com/news/feed/',
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
  {
    id: 'mex-newsdaily',
    url: 'https://mexiconewsdaily.com/feed/',
    name: 'MEXICO NEWS DAILY (EN)',
    color: '#1e3a5f',
    category: 'MEXICO'
  },
  {
    id: 'mex-newsdaily-biz',
    url: 'https://mexiconewsdaily.com/category/business/feed/',
    name: 'MND BUSINESS (EN)',
    color: '#2e5a8f',
    category: 'MEXICO'
  },
  {
    id: 'mex-newsdaily-politics',
    url: 'https://mexiconewsdaily.com/category/politics/feed/',
    name: 'MND POLITICS (EN)',
    color: '#4a7ab0',
    category: 'MEXICO'
  },
  {
    id: 'mex-vallarta',
    url: 'https://www.vallartadaily.com/feed/',
    name: 'VALLARTA DAILY (EN)',
    color: '#0077b6',
    category: 'MEXICO'
  },
  {
    id: 'mex-border',
    url: 'https://www.borderreport.com/feed/',
    name: 'BORDER REPORT (EN)',
    color: '#dc2626',
    category: 'MEXICO'
  },
  {
    id: 'mex-banxico-fx',
    url: 'https://www.banxico.org.mx/rsscb/rss?BMXC_canal=fix&BMXC_idioma=en',
    name: 'BANXICO FX RATE (EN)',
    color: '#006847',
    category: 'MEXICO'
  },
  {
    id: 'mex-banxico-rate',
    url: 'https://www.banxico.org.mx/rsscb/rss?BMXC_canal=tasObj&BMXC_idioma=en',
    name: 'BANXICO TARGET RATE (EN)',
    color: '#228b22',
    category: 'MEXICO'
  },
  {
    id: 'mex-banxico-reserves',
    url: 'https://www.banxico.org.mx/rsscb/rss?BMXC_canal=reserv&BMXC_idioma=en',
    name: 'BANXICO RESERVES (EN)',
    color: '#2e8b57',
    category: 'MEXICO'
  },
  // Mexico State Feeds (Spanish)
  {
    id: 'mex-milenio',
    url: 'https://www.milenio.com/rss',
    name: 'MILENIO',
    color: '#c41e3a',
    category: 'MEXICO'
  },
  {
    id: 'mex-excelsior',
    url: 'https://www.excelsior.com.mx/rss.xml',
    name: 'EXCELSIOR',
    color: '#1e3a8a',
    category: 'MEXICO'
  },
  {
    id: 'mex-yucatan',
    url: 'https://www.yucatan.com.mx/feed',
    name: 'DIARIO YUCATAN',
    color: '#f59e0b',
    category: 'MEXICO'
  },
  {
    id: 'mex-jalisco',
    url: 'https://www.informador.mx/rss/jalisco.xml',
    name: 'EL INFORMADOR (JAL)',
    color: '#10b981',
    category: 'MEXICO'
  },
  {
    id: 'mex-tabasco',
    url: 'https://www.tabascohoy.com/feed/',
    name: 'TABASCO HOY',
    color: '#8b5cf6',
    category: 'MEXICO'
  },
  {
    id: 'mex-queretaro',
    url: 'https://www.capitalqueretaro.com.mx/feed/',
    name: 'CAPITAL QUERETARO',
    color: '#ec4899',
    category: 'MEXICO'
  },
  {
    id: 'mex-edomex',
    url: 'https://8columnas.com.mx/feed/',
    name: '8 COLUMNAS (EDO MEX)',
    color: '#6366f1',
    category: 'MEXICO'
  },
  {
    id: 'mex-michoacan',
    url: 'https://www.lavozdemichoacan.com.mx/feed/',
    name: 'LA VOZ MICHOACAN',
    color: '#14b8a6',
    category: 'MEXICO'
  },
  {
    id: 'mex-quadratin',
    url: 'https://www.quadratin.com.mx/feed/',
    name: 'QUADRATIN',
    color: '#f97316',
    category: 'MEXICO'
  },
  {
    id: 'mex-elnorte',
    url: 'https://www.elnorte.com/rss/portada.xml',
    name: 'EL NORTE (NL)',
    color: '#be185d',
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
    id: 'fra-france24',
    url: 'https://www.france24.com/en/rss',
    name: 'FRANCE24 NEWS',
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
    id: 'fra-france24-biz',
    url: 'https://www.france24.com/en/business/rss',
    name: 'FRANCE24 BUSINESS',
    color: '#005a9c',
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
    url: 'https://rss.dw.com/rdf/rss-en-ger',
    name: 'DW GERMANY NEWS',
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

  // =============================================================================
  // MIDDLE EAST & NORTH AFRICA FEEDS
  // =============================================================================

  // Bahrain Feeds
  {
    id: 'bhr-cbb',
    url: 'https://www.cbb.gov.bh/rss/news',
    name: 'CBB (CENTRAL BANK)',
    color: '#ce1126',
    category: 'BAHRAIN'
  },
  {
    id: 'bhr-bna',
    url: 'https://www.bna.bh/en/rss',
    name: 'BNA NEWS AGENCY',
    color: '#ffffff',
    category: 'BAHRAIN'
  },

  // Iran Feeds
  {
    id: 'irn-cbi',
    url: 'https://www.cbi.ir/rss/en',
    name: 'CBI (CENTRAL BANK)',
    color: '#239f40',
    category: 'IRAN'
  },
  {
    id: 'irn-irna',
    url: 'https://en.irna.ir/rss',
    name: 'IRNA NEWS',
    color: '#da0000',
    category: 'IRAN'
  },
  {
    id: 'irn-presstv',
    url: 'https://www.presstv.ir/Rss',
    name: 'PRESS TV',
    color: '#009639',
    category: 'IRAN'
  },

  // Israel Feeds
  {
    id: 'isr-toi',
    url: 'https://www.timesofisrael.com/feed/',
    name: 'TIMES OF ISRAEL',
    color: '#0038b8',
    category: 'ISRAEL'
  },
  {
    id: 'isr-jpost',
    url: 'https://www.jpost.com/rss/rssfeedsfrontpage.aspx',
    name: 'JERUSALEM POST',
    color: '#003366',
    category: 'ISRAEL'
  },
  {
    id: 'isr-jpost',
    url: 'https://www.jpost.com/rss/rssfeedsheadlines.aspx',
    name: 'JERUSALEM POST',
    color: '#1a5276',
    category: 'ISRAEL'
  },
  {
    id: 'isr-timesofisrael',
    url: 'https://www.timesofisrael.com/feed/',
    name: 'TIMES OF ISRAEL',
    color: '#0055a4',
    category: 'ISRAEL'
  },

  // Jordan Feeds
  {
    id: 'jor-cbj',
    url: 'https://www.cbj.gov.jo/en/rss/news',
    name: 'CBJ (CENTRAL BANK)',
    color: '#007a3d',
    category: 'JORDAN'
  },
  {
    id: 'jor-petra',
    url: 'https://petra.gov.jo/en/rss',
    name: 'PETRA NEWS',
    color: '#ce1126',
    category: 'JORDAN'
  },

  // Kuwait Feeds
  {
    id: 'kwt-cbk',
    url: 'https://www.cbk.gov.kw/en/rss/news',
    name: 'CBK (CENTRAL BANK)',
    color: '#007a3d',
    category: 'KUWAIT'
  },
  {
    id: 'kwt-kuna',
    url: 'https://www.kuna.net.kw/RSS.aspx',
    name: 'KUNA NEWS',
    color: '#ce1126',
    category: 'KUWAIT'
  },

  // Morocco Feeds
  {
    id: 'mar-bkam',
    url: 'https://www.bkam.ma/en/rss/news',
    name: 'BANK AL-MAGHRIB',
    color: '#c1272d',
    category: 'MOROCCO'
  },
  {
    id: 'mar-map',
    url: 'https://www.mapnews.ma/en/rss',
    name: 'MAP NEWS',
    color: '#006233',
    category: 'MOROCCO'
  },

  // Oman Feeds
  {
    id: 'omn-cbo',
    url: 'https://www.cbo.gov.om/en/rss/news',
    name: 'CBO (CENTRAL BANK)',
    color: '#ce1126',
    category: 'OMAN'
  },
  {
    id: 'omn-ona',
    url: 'https://omannews.gov.om/rss/en',
    name: 'ONA NEWS',
    color: '#008000',
    category: 'OMAN'
  },

  // Qatar Feeds
  {
    id: 'qat-qcb',
    url: 'https://www.qcb.gov.qa/en/rss/news',
    name: 'QCB (CENTRAL BANK)',
    color: '#8d1b3d',
    category: 'QATAR'
  },
  {
    id: 'qat-aljazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    name: 'AL JAZEERA',
    color: '#fa9000',
    category: 'QATAR'
  },
  {
    id: 'qat-gulf-times',
    url: 'https://www.gulf-times.com/rss',
    name: 'GULF TIMES',
    color: '#003366',
    category: 'QATAR'
  },

  // Saudi Arabia Feeds
  {
    id: 'sau-sama',
    url: 'https://www.sama.gov.sa/en-US/rss/news',
    name: 'SAMA (CENTRAL BANK)',
    color: '#006c35',
    category: 'SAUDI_ARABIA'
  },
  {
    id: 'sau-spa',
    url: 'https://www.spa.gov.sa/rss/allnews.php',
    name: 'SPA NEWS',
    color: '#006c35',
    category: 'SAUDI_ARABIA'
  },
  {
    id: 'sau-arabnews',
    url: 'https://www.arabnews.com/rss.xml',
    name: 'ARAB NEWS',
    color: '#1a5276',
    category: 'SAUDI_ARABIA'
  },

  // Tunisia Feeds
  {
    id: 'tun-bct',
    url: 'https://www.bct.gov.tn/bct/siteprod/rss.jsp',
    name: 'BCT (CENTRAL BANK)',
    color: '#e70013',
    category: 'TUNISIA'
  },
  {
    id: 'tun-tap',
    url: 'https://www.tap.info.tn/en/rss',
    name: 'TAP NEWS',
    color: '#e70013',
    category: 'TUNISIA'
  },

  // UAE Feeds
  {
    id: 'are-cbuae',
    url: 'https://www.centralbank.ae/en/rss/news',
    name: 'CBUAE (CENTRAL BANK)',
    color: '#00732f',
    category: 'UAE'
  },
  {
    id: 'are-wam',
    url: 'https://www.wam.ae/en/rss/all',
    name: 'WAM NEWS',
    color: '#ef3340',
    category: 'UAE'
  },
  {
    id: 'are-national',
    url: 'https://www.thenationalnews.com/arc/outboundfeeds/rss/',
    name: 'THE NATIONAL',
    color: '#003366',
    category: 'UAE'
  },
  {
    id: 'are-gulfnews',
    url: 'https://gulfnews.com/rss',
    name: 'GULF NEWS',
    color: '#1a5276',
    category: 'UAE'
  },

  // =============================================================================
  // ADDITIONAL AFRICA FEEDS
  // =============================================================================

  // Burkina Faso Feeds
  {
    id: 'bfa-bceao',
    url: 'https://www.bceao.int/en/rss/news',
    name: 'BCEAO (CENTRAL BANK)',
    color: '#009e49',
    category: 'BURKINA_FASO'
  },
  {
    id: 'bfa-aib',
    url: 'https://www.aib.media/feed/',
    name: 'AIB NEWS',
    color: '#ef2b2d',
    category: 'BURKINA_FASO'
  },

  // Ghana Feeds
  {
    id: 'gha-bog',
    url: 'https://www.bog.gov.gh/rss/news',
    name: 'BANK OF GHANA',
    color: '#006b3f',
    category: 'GHANA'
  },
  {
    id: 'gha-gna',
    url: 'https://www.gna.org.gh/feed/',
    name: 'GNA NEWS',
    color: '#fcd116',
    category: 'GHANA'
  },
  {
    id: 'gha-myjoyonline',
    url: 'https://www.myjoyonline.com/feed/',
    name: 'JOY NEWS',
    color: '#ce1126',
    category: 'GHANA'
  },

  // Mauritius Feeds
  {
    id: 'mus-bom',
    url: 'https://www.bom.mu/rss/news',
    name: 'BANK OF MAURITIUS',
    color: '#00a651',
    category: 'MAURITIUS'
  },
  {
    id: 'mus-lexpress',
    url: 'https://www.lexpress.mu/feed',
    name: 'L\'EXPRESS MU',
    color: '#1a5276',
    category: 'MAURITIUS'
  },

  // Namibia Feeds
  {
    id: 'nam-bon',
    url: 'https://www.bon.com.na/rss/news',
    name: 'BANK OF NAMIBIA',
    color: '#003580',
    category: 'NAMIBIA'
  },
  {
    id: 'nam-namibian',
    url: 'https://www.namibian.com.na/rss',
    name: 'THE NAMIBIAN',
    color: '#009639',
    category: 'NAMIBIA'
  },

  // Tanzania Feeds
  {
    id: 'tza-bot',
    url: 'https://www.bot.go.tz/rss/news',
    name: 'BANK OF TANZANIA',
    color: '#00a3dd',
    category: 'TANZANIA'
  },
  {
    id: 'tza-dailynews',
    url: 'https://dailynews.co.tz/feed/',
    name: 'DAILY NEWS TZ',
    color: '#1eb53a',
    category: 'TANZANIA'
  },

  // =============================================================================
  // ADDITIONAL ASIA FEEDS
  // =============================================================================

  // Azerbaijan Feeds
  {
    id: 'aze-cbar',
    url: 'https://www.cbar.az/rss/news',
    name: 'CBAR (CENTRAL BANK)',
    color: '#00b5e2',
    category: 'AZERBAIJAN'
  },
  {
    id: 'aze-azertag',
    url: 'https://azertag.az/rss/en',
    name: 'AZERTAG',
    color: '#3f9c35',
    category: 'AZERBAIJAN'
  },

  // Bangladesh Feeds
  {
    id: 'bgd-bb',
    url: 'https://www.bb.org.bd/rss/news',
    name: 'BANGLADESH BANK',
    color: '#006a4e',
    category: 'BANGLADESH'
  },
  {
    id: 'bgd-bss',
    url: 'https://www.bssnews.net/rss',
    name: 'BSS NEWS',
    color: '#f42a41',
    category: 'BANGLADESH'
  },
  {
    id: 'bgd-dhakatribune',
    url: 'https://www.dhakatribune.com/feed',
    name: 'DHAKA TRIBUNE',
    color: '#003366',
    category: 'BANGLADESH'
  },

  // India Feeds
  {
    id: 'ind-rbi',
    url: 'https://www.rbi.org.in/pressreleases_rss.xml',
    name: 'RBI (CENTRAL BANK)',
    color: '#ff9933',
    category: 'INDIA'
  },
  {
    id: 'ind-toi',
    url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    name: 'TIMES OF INDIA',
    color: '#dc143c',
    category: 'INDIA'
  },
  {
    id: 'ind-hindu',
    url: 'https://www.thehindu.com/news/national/feeder/default.rss',
    name: 'THE HINDU',
    color: '#003366',
    category: 'INDIA'
  },
  {
    id: 'ind-economictimes',
    url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
    name: 'ECONOMIC TIMES',
    color: '#f59e0b',
    category: 'INDIA'
  },

  // Indonesia Feeds
  {
    id: 'idn-bi',
    url: 'https://www.bi.go.id/en/rss/news.xml',
    name: 'BANK INDONESIA',
    color: '#ce1126',
    category: 'INDONESIA'
  },
  {
    id: 'idn-antara',
    url: 'https://en.antaranews.com/rss/news.xml',
    name: 'ANTARA NEWS',
    color: '#ffffff',
    category: 'INDONESIA'
  },
  {
    id: 'idn-jakartapost',
    url: 'https://www.thejakartapost.com/feed',
    name: 'JAKARTA POST',
    color: '#003366',
    category: 'INDONESIA'
  },

  // Kazakhstan Feeds
  {
    id: 'kaz-nbk',
    url: 'https://nationalbank.kz/en/rss/news',
    name: 'NBK (CENTRAL BANK)',
    color: '#00afca',
    category: 'KAZAKHSTAN'
  },
  {
    id: 'kaz-inform',
    url: 'https://www.inform.kz/en/rss',
    name: 'KAZINFORM',
    color: '#ffc61e',
    category: 'KAZAKHSTAN'
  },

  // Kyrgyzstan Feeds
  {
    id: 'kgz-nbkr',
    url: 'https://www.nbkr.kg/rss/news',
    name: 'NBKR (CENTRAL BANK)',
    color: '#e8112d',
    category: 'KYRGYZSTAN'
  },
  {
    id: 'kgz-kabar',
    url: 'https://kabar.kg/eng/rss',
    name: 'KABAR NEWS',
    color: '#ffd200',
    category: 'KYRGYZSTAN'
  },

  // Malaysia Feeds
  {
    id: 'mys-bnm',
    url: 'https://www.bnm.gov.my/rss/news',
    name: 'BNM (CENTRAL BANK)',
    color: '#010066',
    category: 'MALAYSIA'
  },
  {
    id: 'mys-bernama',
    url: 'https://www.bernama.com/en/rss/news.xml',
    name: 'BERNAMA',
    color: '#ffcc00',
    category: 'MALAYSIA'
  },
  {
    id: 'mys-star',
    url: 'https://www.thestar.com.my/rss/News',
    name: 'THE STAR',
    color: '#dc2626',
    category: 'MALAYSIA'
  },

  // Mongolia Feeds
  {
    id: 'mng-bom',
    url: 'https://www.mongolbank.mn/rss/news',
    name: 'BANK OF MONGOLIA',
    color: '#c4272e',
    category: 'MONGOLIA'
  },
  {
    id: 'mng-montsame',
    url: 'https://www.montsame.mn/en/rss',
    name: 'MONTSAME',
    color: '#0066b3',
    category: 'MONGOLIA'
  },

  // Nepal Feeds
  {
    id: 'npl-nrb',
    url: 'https://www.nrb.org.np/rss/news',
    name: 'NRB (CENTRAL BANK)',
    color: '#dc143c',
    category: 'NEPAL'
  },
  {
    id: 'npl-kathmandu',
    url: 'https://kathmandupost.com/feed',
    name: 'KATHMANDU POST',
    color: '#003366',
    category: 'NEPAL'
  },

  // Philippines News Feeds
  {
    id: 'phl-rappler',
    url: 'https://www.rappler.com/feed/',
    name: 'RAPPLER',
    color: '#ef4444',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-philstar',
    url: 'https://www.philstar.com/rss/headlines',
    name: 'PHIL STAR',
    color: '#0038a8',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-businessworld',
    url: 'https://www.bworldonline.com/feed/',
    name: 'BUSINESSWORLD',
    color: '#1e40af',
    category: 'PHILIPPINES'
  },
  // Philippines Regional/Government Feeds
  {
    id: 'phl-usgs-quakes',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.atom',
    name: 'PH EARTHQUAKES (USGS)',
    color: '#dc2626',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-quezon-city',
    url: 'https://quezoncity.gov.ph/feed/',
    name: 'QUEZON CITY GOV',
    color: '#0038a8',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-qc-advisories',
    url: 'https://quezoncity.gov.ph/category/advisories/feed/',
    name: 'QC ADVISORIES',
    color: '#1d4ed8',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-cebu-provincial',
    url: 'https://www.cebu.gov.ph/category/news/feed/',
    name: 'CEBU PROVINCIAL GOV',
    color: '#fcd116',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-freeman-cebu',
    url: 'https://www.philstar.com/rss/the-freeman',
    name: 'THE FREEMAN (CEBU)',
    color: '#0038a8',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-palawan-news',
    url: 'https://palawan-news.com/feed/',
    name: 'PALAWAN NEWS',
    color: '#22c55e',
    category: 'PHILIPPINES'
  },
  // Philippines Health/Medical Feeds
  {
    id: 'phl-pgh-hospital',
    url: 'https://pgh.gov.ph/feed/',
    name: 'PH GENERAL HOSPITAL',
    color: '#059669',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-philstar-health',
    url: 'https://www.philstar.com/rss/lifestyle/health-and-family',
    name: 'PHILSTAR HEALTH',
    color: '#0891b2',
    category: 'PHILIPPINES'
  },
  // Philippines News - National
  {
    id: 'phl-gma-news',
    url: 'https://data.gmanetwork.com/gno/rss/news/feed.xml',
    name: 'GMA NEWS',
    color: '#f59e0b',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-interaksyon',
    url: 'https://interaksyon.philstar.com/feed/',
    name: 'INTERAKSYON',
    color: '#6366f1',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-ptv-news',
    url: 'https://ptvnews.ph/feed/',
    name: 'PTV NEWS',
    color: '#0038a8',
    category: 'PHILIPPINES'
  },
  // Philippines Business/Finance
  {
    id: 'phl-philstar-business',
    url: 'https://www.philstar.com/rss/business',
    name: 'PHILSTAR BUSINESS',
    color: '#14b8a6',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-bilyonaryo',
    url: 'https://bilyonaryo.com/feed/',
    name: 'BILYONARYO',
    color: '#eab308',
    category: 'PHILIPPINES'
  },
  // Philippines Regional
  {
    id: 'phl-panay-news',
    url: 'https://www.panaynews.net/feed/',
    name: 'PANAY NEWS',
    color: '#22c55e',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-mindanao-times',
    url: 'https://mindanaotimes.com.ph/feed/',
    name: 'MINDANAO TIMES',
    color: '#dc2626',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-davao-today',
    url: 'https://davaotoday.com/feed/',
    name: 'DAVAO TODAY',
    color: '#ea580c',
    category: 'PHILIPPINES'
  },
  // Philippines Sports
  {
    id: 'phl-tiebreaker-times',
    url: 'https://tiebreakertimes.com.ph/feed/',
    name: 'TIEBREAKER TIMES',
    color: '#3b82f6',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-philstar-sports',
    url: 'https://www.philstar.com/rss/sports',
    name: 'PHILSTAR SPORTS',
    color: '#10b981',
    category: 'PHILIPPINES'
  },
  // Philippines Tech
  {
    id: 'phl-yugatech',
    url: 'https://www.yugatech.com/feed/',
    name: 'YUGATECH',
    color: '#8b5cf6',
    category: 'PHILIPPINES'
  },
  {
    id: 'phl-gadgetmatch',
    url: 'https://www.gadgetmatch.com/feed/',
    name: 'GADGETMATCH',
    color: '#ec4899',
    category: 'PHILIPPINES'
  },

  // South Korea Feeds
  {
    id: 'kor-bok',
    url: 'https://www.bok.or.kr/eng/rss/news.do',
    name: 'BANK OF KOREA',
    color: '#003478',
    category: 'SOUTH_KOREA'
  },
  {
    id: 'kor-yonhap',
    url: 'https://en.yna.co.kr/RSS/news.xml',
    name: 'YONHAP NEWS',
    color: '#c60c30',
    category: 'SOUTH_KOREA'
  },
  {
    id: 'kor-koreaherald',
    url: 'https://www.koreaherald.com/rss/all.xml',
    name: 'KOREA HERALD',
    color: '#003366',
    category: 'SOUTH_KOREA'
  },
  {
    id: 'kor-koreatimes',
    url: 'https://www.koreatimes.co.kr/www/rss/rss.xml',
    name: 'KOREA TIMES',
    color: '#1a5276',
    category: 'SOUTH_KOREA'
  },

  // Sri Lanka Feeds
  {
    id: 'lka-cbsl',
    url: 'https://www.cbsl.gov.lk/rss/news',
    name: 'CBSL (CENTRAL BANK)',
    color: '#8d153a',
    category: 'SRI_LANKA'
  },
  {
    id: 'lka-dailymirror',
    url: 'https://www.dailymirror.lk/RSS_Feeds/breaking-news/108',
    name: 'DAILY MIRROR LK',
    color: '#ff6600',
    category: 'SRI_LANKA'
  },

  // Taiwan Feeds
  {
    id: 'twn-cbc',
    url: 'https://www.cbc.gov.tw/en/rss/news',
    name: 'CBC (CENTRAL BANK)',
    color: '#fe0000',
    category: 'TAIWAN'
  },
  {
    id: 'twn-cna',
    url: 'https://focustaiwan.tw/rss',
    name: 'FOCUS TAIWAN',
    color: '#003366',
    category: 'TAIWAN'
  },
  {
    id: 'twn-taipeitimes',
    url: 'https://www.taipeitimes.com/xml/index.rss',
    name: 'TAIPEI TIMES',
    color: '#0055a4',
    category: 'TAIWAN'
  },

  // Thailand Feeds
  {
    id: 'tha-bot',
    url: 'https://www.bot.or.th/English/rss/news.xml',
    name: 'BANK OF THAILAND',
    color: '#0055a4',
    category: 'THAILAND'
  },
  {
    id: 'tha-mcot',
    url: 'https://www.mcot.net/rss/eng',
    name: 'MCOT NEWS',
    color: '#ef4444',
    category: 'THAILAND'
  },
  {
    id: 'tha-bangkokpost',
    url: 'https://www.bangkokpost.com/rss/data/topstories.xml',
    name: 'BANGKOK POST',
    color: '#003366',
    category: 'THAILAND'
  },

  // Vietnam Feeds
  {
    id: 'vnm-sbv',
    url: 'https://www.sbv.gov.vn/webcenter/portal/en/home/rss/news',
    name: 'SBV (CENTRAL BANK)',
    color: '#da251d',
    category: 'VIETNAM'
  },
  {
    id: 'vnm-vna',
    url: 'https://en.vietnamplus.vn/rss/news.rss',
    name: 'VNA NEWS',
    color: '#ffcd00',
    category: 'VIETNAM'
  },
  {
    id: 'vnm-vnexpress',
    url: 'https://e.vnexpress.net/rss/news.rss',
    name: 'VNEXPRESS',
    color: '#ef4444',
    category: 'VIETNAM'
  },

  // =============================================================================
  // PACIFIC / OCEANIA FEEDS
  // =============================================================================

  // Australia Feeds
  {
    id: 'aus-rba',
    url: 'https://www.rba.gov.au/rss/rss-cb-media-releases.xml',
    name: 'RBA (CENTRAL BANK)',
    color: '#00008b',
    category: 'AUSTRALIA'
  },
  {
    id: 'aus-abc',
    url: 'https://www.abc.net.au/news/feed/51120/rss.xml',
    name: 'ABC NEWS AU',
    color: '#ef4444',
    category: 'AUSTRALIA'
  },
  {
    id: 'aus-smh',
    url: 'https://www.smh.com.au/rss/feed.xml',
    name: 'SYDNEY MORNING HERALD',
    color: '#003366',
    category: 'AUSTRALIA'
  },
  {
    id: 'aus-afr',
    url: 'https://www.afr.com/rss/feed.xml',
    name: 'AUSTRAL. FIN. REVIEW',
    color: '#f59e0b',
    category: 'AUSTRALIA'
  },

  // New Zealand Feeds
  {
    id: 'nzl-rbnz',
    url: 'https://www.rbnz.govt.nz/rss/news',
    name: 'RBNZ (CENTRAL BANK)',
    color: '#00247d',
    category: 'NEW_ZEALAND'
  },
  {
    id: 'nzl-rnz',
    url: 'https://www.rnz.co.nz/rss/national.xml',
    name: 'RNZ NEWS',
    color: '#0055a4',
    category: 'NEW_ZEALAND'
  },
  {
    id: 'nzl-nzherald',
    url: 'https://www.nzherald.co.nz/arc/outboundfeeds/rss/',
    name: 'NZ HERALD',
    color: '#003366',
    category: 'NEW_ZEALAND'
  },

  // =============================================================================
  // CARIBBEAN FEEDS
  // =============================================================================

  // Jamaica Feeds
  {
    id: 'jam-boj',
    url: 'https://www.boj.org.jm/rss/news',
    name: 'BANK OF JAMAICA',
    color: '#009b3a',
    category: 'JAMAICA'
  },
  {
    id: 'jam-jis',
    url: 'https://jis.gov.jm/feed/',
    name: 'JIS NEWS',
    color: '#ffd200',
    category: 'JAMAICA'
  },
  {
    id: 'jam-gleaner',
    url: 'https://jamaica-gleaner.com/feed/',
    name: 'JAMAICA GLEANER',
    color: '#003366',
    category: 'JAMAICA'
  },

  // Saint Lucia Feeds
  {
    id: 'lca-eccb',
    url: 'https://www.eccb-centralbank.org/rss/news',
    name: 'ECCB (CENTRAL BANK)',
    color: '#65cfff',
    category: 'SAINT_LUCIA'
  },
  {
    id: 'lca-stluciatimes',
    url: 'https://stluciatimes.com/feed/',
    name: 'ST LUCIA TIMES',
    color: '#003366',
    category: 'SAINT_LUCIA'
  },

  // Trinidad and Tobago Feeds
  {
    id: 'tto-cbtt',
    url: 'https://www.central-bank.org.tt/rss/news',
    name: 'CBTT (CENTRAL BANK)',
    color: '#ce1126',
    category: 'TRINIDAD'
  },
  {
    id: 'tto-guardian',
    url: 'https://www.guardian.co.tt/rss',
    name: 'TRINIDAD GUARDIAN',
    color: '#003366',
    category: 'TRINIDAD'
  },
  {
    id: 'tto-newsday',
    url: 'https://newsday.co.tt/feed/',
    name: 'NEWSDAY TT',
    color: '#1a5276',
    category: 'TRINIDAD'
  },

  // =============================================================================
  // ADDITIONAL AMERICAS FEEDS
  // =============================================================================

  // Venezuela Feeds
  {
    id: 'ven-bcv',
    url: 'https://www.bcv.org.ve/rss/noticias',
    name: 'BCV (CENTRAL BANK)',
    color: '#ffcc00',
    category: 'VENEZUELA'
  },
  {
    id: 'ven-eluniversal',
    url: 'https://www.eluniversal.com/rss/',
    name: 'EL UNIVERSAL VE',
    color: '#003366',
    category: 'VENEZUELA'
  },
  {
    id: 'ven-elnacional',
    url: 'https://www.elnacional.com/feed/',
    name: 'EL NACIONAL',
    color: '#1a5276',
    category: 'VENEZUELA'
  },
];
