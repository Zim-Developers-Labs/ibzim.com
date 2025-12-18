import { CheckIcon } from '@heroicons/react/24/outline';

const features = {
  personal: [
    'Ad free article reading experience.',
    'Longer content: comments and reviews.',
    'Add up to 3 entities on the compare tool.',
    'Post up to 10 events/month on IBZIM Calendar',
    'Higher income potential on IBZIM earn.',
    'Play songs directly on billboard.ibzim.com',
    'Access to our annual IBZIM Magazines.',
    'Unlimited Content Requests.',
    'Access to premium Articles.',
    'Downloadable content (Articles, magazines, videos).',
    'Early access to tools and articles.',
  ],
  business: [
    'Everything in Personal.',
    'Unlimited events on IBZIM Calendar.',
    'Lower charges on withdrawals and transactions.',
    'View figures on voting statistics.',
    'Deeper analytics on content performance.',
    'Withdraw and convert Peya Peya fantasy points to cash.',
  ],
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function PremiumBenefits({ subType }: { subType: string }) {
  return (
    <div className="mx-auto mb-20 max-w-7xl px-4 pt-16 md:px-8 xl:grid xl:grid-cols-3 xl:gap-x-8">
      <div>
        <p className="text-primaryColor tracking-wider">Your Plus Bundle</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Premium Benefits
        </h2>
        <p className="mt-4 text-zinc-800">
          At IBZIM the goal as always is{' '}
          <span className="font-bold">empowering users with knowledge</span>. In
          addition to it we offer extra value with the premium membership
          bundle.
        </p>
      </div>
      <div className="mt-4 sm:mt-8 md:mt-10 md:grid md:grid-cols-2 md:gap-x-8 xl:col-span-2 xl:mt-0">
        {subType === 'personal' && (
          <ul role="list" className="divide-y divide-gray-200">
            {features.personal.slice(0, 6).map((feature, featureIdx) => (
              <li
                key={feature}
                className={classNames(
                  featureIdx === 0 ? 'md:py-0 md:pb-4' : '',
                  'flex py-4',
                )}
              >
                <CheckIcon
                  aria-hidden="true"
                  className="size-6 shrink-0 text-green-500"
                />
                <span className="ml-3 text-base text-gray-500">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        {subType === 'personal' && (
          <ul
            role="list"
            className="divide-y divide-gray-200 border-t border-gray-200 md:border-t-0"
          >
            {features.personal.slice(6).map((feature, featureIdx) => (
              <li
                key={feature}
                className={classNames(
                  featureIdx === 0 ? 'md:border-t-0 md:py-0 md:pb-4' : '',
                  'flex py-4',
                )}
              >
                <CheckIcon
                  aria-hidden="true"
                  className="size-6 shrink-0 text-green-500"
                />
                <span className="ml-3 text-base text-gray-500">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {subType === 'business' && (
          <ul role="list" className="divide-y divide-gray-200">
            {features.business.slice(0, 3).map((feature, featureIdx) => (
              <li
                key={feature}
                className={classNames(
                  featureIdx === 0 ? 'md:py-0 md:pb-4' : '',
                  'flex py-4',
                )}
              >
                <CheckIcon
                  aria-hidden="true"
                  className="size-6 shrink-0 text-green-500"
                />
                <span className="ml-3 text-base text-gray-500">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        {subType === 'business' && (
          <ul
            role="list"
            className="divide-y divide-gray-200 border-t border-gray-200 md:border-t-0"
          >
            {features.business.slice(3).map((feature, featureIdx) => (
              <li
                key={feature}
                className={classNames(
                  featureIdx === 0 ? 'md:border-t-0 md:py-0 md:pb-4' : '',
                  'flex py-4',
                )}
              >
                <CheckIcon
                  aria-hidden="true"
                  className="size-6 shrink-0 text-green-500"
                />
                <span className="ml-3 text-base text-gray-500">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
