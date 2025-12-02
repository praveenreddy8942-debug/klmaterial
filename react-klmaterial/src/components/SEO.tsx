import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'KL Material - Your Complete Study Hub',
  description = 'Access comprehensive CSE study materials, roadmaps, and resources. Download PDFs for BEEC, DM, DSD, PSC, and more. Your one-stop destination for academic success.',
  keywords = [
    'KL Material',
    'CSE Study Materials',
    'Engineering Notes',
    'B.Tech Resources',
    'BEEC Notes',
    'Discrete Mathematics',
    'Digital System Design',
    'Problem Solving with C',
    'Career Roadmap',
    'Study Hub'
  ],
  image = './og-image.png',
  url = 'https://praveenreddy8942-debug.github.io/klmaterial/',
  type = 'website',
  author = 'Praveen Reddy',
  publishedTime,
  modifiedTime,
  section,
  tags,
}) => {
  const siteTitle = title.includes('KL Material') ? title : `${title} | KL Material`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'KL Material',
    description: description,
    url: url,
    logo: `${url}icon.svg`,
    sameAs: [
      'https://github.com/praveenreddy8942-debug',
      'https://linkedin.com/in/praveenreddy',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'praveenreddy@example.com',
      contactType: 'Customer Service',
    },
    offers: {
      '@type': 'Offer',
      category: 'Educational Resources',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: url,
      },
    ],
  };

  return (
    <Helmet>
      {/* Google Analytics (inject if env var present) */}
      {import.meta && (import.meta as any).env && (import.meta as any).env.VITE_GA_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${(import.meta as any).env.VITE_GA_ID}`}></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', '${(import.meta as any).env.VITE_GA_ID}', { send_page_view: false });
            `}
          </script>
        </>
      )}

      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="KL Material" />
      <meta property="og:locale" content="en_US" />
      
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:creator" content="@praveenreddy" />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="google" content="notranslate" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#00d4ff" />
      
      {/* Mobile Optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="KL Material" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Manifest */}
      <link rel="manifest" href="./manifest.json" />
    </Helmet>
  );
};

export default SEO;
