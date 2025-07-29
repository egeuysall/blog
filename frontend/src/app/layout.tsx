// Global CSS
import '@/styles/globals.css';

// External Libraries
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Fonts
import { inter, dmSans, jetbrainsMono } from '@/lib/fonts';

// Internal Components
import { Footer } from '@/components/blocks/footer';
import { Header } from '@/components/blocks/header';
import { LayoutWrapper } from '@/components/seo/layout-wrapper';

// SEO details
import { getProduct } from '@/lib/site-details';

/**
 * The name of the site or application.
 * @type {string}
 */

// TODO: Fill these
export const name = '';

/**
 * The main image URL for the site or application.
 * @type {string}
 */
export const image = '';

/**
 * A brief description of the site or application.
 * @type {string}
 */
export const description = '';

/**
 * The template string for dynamic page titles or metadata.
 * @type {string}
 */
const template = '';

/**
 * The base URL of the site.
 * @type {string}
 */
const siteUrl = 'http://w.co';

/**
 * The name of the site's author.
 * @type {string}
 */
const authorName = '';

/**
 * An array of keywords relevant to the site for SEO purposes.
 * @type {string[]}
 */
const keywords: string[] = [];

/**
 * A description of the main image for accessibility and SEO.
 * @type {string}
 */
const imageDescription = '';

/**
 * The Twitter handle of the author (e.g., '@username').
 * @type {string}
 */
const authorTwitter = '';

/**
 * The LinkedIn profile URL of the author.
 * @type {string}
 */
const authorLinkedin = '';

/**
 * The path or URL to the ICO favicon.
 * @type {string}
 */
const icoIcon = '';

/**
 * The path or URL to the PNG favicon.
 * @type {string}
 */
const pngIcon = '';

/**
 * The path or URL to the Apple touch icon.
 * @type {string}
 */
const appleTouchIcon = '';

/**
 * The path or URL to the web app manifest file.
 * @type {string}
 */
const manifestFile = '';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch data needed for metadata
  const product = await getProduct();
  return {
    title: {
      default: product.name,
      template: `%s | ${template}`,
    },
    description: product.description,
    metadataBase: new URL(siteUrl),
    authors: [{ name: authorName }],
    keywords: keywords,
    openGraph: {
      title: product.name,
      description: product.description,
      url: siteUrl,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: imageDescription,
        },
      ],
      type: 'website',
      locale: 'en_US',
      siteName: product.name,
    },
    twitter: {
      card: 'summary_large_image',
      site: product.name,
      title: product.name,
      description: product.description,
      images: [product.image],
      creator: authorTwitter,
    },
    icons: {
      icon: [
        { url: icoIcon, sizes: 'any' },
        { url: pngIcon, type: 'image/png' },
      ],
      apple: appleTouchIcon,
      shortcut: icoIcon,
    },
    manifest: manifestFile,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: siteUrl,
    },
    applicationName: product.name,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
    },
    other: {
      appleMobileWebAppCapable: 'yes',
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const product = await getProduct();

  // Define date for product schema
  const priceValidUntilDate = new Date();
  priceValidUntilDate.setFullYear(priceValidUntilDate.getFullYear() + 1);
  const priceValidUntilString = priceValidUntilDate.toISOString().split('T')[0];

  // Format current date for schema (ISO format)
  const currentDate = new Date().toISOString();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `${siteUrl}/${product.image}`,
    description: product.description,
    url: siteUrl,
    dateModified: currentDate,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: siteUrl,
      priceValidUntil: priceValidUntilString,
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: '0',
            maxValue: '0',
            unitCode: 'HUR',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
    sameAs: [authorLinkedin, authorTwitter],
  };

  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable} pb-18`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="w-full h-full flex-center">
        <LayoutWrapper jsonLdData={jsonLd}>
          <main className="w-[90vw] md:w-[92.5vw] lg:w-[95vw]">
            <div className="mb-24">
              <Header />
            </div>
            <Analytics />
            {children}
            <SpeedInsights />
            <aside className="w-full flex-center mt-24">
              <Footer />
            </aside>
          </main>
        </LayoutWrapper>
      </body>
    </html>
  );
}
