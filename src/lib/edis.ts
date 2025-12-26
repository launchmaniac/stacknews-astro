// Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200 support@launchmaniac.com
// USITC Investigations Database System (IDS) API Wrapper
// US International Trade Commission - Trade Investigation Data
// Source: https://ids.usitc.gov/investigations.json

// IDS API URL (public JSON endpoint)
export const IDS_API_URL = 'https://ids.usitc.gov/investigations.json';

// Investigation Categories from IDS
export type IdsCategory =
  | '337 - Unfair Imports'
  | 'AD'
  | 'CVD'
  | 'Global Safeguard'
  | '332 - Factfinding'
  | 'Changed Circumstances'
  | 'AGOA'
  | 'Other';

// Simplified investigation type for filtering
export type EdisInvestigationType =
  | '337'      // Section 337 (IP/Patents)
  | 'AD'       // Antidumping
  | 'CVD'      // Countervailing Duty
  | 'ADCVD'    // Combined AD/CVD
  | 'SAF'      // Safeguard
  | 'IA'       // Industry Analysis / Factfinding
  | 'MISC';    // Miscellaneous

// Investigation interface matching IDS API response
export interface IdsInvestigation {
  'Investigation ID': number;
  'Investigation Number': string;
  'Full Title': string;
  'Topic'?: string;
  'Investigation Status': { ID: number; Name: string };
  'Investigation Categories': Array<{ ID: number; Name: string; 'Is Active?': boolean }>;
  'Countries': Array<{ name: string; ID: number }>;
  'Start Date': string;
  'Investigation End Date'?: string;
  'Is Active?': boolean;
  'Vote Date'?: { date: string; isNa: boolean };
  'Determination Date'?: { date: string; isNa: boolean };
  'Investigation Type'?: { Name: string };
  'Investigation Phase'?: { Name: string };
  'Docket Number'?: string;
  'Product Group Code'?: { ID: number; Name: string; 'Product Group Code Description': string };
}

// Normalized investigation for our API
export interface EdisInvestigation {
  investigationNumber: string;
  investigationType: EdisInvestigationType;
  title: string;
  status: 'active' | 'terminated' | 'pending';
  phase?: string;
  dateInstituted?: string;
  dateCompleted?: string;
  productDescription?: string;
  countries: string[];
  category: string;
}

// API Response wrapper
export interface EdisResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  timestamp: string;
  error?: string;
}

// Feed Item for RSS-style display
export interface EdisFeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category: string;
  investigationType: string;
  investigationNumber: string;
  sourceName: string;
  color: string;
}

// In-memory cache for IDS data
let idsCache: { data: IdsInvestigation[]; timestamp: number } | null = null;
const IDS_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Parse date from IDS format (MM-DD-YYYY) to ISO
function parseIdsDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  // Handle MM-DD-YYYY format
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

// Normalize investigation status
function normalizeStatus(idsStatus: string | undefined, isActive: boolean): 'active' | 'terminated' | 'pending' {
  if (!idsStatus) return isActive ? 'active' : 'terminated';
  const lower = idsStatus.toLowerCase();
  if (lower.includes('completed') || lower.includes('terminated')) return 'terminated';
  if (lower.includes('pending') || lower.includes('review')) return 'pending';
  return isActive ? 'active' : 'terminated';
}

// Map IDS category to our simplified type
function mapCategoryToType(categories: Array<{ Name: string }> | undefined): EdisInvestigationType {
  if (!categories || categories.length === 0) return 'MISC';

  const categoryNames = categories.map(c => c.Name);

  if (categoryNames.some(n => n.includes('337'))) return '337';
  if (categoryNames.includes('AD') && categoryNames.includes('CVD')) return 'ADCVD';
  if (categoryNames.includes('AD')) return 'AD';
  if (categoryNames.includes('CVD')) return 'CVD';
  if (categoryNames.some(n => n.includes('Safeguard'))) return 'SAF';
  if (categoryNames.some(n => n.includes('332') || n.includes('Factfinding'))) return 'IA';

  return 'MISC';
}

