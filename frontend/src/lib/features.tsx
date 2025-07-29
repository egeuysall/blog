/**
 * @file features.tsx
 * @description
 *   This file defines the list of product features displayed on the landing page.
 *   Each feature includes a title, description, icon, image source, and grid column span.
 *   The features array is used to render feature cards in the UI.
 */

import { BriefcaseBusiness } from 'lucide-react';

/**
 * Type definition for a single feature.
 * @typedef {Object} Feature
 * @property {string} title - The title of the feature.
 * @property {string} description - A short description of the feature.
 * @property {JSX.Element} icon - The icon representing the feature.
 * @property {string} imageSrc - The image source for the feature illustration.
 * @property {string} colSpan - The CSS grid column span for layout.
 */

/**
 * List of features to be displayed on the landing page.
 * Each feature object contains:
 *  - title: Name of the feature.
 *  - description: Short explanation of the feature.
 *  - icon: JSX element for the feature's icon.
 *  - imageSrc: Path to the feature's illustration image.
 *  - colSpan: CSS class for grid column span.
 */
export const features = [
  {
    title: 'Unified Workflow',
    description: 'Seamless integration of code, tasks, and docs.',
    icon: <BriefcaseBusiness size={18} />,
    imageSrc: '',
    colSpan: 'col-span-6 md:col-span-3 lg:col-span-2',
  },
  {
    title: 'Collaborative Projects',
    description: 'Work together in real-time with your team.',
    icon: <BriefcaseBusiness size={18} />,
    imageSrc: '',
    colSpan: 'col-span-6 md:col-span-3 lg:col-span-2',
  },
  {
    title: 'Automated Tasks',
    description: 'Save time with intelligent automation.',
    icon: <BriefcaseBusiness size={18} />,
    imageSrc: '',
    colSpan: 'col-span-6 md:col-span-3 lg:col-span-2',
  },
  {
    title: 'Insightful Analytics',
    description: 'Make data-driven decisions quickly.',
    icon: <BriefcaseBusiness size={18} />,
    imageSrc: '',
    colSpan: 'col-span-6 md:col-span-3',
  },
  {
    title: 'Flexible Integration',
    description: 'Connect with your favorite tools seamlessly.',
    icon: <BriefcaseBusiness size={18} />,
    imageSrc: '',
    colSpan: 'col-span-6 md:col-span-3',
  },
];

export default features;
