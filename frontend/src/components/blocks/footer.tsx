import React from 'react';
import Link from 'next/link';
import { Globe, Github, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ResourceLink {
  title: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: LucideIcon;
  size: number;
  ariaLabel: string;
}

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  /**
   * Information about the company to be displayed in the footer.
   * @property {string} name - The name of the company.
   * @property {string} slogan - The company's slogan or tagline.
   */

  // TODO: Fill these
  const companyInfo = {
    name: '',
    slogan: '',
  };

  /**
   * List of resource links to be shown in the footer.
   * Each link should have a title and a URL (href).
   * @type {ResourceLink[]}
   * @example
   * [{ title: 'Docs', href: '/docs' }]
   */

  // TODO: Fill these
  const resourceLinks: ResourceLink[] = [
    {
      title: '',
      href: '',
    },
    {
      title: '',
      href: '',
    },
    {
      title: '',
      href: '',
    },
    {
      title: '',
      href: '',
    },
  ];

  /**
   * List of social media or contact links to be shown in the footer.
   * Each link includes a name, URL, icon component, icon size, and ARIA label for accessibility.
   * @type {SocialLink[]}
   * @example
   * [{ name: 'GitHub', href: 'https://github.com/', icon: Github, size: 28, ariaLabel: 'GitHub' }]
   */

  // TODO: Fill these
  const socialLinks: SocialLink[] = [
    {
      name: 'Website',
      href: '',
      icon: Globe,
      size: 28,
      ariaLabel: 'Website',
    },
    {
      name: 'GitHub',
      href: '',
      icon: Github,
      size: 28,
      ariaLabel: 'GitHub',
    },
    {
      name: 'Email',
      href: '',
      icon: Mail,
      size: 28,
      ariaLabel: 'Email',
    },
  ];

  return (
    <footer className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md py-lg px-md mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2xl">
          <div className="flex flex-col">
            <h6>{companyInfo.name}</h6>
            <p className="text-small mt-2xs">{companyInfo.slogan}</p>
            <p className="text-small text-neutral-500">
              &copy; {currentYear} {companyInfo.name}
            </p>
          </div>

          {/* Resources */}
          <div>
            <h6>Resources</h6>
            <nav className="mt-2xs">
              <ul className="flex flex-col">
                {resourceLinks.map((link, index) => (
                  <li key={`resource-${index}`} className="text-small">
                    <Link href={link.href}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h6 className="mb-md">Connect</h6>
            <address className="not-italic">
              <div className="flex items-center gap-xs">
                {socialLinks.map((link, index) => (
                  <Link
                    key={`social-${index}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="text-neutral-900 dark:text-neutral-100 hover:text-primary-700 dark:hover:text-primary-500 transition-colors duration-200"
                  >
                    <link.icon size={link.size} strokeWidth={1.75} />
                  </Link>
                ))}
              </div>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
};
