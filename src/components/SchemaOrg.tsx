
"use client";
import { SITE_URL, SITE_NAME, OG_IMAGES, CONTACT_INFO, ORGANIZATION, getCanonical } from '@/config/site';
export function getHomeSchemaObject() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: ORGANIZATION.description || 'Premium study notes marketplace for students',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/student/browse?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function HomePageSchema() {
  const schema = getHomeSchemaObject();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function getOrganizationSchemaObject() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION.name || SITE_NAME,
    url: ORGANIZATION.url || SITE_URL,
    logo: ORGANIZATION.logo || `${SITE_URL}/logo.png`,
    description: ORGANIZATION.description || 'Buy premium quality study notes',
    sameAs: Object.values(CONTACT_INFO).filter(Boolean).slice(0, 3),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_INFO.phone || ORGANIZATION.phone || '+91-0000000000',
      contactType: 'Customer Service',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address?.streetAddress || '',
      addressLocality: CONTACT_INFO.address?.addressLocality || '',
      addressRegion: CONTACT_INFO.address?.addressRegion || '',
      postalCode: CONTACT_INFO.address?.postalCode || '',
      addressCountry: CONTACT_INFO.address?.addressCountry || 'IN',
    },
  };
}

export function NotesMarketplaceSchema() {
  const schema = getOrganizationSchemaObject();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  imageUrl?: string;
  university?: string;
  course?: string;
}

export function ProductSchema({
  id,
  title,
  description,
  author,
  price,
  imageUrl,
  university,
  course,
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description,
    image: imageUrl || `${SITE_URL}/default-note.png`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    author: {
      '@type': 'Person',
      name: author,
    },
    offers: {
      '@type': 'Offer',
      url: getCanonical(`/student/notes/${id}`),
      priceCurrency: 'INR',
      price: price != null ? price.toString() : '0',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '100',
    },
    ...(university && { courseCode: university }),
    ...(course && { courseCodeValue: course }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function getProductSchemaObject(props: ProductSchemaProps) {
  const { id, title, description, author, price, imageUrl, university, course } = props;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description,
    image: imageUrl || `${SITE_URL}/default-note.png`,
    brand: { '@type': 'Brand', name: SITE_NAME },
    author: { '@type': 'Person', name: author },
    offers: {
      '@type': 'Offer',
      url: getCanonical(`/student/notes/${id}`),
      priceCurrency: 'INR',
      price: price != null ? price.toString() : '0',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '100' },
    ...(university && { courseCode: university }),
    ...(course && { courseCodeValue: course }),
  };
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function getBreadcrumbSchemaObject(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
  };
}

interface SyllabusSchemaProps {
  id: string;
  title: string;
  description?: string;
  university?: string;
  course?: string;
  branch?: string;
  semester?: string;
  downloadUrl?: string;
}

export function SyllabusSchema({ id, title, description, university, course, branch, semester, downloadUrl }: SyllabusSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description || '',
    identifier: id,
    educationalLevel: `${course || ''} ${branch || ''}`.trim(),
    about: {
      '@type': 'Course',
      name: course || '',
      provider: {
        '@type': 'CollegeOrUniversity',
        name: university || '',
      },
    },
  };

  if (semester) schema.hasPart = { '@type': 'CreativeWork', name: `Semester ${semester}` };
  if (downloadUrl) schema.url = downloadUrl;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function getSyllabusSchemaObject(props: SyllabusSchemaProps) {
  const { id, title, description, university, course, branch, semester, downloadUrl } = props;
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description || '',
    identifier: id,
    educationalLevel: `${course || ''} ${branch || ''}`.trim(),
    about: { '@type': 'Course', name: course || '', provider: { '@type': 'CollegeOrUniversity', name: university || '' } },
  };
  if (semester) schema.hasPart = { '@type': 'CreativeWork', name: `Semester ${semester}` };
  if (downloadUrl) schema.url = downloadUrl;
  return schema;
}
