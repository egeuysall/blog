'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  /**
   * The size (in pixels) for the header icon/logo.
   */
  const iconSize = 24;

  /**
   * The current year, used for dynamic copyright or display.
   */
  const currentYear = new Date().getFullYear();

  /**
   * The brand or site name to display in the header.
   * @type {string}
   */
  const brandName = '';

  /**
   * Logo image path or URL for the header.
   * @example '/logo.svg'
   */
  const logo = '';

  /**
   * The navigation menu items for the header.
   * Each item should have a unique id, a display title, and a link URL.
   */
  const menuItems = [
    { id: 1, title: '', link: '' },
    { id: 2, title: '', link: '' },
    { id: 3, title: '', link: '' },
    { id: 4, title: '', link: '' },
    { id: 5, title: '', link: '' },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Helper function to close the mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-lg left-0 right-0 z-10 flex justify-center px-2xl w-full">
      <div className="w-full">
        <header className="backdrop-blur-lg py-xs px-md rounded-md flex justify-between items-center border border-neutral-300 dark:border-neutral-700">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex gap-2xs items-center flex-shrink-0 no-underline"
          >
            <Image
              width={iconSize}
              height={iconSize}
              className="transition-opacity ease-in-out duration-200 hover:opacity-75"
              alt="Logo"
              src={logo}
            />
            <span className="font-heading font-semibold text-base text-neutral-900 dark:text-neutral-100 hidden md:flex transition-colors duration-200 hover:text-neutral-700 hover:dark:text-neutral-300 ease-in-out">
              {brandName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            {menuItems.map((item) => (
              <span key={item.id} className="text-small transition-colors duration-200 ease-in-out">
                <Link
                  href={item.link}
                  className="text-small text-neutral-700 dark:text-neutral-300 hover:no-underline hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-500 dark:hover:text-neutral-500 p-xs rounded-sm"
                >
                  {item.title}
                </Link>
              </span>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center text-neutral-900 dark:text-neutral-100 hover:opacity-75 transition-opacity ease-in-out duration-200"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={iconSize} /> : <Menu size={iconSize} />}
          </button>
        </header>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900 z-15 md:hidden flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-md border-b border-neutral-300 dark:border-neutral-700">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex gap-2xs items-center no-underline"
            >
              <Image
                width={iconSize}
                height={iconSize}
                className="transition-opacity duration-200 hover:opacity-75 ease-in-out"
                alt="Logo"
                src={logo}
              />
              <span className="font-heading font-semibold text-base text-neutral-900 dark:text-neutral-100 transition-colors duration-200 hover:text-neutral-700 hover:dark:text-neutral-300 ease-in-out">
                {brandName}
              </span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="flex md:hidden items-center justify-center text-neutral-900 dark:text-neutral-100 hover:opacity-75 transition-opacity ease-in-out duration-200 p-2xs"
              aria-label="Close menu"
            >
              <X size={iconSize} />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <nav className="flex-1 flex flex-col p-lg gap-sm overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.id}>
                <Link
                  href={item.link}
                  onClick={closeMobileMenu}
                  className="text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200 ease-in-out"
                >
                  <h5>{item.title}</h5>
                </Link>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="py-md text-center text-small text-neutral-700 dark:text-neutral-300 border-t border-neutral-300 dark:border-neutral-700">
            &copy; {currentYear} {brandName}
          </div>
        </div>
      )}
    </div>
  );
};
