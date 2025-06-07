import React from 'react';
import care from '@/assets/images/kitchen.jpg';
import Image from 'next/image';

export const History = () => {
  return (
    <section>
      <div className='container pb-24'>
        <div className='h-96 w-full rounded-lg overflow-hidden'>
          <Image src={care} alt='' className='h-full w-full object-cover' />
        </div>
        <h1 className='text-3xl leading-tight tracking-tight sm:text-4xl mt-12'>
        InstaLabel&apos;s Inception: Born from Kitchen Challenges, Not Just Innovation
        </h1>
        <p className='mt-8 text-base leading-relaxed tracking-wide'>
        InstaLabel was born not from a desire to create just another tech solution, but from a genuine need we observed in kitchens: the challenge of managing expiry dates, allergen information, and ingredient details manually. As kitchens and restaurants grew more complex, we noticed inefficiencies and risks that could be easily mitigated with a simple, smart solution.
        </p>
        <p className='mt-4 text-base leading-relaxed tracking-wide'>
        Inspired by these real-world problems, we envisioned InstaLabel—a user-friendly platform that empowers restaurants to streamline their ingredient management with automated labeling. Using cutting-edge technology, we’ve created a solution that simplifies the process, minimizes waste, and ensures that food safety and compliance are always a top priority.
        </p>
        <p className='mt-4 text-base leading-relaxed tracking-wide'>
        Our journey started with a passion for helping kitchens improve their operations, and today, InstaLabel is revolutionizing the way food businesses track and manage ingredients. This is only the beginning of our mission: to provide kitchens with a smarter, simpler, and more reliable way to handle labeling, expiration dates, and allergen tracking.
        </p>
      </div>
    </section>
  );
};
