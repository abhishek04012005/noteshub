/**
 * Site Configuration
 * Central location for all site-wide configuration including URLs, metadata, and branding
 */

export const SITE_URL = 'https://noteshub.abhishekchoudhary.co.in';
export const SITE_NAME = 'NotesHub';
export const SITE_DESCRIPTION = 'NotesHub is a secure marketplace to buy  high-quality study notes. Connect with students, earn money from your notes, and access expertly curated study materials.';

/**
 * OG Image URLs - replace with your actual image paths
 */
export const OG_IMAGES = {
  default: `${SITE_URL}/og-image.jpg`,
  notes: `${SITE_URL}/og-notes.jpg`,
  browse: `${SITE_URL}/og-browse.jpg`,
};

/**
 * Site Keywords
 */
export const SITE_KEYWORDS = [
  'buy study notes',
  'study materials',
  'notes marketplace',
  'student notes',
  'exam preparation',
  'educational resources',
];

/**
 * Social Media Links
 */
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/noteshub',
  facebook: 'https://facebook.com/noteshub',
  linkedin: 'https://linkedin.com/company/noteshub',
  instagram: 'https://instagram.com/noteshub',
};

/**
 * Contact Information
 */
export const CONTACT_INFO = {
  email: 'notesmarketplace07@gmail.com',
  phone: '+91-9263767441',
  address: {
    streetAddress: 'Vijay Nagar',
    addressLocality: 'Indore',
    addressRegion: 'Madhya Pradesh',
    postalCode: '452010',
    addressCountry: 'IN',
  },
};

/**
 * Organization/Company Information
 */
export const ORGANIZATION = {
  name: 'NotesHub',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  email: CONTACT_INFO.email,
  phone: CONTACT_INFO.phone,
  address: CONTACT_INFO.address,
};

/**
 * Utility function to create full URL from path
 */
export const createUrl = (path: string): string => {
  return `${SITE_URL}${path.startsWith('/') ? path : '/' + path}`;
};

/**
 * Utility function to create canonical URL
 */
export const getCanonical = (path: string): string => {
  return createUrl(path);
};
