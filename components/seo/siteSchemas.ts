export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://weestox.com').replace(/\/$/, '');

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'WeeStox',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo_light.png`,
      width: '490',
      height: '193',
      caption: 'WeeStox Official Brand Logo',
    },
    image: `${SITE_URL}/og-image.png`,
    description:
      'Stock research, IPO updates, metal prices and financial calculators with Shariah screening.',
    sameAs: [
      'https://twitter.com/weestox',
      'https://www.linkedin.com/company/weestox',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'care@weestox.com',
      contactType: 'customer support',
      availableLanguage: ['en', 'hi'],
    },
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'WeeStox',
    description:
      'Stock financials, IPO GMP and allotment updates, metal rates and financial research tools.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/stocks?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-IN',
  };
}

export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`,
    })),
  };
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getSoftwareAppSchema({
  name,
  description,
  applicationCategory,
  path,
}: {
  name: string;
  description: string;
  applicationCategory: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory,
    operatingSystem: 'Any (Web Application)',
    url: `${SITE_URL}${path}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}
