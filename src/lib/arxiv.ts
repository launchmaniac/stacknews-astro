// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// ArXiv API Integration - Scientific Research Preprints
// API Docs: https://arxiv.org/help/api/index
// Protocol: OAI-PMH (Open Archives Initiative Protocol for Metadata Harvesting)

import type { ArxivPaper } from './types';

const ARXIV_API = 'https://export.arxiv.org/api/query';

// =============================================================================
// ARXIV CATEGORY TAXONOMY
// Full list: https://arxiv.org/category_taxonomy
// =============================================================================

export const ARXIV_CATEGORIES = {
  // Economics & Finance
  QUANTITATIVE_FINANCE: 'q-fin',
  ECONOMETRICS: 'econ.EM',
  GENERAL_ECONOMICS: 'econ.GN',
  THEORETICAL_ECONOMICS: 'econ.TH',

  // Computer Science
  AI: 'cs.AI',
  MACHINE_LEARNING: 'cs.LG',
  CRYPTOGRAPHY: 'cs.CR',
  DISTRIBUTED_COMPUTING: 'cs.DC',
  COMPUTATIONAL_COMPLEXITY: 'cs.CC',
  COMPUTER_VISION: 'cs.CV',
  NATURAL_LANGUAGE: 'cs.CL',

  // Physics
  NUCLEAR_PHYSICS: 'nucl-th',
  PLASMA_PHYSICS: 'physics.plasm-ph',
  ASTROPHYSICS: 'astro-ph',
  CONDENSED_MATTER: 'cond-mat',
  HIGH_ENERGY_PHYSICS: 'hep-ph',
  QUANTUM_PHYSICS: 'quant-ph',

  // Mathematics
  STATISTICS: 'stat',
  PROBABILITY: 'math.PR',
  NUMBER_THEORY: 'math.NT',

  // Other Sciences
  BIOLOGY: 'q-bio',
  COMPUTATIONAL_BIOLOGY: 'q-bio.QM',
} as const;

// Pre-defined query sets for dashboard categories
export const ARXIV_QUERY_PRESETS = {
  // Financial Intelligence
  FINANCE_QUANT: {
    categories: ['q-fin.ST', 'q-fin.RM', 'q-fin.PM', 'q-fin.MF'],
    description: 'Statistical Finance, Risk Management, Portfolio Management, Mathematical Finance'
  },
  ECONOMETRICS: {
    categories: ['econ.EM', 'econ.GN'],
    description: 'Econometrics and General Economics'
  },

  // Technology & AI
  AI_ML: {
    categories: ['cs.AI', 'cs.LG', 'cs.CL'],
    description: 'Artificial Intelligence, Machine Learning, Natural Language Processing'
  },
  CRYPTO_SECURITY: {
    categories: ['cs.CR', 'cs.DC'],
    description: 'Cryptography, Distributed Computing, Blockchain'
  },

  // Energy & Physics
  NUCLEAR_ENERGY: {
    categories: ['nucl-th', 'nucl-ex', 'physics.plasm-ph'],
    description: 'Nuclear Theory, Nuclear Experiment, Plasma Physics'
  },
  ASTROPHYSICS: {
    categories: ['astro-ph.EP', 'astro-ph.HE', 'astro-ph.CO'],
    description: 'Earth & Planetary, High Energy Astrophysics, Cosmology'
  },
  QUANTUM: {
    categories: ['quant-ph', 'cond-mat.mes-hall'],
    description: 'Quantum Physics, Quantum Computing'
  },

  // Climate & Environment
  CLIMATE_SCIENCE: {
    categories: ['physics.ao-ph', 'physics.geo-ph'],
    description: 'Atmospheric & Oceanic Physics, Geophysics'
  },
} as const;

// =============================================================================
// API FUNCTIONS
// =============================================================================

function buildQueryUrl(params: {
  categories?: string[];
  searchQuery?: string;
  maxResults?: number;
  sortBy?: 'submittedDate' | 'lastUpdatedDate' | 'relevance';
  sortOrder?: 'ascending' | 'descending';
  start?: number;
}): string {
  // Build search query - ArXiv requires literal +OR+ not URL-encoded
  let query = '';

  if (params.categories && params.categories.length > 0) {
    const catQuery = params.categories.map(cat => `cat:${cat}`).join('+OR+');
    query = catQuery;
  }

  if (params.searchQuery) {
    const searchPart = `all:${encodeURIComponent(params.searchQuery)}`;
    query = query ? `(${query})+AND+(${searchPart})` : searchPart;
  }

  if (!query) {
    query = 'cat:q-fin.*'; // Default to quantitative finance
  }

  // Build URL manually to avoid double-encoding of + signs
  const urlParams = [
    `search_query=${query}`,
    `max_results=${params.maxResults || 25}`,
    `sortBy=${params.sortBy || 'submittedDate'}`,
    `sortOrder=${params.sortOrder || 'descending'}`
  ];

  if (params.start) {
    urlParams.push(`start=${params.start}`);
  }

  return `${ARXIV_API}?${urlParams.join('&')}`;
}

