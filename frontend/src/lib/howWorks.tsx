/**
 * @file howWorks.tsx
 * @description
 *   This file defines the "How It Works" steps for the landing page.
 *   Each step includes an icon, title, and description to guide new users
 *   through the onboarding process.
 *
 *   The howWorks array is used to render a step-by-step guide in the UI.
 */

import { UserPlus, FolderPlus, Users } from 'lucide-react';

/**
 * Type definition for a single "How It Works" step.
 * @typedef {Object} HowItWorksStep
 * @property {JSX.Element} icon - The icon representing the step.
 * @property {string} title - The title of the step.
 * @property {string} description - A short description of the step.
 */

/**
 * List of steps to show users how to get started.
 * Each object contains:
 *  - icon: JSX element for the step's icon.
 *  - title: Name of the step.
 *  - description: Short explanation of the step.
 */
export const howWorks = [
  {
    icon: <UserPlus />,
    title: 'Create Your Account',
    description: 'Sign up in seconds. No credit card required to get started with our free plan.',
  },
  {
    icon: <FolderPlus />,
    title: 'Set Up Your First Project',
    description:
      'Organize your work into projects. Connect your code repository and define your tasks.',
  },
  {
    icon: <Users />,
    title: 'Start Collaborating',
    description: 'Invite your team, assign tasks, and start documenting your way to success.',
  },
];