// Convert IDS investigation to our normalized format
function normalizeInvestigation(ids: IdsInvestigation): EdisInvestigation {
  const categories = ids['Investigation Categories'] || [];
  const primaryCategory = categories[0]?.Name || 'Unknown';

  return {
    investigationNumber: ids['Investigation Number'] || '',
    investigationType: mapCategoryToType(categories),
    title: ids['Full Title'] || ids['Topic'] || ids['Investigation Number'] || 'Untitled',
    status: normalizeStatus(ids['Investigation Status']?.Name, ids['Is Active?'] ?? false),
    phase: ids['Investigation Phase']?.Name,
    dateInstituted: parseIdsDate(ids['Start Date']),
    dateCompleted: parseIdsDate(ids['Investigation End Date']),
    productDescription: ids['Product Group Code']?.['Product Group Code Description'],
    countries: (ids['Countries'] || []).map(c => c.name),
    category: primaryCategory,
  };
}

// Fetch all investigations from IDS API
async function fetchIdsData(): Promise<IdsInvestigation[]> {
  const now = Date.now();

  // Check cache first
  if (idsCache && (now - idsCache.timestamp) < IDS_CACHE_TTL) {
    console.log('[IDS] Using cached data');
    return idsCache.data;
  }

  console.log('[IDS] Fetching fresh data from API');
  const response = await fetch(IDS_API_URL, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'StackNews/1.0 (Economic Data Aggregator)',
    }
  });

  if (!response.ok) {
    throw new Error(`IDS API error: ${response.status}`);
  }

  const json = await response.json();
  const data = json.data as IdsInvestigation[];

  // Update cache
  idsCache = { data, timestamp: now };
  console.log(`[IDS] Fetched ${data.length} investigations`);

  return data;
}

// Get human-readable label for investigation type
export function getInvestigationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    '337': 'Section 337 (Intellectual Property)',
    'AD': 'Antidumping Investigation',
    'CVD': 'Countervailing Duty',
    'ADCVD': 'Combined AD/CVD',
    'SAF': 'Safeguard Investigation',
    'IA': 'Industry Analysis',
    'MISC': 'Trade Investigation',
  };
  return labels[type] || type;
}