// Parse ArXiv Atom XML response
function parseAtomResponse(xml: string): ArxivPaper[] {
  const papers: ArxivPaper[] = [];

  // Simple XML parsing (ArXiv returns Atom feed)
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    const getId = (text: string) => {
      const m = text.match(/<id>(.*?)<\/id>/);
      return m ? m[1].replace('http://arxiv.org/abs/', '') : '';
    };

    const getTitle = (text: string) => {
      const m = text.match(/<title>([\s\S]*?)<\/title>/);
      return m ? m[1].replace(/\s+/g, ' ').trim() : '';
    };

    const getSummary = (text: string) => {
      const m = text.match(/<summary>([\s\S]*?)<\/summary>/);
      return m ? m[1].replace(/\s+/g, ' ').trim() : '';
    };

    const getAuthors = (text: string) => {
      const authors: string[] = [];
      const authorRegex = /<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g;
      let authorMatch;
      while ((authorMatch = authorRegex.exec(text)) !== null) {
        authors.push(authorMatch[1].trim());
      }
      return authors;
    };

    const getDate = (text: string, tag: string) => {
      const m = text.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
      return m ? m[1] : '';
    };

    const getCategories = (text: string) => {
      const cats: string[] = [];
      const catRegex = /<category[^>]*term="([^"]+)"/g;
      let catMatch;
      while ((catMatch = catRegex.exec(text)) !== null) {
        cats.push(catMatch[1]);
      }
      return cats;
    };

    const getPrimaryCategory = (text: string) => {
      const m = text.match(/<arxiv:primary_category[^>]*term="([^"]+)"/);
      return m ? m[1] : '';
    };

    const getLinks = (text: string) => {
      let pdfLink: string | undefined;
      let abstractLink: string | undefined;

      const linkRegex = /<link[^>]*href="([^"]+)"[^>]*(?:title="([^"]+)")?[^>]*(?:type="([^"]+)")?[^>]*\/>/g;
      let linkMatch;
      while ((linkMatch = linkRegex.exec(text)) !== null) {
        const href = linkMatch[1];
        const title = linkMatch[2];
        if (title === 'pdf' || href.includes('/pdf/')) {
          pdfLink = href;
        } else if (href.includes('/abs/')) {
          abstractLink = href;
        }
      }

      return { pdfLink, abstractLink };
    };

    const id = getId(entry);
    if (!id) continue;

    const links = getLinks(entry);

    papers.push({
      id,
      title: getTitle(entry),
      summary: getSummary(entry),
      authors: getAuthors(entry),
      published: getDate(entry, 'published'),
      updated: getDate(entry, 'updated'),
      categories: getCategories(entry),
      primaryCategory: getPrimaryCategory(entry),
      pdfLink: links.pdfLink,
      abstractLink: links.abstractLink || `https://arxiv.org/abs/${id.split('/').pop()}`
    });
  }

  return papers;
}

async function fetchArxiv(url: string): Promise<ArxivPaper[]> {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/atom+xml' }
    });

    if (!res.ok) return [];

    const xml = await res.text();
    return parseAtomResponse(xml);
  } catch {
    return [];
  }
}

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

// Get papers by category preset
export async function getArxivByPreset(
  preset: keyof typeof ARXIV_QUERY_PRESETS,
  maxResults: number = 25
): Promise<ArxivPaper[]> {
  const config = ARXIV_QUERY_PRESETS[preset];
  const url = buildQueryUrl({
    categories: config.categories,
    maxResults,
    sortBy: 'submittedDate',
    sortOrder: 'descending'
  });

  return fetchArxiv(url);
}

// Get papers by specific categories
export async function getArxivByCategories(
  categories: string[],
  maxResults: number = 25
): Promise<ArxivPaper[]> {
  const url = buildQueryUrl({
    categories,
    maxResults,
    sortBy: 'submittedDate',
    sortOrder: 'descending'
  });

  return fetchArxiv(url);
}

// Search papers by keyword
export async function searchArxiv(
  query: string,
  categories?: string[],
  maxResults: number = 25
): Promise<ArxivPaper[]> {
  const url = buildQueryUrl({
    searchQuery: query,
    categories,
    maxResults,
    sortBy: 'relevance',
    sortOrder: 'descending'
  });

  return fetchArxiv(url);
}

// Get latest papers across all relevant categories for dashboard
export async function getArxivSnapshot(): Promise<{
  finance: ArxivPaper[];
  ai: ArxivPaper[];
  energy: ArxivPaper[];
  quantum: ArxivPaper[];
  timestamp: string;
}> {
  const [finance, ai, energy, quantum] = await Promise.all([
    getArxivByPreset('FINANCE_QUANT', 10),
    getArxivByPreset('AI_ML', 10),
    getArxivByPreset('NUCLEAR_ENERGY', 10),
    getArxivByPreset('QUANTUM', 10)
  ]);

  return {
    finance,
    ai,
    energy,
    quantum,
    timestamp: new Date().toISOString()
  };
}

// Get total counts by category
export async function getArxivCategoryCounts(): Promise<Record<string, number>> {
  // Note: ArXiv API doesn't provide counts directly
  // We fetch small samples to verify categories are active
  const results: Record<string, number> = {};

  for (const [key, config] of Object.entries(ARXIV_QUERY_PRESETS)) {
    const papers = await getArxivByPreset(key as keyof typeof ARXIV_QUERY_PRESETS, 5);
    results[key] = papers.length;
  }

  return results;
}
