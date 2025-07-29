/**
 * Landing Page Component
 *
 * This component renders the main landing page for the developer workspace platform.
 * It includes the following sections:
 *  - Hero section with headline, description, and call-to-action button
 *  - Features grid showcasing platform capabilities
 *  - Workflow highlight section
 *  - "Get started in minutes" steps
 *  - Pricing plans
 *  - Blog highlights
 *
 * Data for features, pricing, how it works, and blogs are imported from their respective modules.
 * UI components are imported from the component library and Lucide icons.
 */

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { features } from '@/lib/features';
import { pricing } from '@/lib/pricing';
import { howWorks } from '@/lib/howWorks';
import { blogs } from '@/lib/blogs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';

/**
 * Landing
 *
 * The main landing page functional component.
 */
const Landing: React.FC = () => {
  return (
    <main className="flex flex-col gap-18">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center gap-lg">
        <h1 className="md:w-3/4 text-center">The dev workspace that keeps up with you.</h1>
        <p className="md:w-3/4 text-center text-neutral-700 dark:text-neutral-300">
          A single platform to organize code, manage tasks, and document projects helping developers
          streamline their workflow and deliver results faster.
        </p>

        {/* Call-to-Action Button */}
        <Link href="">
          <Button className="mb-lg">Get started for free</Button>
        </Link>

        {/* Features Grid */}
        <section className="grid grid-cols-6 gap-md w-full">
          {features.map((feature, index) => (
            <Card key={index} className={feature.colSpan}>
              <CardHeader>
                <CardTitle className="flex gap-xs items-center">
                  <div className="p-2xs bg-neutral-300 dark:bg-neutral-700 rounded-sm">
                    {feature.icon && (
                      <span className="text-neutral-700 dark:text-neutral-300">{feature.icon}</span>
                    )}
                  </div>
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-small">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  width={1920}
                  height={900}
                  alt={`${feature.title} illustration`}
                  className="object-cover rounded-md"
                  src={feature.imageSrc}
                />
              </CardContent>
            </Card>
          ))}
        </section>
      </section>

      {/* Workflow Highlight Section */}
      <section className="w-full flex flex-col items-center gap-lg bg-primary-300 dark:bg-primary-700 p-xl rounded-md">
        <h2 className="md:w-3/4 text-center">
          Better workflows <br /> make better <span className="italic">things.</span>
        </h2>
      </section>

      {/* How It Works Section */}
      <section className="w-full flex flex-col items-center gap-lg">
        <h3 className="text-center w-3/4">Get started in minutes</h3>
        <p className="w-3/4 text-center text-neutral-700 dark:text-neutral-300">
          Start working instantly with code, docs, and tasks
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md w-full">
          {howWorks.map((step, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col items-center text-center gap-xs">
                <div className="p-md bg-neutral-300 dark:bg-neutral-700 rounded-full text-neutral-700 dark:text-primary-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-neutral-700 dark:text-neutral-300 text-small">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full flex flex-col items-center gap-lg">
        <h2 className="w-3/4 text-center">Pricing</h2>
        <p className="w-3/4 text-center text-neutral-700 dark:text-neutral-300">
          Choose a plan that works for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md w-full">
          {pricing.map((tier, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{tier.title}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-lg">
                <div className="flex items-baseline gap-xs">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="text-neutral-500">/ month</span>}
                </div>
                <ul className="flex flex-col gap-sm">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-xs">
                      <Check className="w-4 h-4 text-primary-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button>{tier.cta}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog Highlights Section */}
      <section className="w-full flex flex-col items-center gap-lg">
        <h2 className="w-3/4 text-center">From our Blog</h2>
        <p className="w-3/4 text-center text-neutral-700 dark:text-neutral-300">
          Tips, tricks, and updates from our team.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md w-full">
          {blogs.map((post, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-700 text-small dark:text-neutral-300">{post.excerpt}</p>
                <Link href={post.link} className="flex items-center text-small gap-2xs">
                  Read more <ArrowRight size={14} />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Landing;
