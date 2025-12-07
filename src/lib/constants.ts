// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com

import type { FeedConfig } from './types';

export const RSS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url='
];

export const EDGE_PROXY_URL = 'https://stacknews-proxy.launch-maniac.workers.dev/proxy';
export const FRED_API_KEY = 'd3789ba8e97b27510d17f711a8212f4b';
export const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

export const CATEGORIES = [
  { id: 'ALL', label: 'OVERVIEW' },
  { id: 'TREASURY', label: 'TREASURY' },
  { id: 'FEDERAL RESERVE', label: 'FEDERAL RESERVE' },
  { id: 'ENERGY', label: 'ENERGY SECTOR' },
  { id: 'EUROZONE', label: 'EUROZONE' },
  { id: 'ASIA_PACIFIC', label: 'ASIA PACIFIC' },
  { id: 'GLOBAL_MACRO', label: 'GLOBAL MACRO' },
  { id: 'CRYPTO', label: 'CRYPTO CURRENCY' },
  { id: 'STATE_DEPT', label: 'STATE DEPT.' },
  { id: 'MILITARY', label: 'U.S. MILITARY' },
  { id: 'UK', label: 'UNITED KINGDOM' },
  { id: 'RESEARCH', label: 'RESEARCH & GRANT' },
  { id: 'MORTGAGE', label: 'MORTGAGE' },
  { id: 'REAL ESTATE', label: 'REAL ESTATE' },
  { id: 'LEGISLATION', label: 'LEGISLATION' },
  { id: 'REGULATION', label: 'REGULATION' },
  { id: 'EXECUTIVE', label: 'EXECUTIVE' },
  { id: 'NEWS', label: 'NEWS' },
  { id: 'CANADA', label: 'CANADA' },
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

  // Legislation Feeds (cr.xml 404)
  {
    id: 'bills',
    url: 'https://www.govinfo.gov/rss/bills.xml',
    name: 'CONGRESSIONAL BILLS',
    color: '#34d399',
    category: 'LEGISLATION'
  },
  {
    id: 'plaw',
    url: 'https://www.govinfo.gov/rss/plaw.xml',
    name: 'PUBLIC LAWS',
    color: '#4ade80',
    category: 'LEGISLATION'
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
];