// Fetch investigations with optional filtering
export async function fetchInvestigations(
  type?: EdisInvestigationType,
  status?: 'active' | 'terminated' | 'all',
  limit: number = 50
): Promise<EdisResponse<EdisInvestigation>> {
  try {
    const rawData = await fetchIdsData();

    // Convert and filter
    let investigations = rawData.map(normalizeInvestigation);

    // Filter by type
    if (type) {
      investigations = investigations.filter(inv => inv.investigationType === type);
    }

    // Filter by status
    if (status && status !== 'all') {
      investigations = investigations.filter(inv => inv.status === status);
    }

    // Sort by date (most recent first)
    investigations.sort((a, b) => {
      const dateA = a.dateInstituted || '';
      const dateB = b.dateInstituted || '';
      return dateB.localeCompare(dateA);
    });

    // Apply limit
    const limited = investigations.slice(0, limit);

    return {
      success: true,
      data: limited,
      totalCount: investigations.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[IDS] fetchInvestigations error:', error);

    // Return stale cache on error if available
    if (idsCache) {
      console.log('[IDS] Returning stale cache on error');
      let investigations = idsCache.data.map(normalizeInvestigation);
      if (type) investigations = investigations.filter(inv => inv.investigationType === type);
      if (status && status !== 'all') investigations = investigations.filter(inv => inv.status === status);

      return {
        success: true,
        data: investigations.slice(0, limit),
        totalCount: investigations.length,
        timestamp: new Date().toISOString(),
        error: 'Using stale cache due to API error',
      };
    }

    return {
      success: false,
      data: [],
      totalCount: 0,
      timestamp: new Date().toISOString(),
      error: error?.message || 'Unknown error',
    };
  }
}

// Convert investigations to feed items
export function investigationsToFeedItems(
  investigations: EdisInvestigation[],
  feedName: string,
  color: string
): EdisFeedItem[] {
  return investigations.map(inv => ({
    id: inv.investigationNumber,
    title: inv.title,
    description: [
      getInvestigationTypeLabel(inv.investigationType),
      inv.status ? `Status: ${inv.status}` : null,
      inv.phase ? `Phase: ${inv.phase}` : null,
      inv.productDescription ? `Product: ${inv.productDescription}` : null,
      inv.countries.length > 0 ? `Countries: ${inv.countries.join(', ')}` : null,
    ].filter(Boolean).join(' | '),
    link: `https://ids.usitc.gov/?investigationNumber=${encodeURIComponent(inv.investigationNumber)}`,
    pubDate: inv.dateInstituted || new Date().toISOString(),
    category: 'REGULATION',
    investigationType: inv.investigationType,
    investigationNumber: inv.investigationNumber,
    sourceName: feedName,
    color,
  }));
}

// EDIS Snapshot - aggregated data for dashboard
export interface EdisSnapshot {
  timestamp: string;
  summary: {
    activeInvestigations: number;
    section337Cases: number;
    importInjuryCases: number;
  };
  recentSection337: EdisInvestigation[];
  recentImportInjury: EdisInvestigation[];
}

// Fetch aggregated snapshot
export async function fetchEdisSnapshot(): Promise<EdisSnapshot> {
  const [section337, adCases, cvdCases] = await Promise.all([
    fetchInvestigations('337', 'active', 20),
    fetchInvestigations('AD', 'active', 20),
    fetchInvestigations('CVD', 'active', 20),
  ]);

  // Combine AD and CVD for import injury
  const importInjury = [...adCases.data, ...cvdCases.data]
    .sort((a, b) => (b.dateInstituted || '').localeCompare(a.dateInstituted || ''))
    .slice(0, 20);

  return {
    timestamp: new Date().toISOString(),
    summary: {
      activeInvestigations: section337.totalCount + adCases.totalCount + cvdCases.totalCount,
      section337Cases: section337.totalCount,
      importInjuryCases: adCases.totalCount + cvdCases.totalCount,
    },
    recentSection337: section337.data.slice(0, 10),
    recentImportInjury: importInjury.slice(0, 10),
  };
}

// Legacy exports for compatibility (documents are not available in IDS API)
export interface EdisDocument {
  id: string;
  documentNumber: string;
  title: string;
  investigationNumber: string;
  investigationType: string;
  documentType?: string;
  filingDate: string;
  securityLevel: 'public' | 'confidential' | 'limited';
}

// Fetch recent documents (returns empty - not available in IDS API)
export async function fetchRecentDocuments(
  _investigationType?: EdisInvestigationType,
  _days: number = 7,
  _limit: number = 50
): Promise<EdisResponse<EdisDocument>> {
  // IDS API does not provide document-level data
  // Documents require EDIS API with authentication
  return {
    success: true,
    data: [],
    totalCount: 0,
    timestamp: new Date().toISOString(),
    error: 'Document data requires EDIS authentication - see https://edis.usitc.gov',
  };
}

// Convert documents to feed items (legacy compatibility)
export function documentsToFeedItems(
  documents: EdisDocument[],
  feedName: string,
  color: string
): EdisFeedItem[] {
  return documents.map(doc => ({
    id: doc.id,
    title: doc.title || `${doc.investigationNumber} - Document ${doc.documentNumber}`,
    description: doc.documentType || 'Document',
    link: `https://edis.usitc.gov/external/investigations/${doc.investigationNumber}`,
    pubDate: doc.filingDate || new Date().toISOString(),
    category: 'REGULATION',
    investigationType: doc.investigationType,
    investigationNumber: doc.investigationNumber,
    sourceName: feedName,
    color,
  }));
}
