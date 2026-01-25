import { Icons } from '@/components/icons';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

const policies = [
  {
    name: 'Privacy Policy',
    description:
      'Explains what information we collect and why, how we use it, and how to review and update it.',
    link: {
      text: 'Read our Privacy Policy',
      url: '/policies/privacy',
    },
    icon: Icons.privacyPolicyIcon,
  },
  {
    name: 'Terms and Conditions',
    description: 'Describes the rules you agree to when using our platform.',
    link: {
      text: 'Read our Terms and Condition',
      url: '/policies/terms',
    },
    icon: Icons.termsIcon,
  },
  {
    name: 'Commenting Policy',
    description:
      'Guidelines on how to contribute to our safe commenting space.',
    link: {
      text: 'Read our Commenting Policy',
      url: '/policies/commenting',
    },
    icon: Icons.commentsPolicyIcon,
  },
  {
    name: 'Disclaimer',
    description:
      'What you must know before you take action based on information on IBZim.',
    link: {
      text: 'Read full disclaimer',
      url: '/policies/disclaimer',
    },
    icon: Icons.disclaimerIcon,
  },
];

export default function PoliciesPageComponent() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-light">Our Policies</h1>
      <div className="mx-auto grid max-w-screen-lg grid-cols-1 gap-6 md:grid-cols-2">
        {policies.map((policy) => {
          const Icon = policy.icon;
          return (
            <div
              key={policy.name}
              className="flex h-full flex-col items-center overflow-hidden rounded-lg bg-white px-8 py-12"
            >
              <Icon className="text-primaryColor mb-4 h-10 w-10" />
              <h2 className="mb-2 text-xl">{policy.name}</h2>
              <p className="mb-4 text-center text-sm text-gray-600">
                {policy.description}
              </p>
              <Link
                href={policy.link.url}
                className="text-primaryColor flex w-fit items-center gap-2 rounded-md px-4 py-2 text-center transition duration-150 ease-in-out"
              >
                {policy.link.text}
                <ChevronRightIcon className="h-4 w-fit" />
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
