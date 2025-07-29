/**
 * Pricing plans for the product.
 *
 * Each plan object contains:
 *  - title: The name of the plan.
 *  - price: The price of the plan (string, e.g., 'Free', '$20', 'Custom').
 *  - description: A short description of the plan.
 *  - features: An array of strings listing the features included in the plan.
 *  - cta: The call-to-action text for the plan's button.
 */
export const pricing = [
  {
    title: 'Hobby',
    price: 'Free',
    description: 'For personal use and small projects.',
    features: ['Up to 1 user', '1 project', 'Community support'],
    cta: 'Get started for free',
  },
  {
    title: 'Pro',
    price: '$20',
    description: 'For professionals and growing teams.',
    features: ['Up to 10 users', 'Unlimited projects', 'Priority support'],
    cta: 'Get started with Pro',
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'For organizations with custom needs.',
    features: ['Unlimited users', 'Dedicated manager', '24/7 support'],
    cta: 'Contact sales',
  },
];
