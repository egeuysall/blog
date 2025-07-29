'use client';

import { useEffect } from 'react';

interface JsonLdProps {
  jsonLdData: {
    '@context': string;
    '@type': string;
    name: string;
    image: string;
    description: string;
    [key: string]: unknown;
  };
}

const JsonLd = ({ jsonLdData }: JsonLdProps) => {
  useEffect(() => {
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((script) => script.remove());

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      const ourScript = document.querySelector(`script[type="application/ld+json"]`);
      if (ourScript) document.head.removeChild(ourScript);
    };
  }, [jsonLdData]);

  return null;
};

export default JsonLd;
