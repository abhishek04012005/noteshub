
export function HomePageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NotesHub',
    url: 'https://abhishekchoudhary.co.in',
    description: 'Premium study notes marketplace for students',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://abhishekchoudhary.co.in/student/browse?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function NotesMarketplaceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineBusiness',
    name: 'NotesHub',
    url: 'https://abhishekchoudhary.co.in',
    logo: 'https://abhishekchoudhary.co.in/logo.png',
    description: 'Buy and sell premium quality study notes',
    sameAs: [
      'https://www.facebook.com/noteshub',
      'https://www.twitter.com/noteshub',
      'https://www.linkedin.com/company/noteshub',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX',
      contactType: 'Customer Service',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Street Address',
      addressLocality: 'Your City',
      addressRegion: 'Your State',
      postalCode: 'Your Postal Code',
      addressCountry: 'IN',
    },
  };

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
    image: imageUrl || 'https://abhishekchoudhary.co.in/default-note.png',
    brand: {
      '@type': 'Brand',
      name: 'NotesHub',
    },
    author: {
      '@type': 'Person',
      name: author,
    },
    offers: {
      '@type': 'Offer',
      url: `https://abhishekchoudhary.co.in/student/notes/${id}`,
      priceCurrency: 'INR',
      price: price.toString(),
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
