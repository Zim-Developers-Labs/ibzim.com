import Link from 'next/link';
import Container from '../container';
import { navigation } from './constants';
import { Icons } from '../icons';

function NavItem(navitem: { name: string; slug: string; type?: string }) {
  return (
    <div>
      <Link
        href={navitem.slug}
        className="border-primaryColor hover:text-primaryColor border-dotted text-sm leading-6 hover:border-b-2"
        rel={navitem.type === 'nofollow' ? 'nofollow' : ''}
      >
        {navitem.name}
      </Link>
    </div>
  );
}

type Props = {
  siteShortName: string;
};

export default function Footer({ siteShortName }: Props) {
  return (
    <footer className="z-50 block w-full bg-zinc-900 py-8 text-white md:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-8 border-b border-slate-600 pb-12 text-center md:pb-20 md:text-left lg:grid-cols-12">
          <div className="col-span-1 mx-auto w-fit md:mx-0 md:w-full lg:col-span-3">
            <Link href="https://www.xfinitypros.com" target="_blank">
              <span className="sr-only" aria-hidden="true">
                Xfinity Pros
              </span>
              <Icons.xfinityLogo className="hover:text-primaryColor h-[40px] w-[228px] text-white" />
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-9">
            <div className="grid grid-cols-1 gap-8 xl:col-span-2">
              <div className="mx-auto mb-8 grid grid-cols-2 gap-16 md:mx-0 md:grid-cols-4 md:gap-8">
                <div className="mt-10 md:mt-0">
                  <div className="text-left text-sm leading-6 font-semibold text-white">
                    Content
                  </div>
                  <div className="mt-6 flex flex-col items-start space-y-4">
                    {navigation.solutions.map((item) => (
                      <NavItem
                        name={item.name}
                        slug={item.href}
                        key={item.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-10 md:mt-0">
                  <div className="text-left text-sm leading-6 font-semibold text-white">
                    Company
                  </div>
                  <div className="mt-6 flex flex-col items-start space-y-4">
                    {navigation.company.map((item) => (
                      <NavItem
                        name={item.name}
                        slug={item.href}
                        key={item.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-10 md:mt-0">
                  <div className="text-left text-sm leading-6 font-semibold text-white">
                    Support
                  </div>
                  <div className="mt-6 flex flex-col items-start space-y-4">
                    {navigation.support.map((item) => (
                      <NavItem
                        name={item.name}
                        slug={item.href}
                        key={item.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-10 md:mt-0">
                  <div className="text-left text-sm leading-6 font-semibold text-white">
                    Platforms
                  </div>
                  <div className="mt-6 flex flex-col items-start space-y-4">
                    {navigation.platforms.map((item) => (
                      <NavItem
                        name={item.name}
                        slug={item.href}
                        key={item.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 pt-20 text-center md:gap-8">
          <div className="mx-auto flex space-x-6">
            {navigation.social.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-500 hover:text-gray-400"
                target="_blank"
                rel="nofollow"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </Link>
            ))}
          </div>
          <aside className="text-sm font-medium text-zinc-400">
            © 2023 - {new Date().getFullYear()} IBZim. ALL RIGHTS RESERVED.
          </aside>
          <aside className="text-sm text-zinc-400">
            {siteShortName} is among the federally registered trademarks of
            Xfinity Pros, Inc and may not be used by third parties without
            explicit permission. The display of third-party trademarks and trade
            names on this site does not necessarily indicate any affiliation or
            the endorsement of {siteShortName}. If you click an affiliate link
            and buy a product or service, we may be paid a fee by that merchant.
          </aside>
          <div className="mx-auto grid w-fit grid-cols-2 gap-4 text-xs text-zinc-400 md:grid-cols-5 md:gap-0">
            <Link
              href={`/policies/privacy`}
              className="hover:text-primaryColor col-span-1 block w-auto hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href={`/policies/terms`}
              className="hover:text-primaryColor col-span-1 block w-auto hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href={`/policies/disclaimer`}
              className="hover:text-primaryColor col-span-1 block w-auto hover:underline"
            >
              Disclaimer
            </Link>
            <Link
              href={`/policies/commenting`}
              className="hover:text-primaryColor col-span-1 block w-auto hover:underline"
            >
              Commenting Policy
            </Link>
            <Link
              href="#"
              className="hover:text-primaryColor col-span-2 block w-auto hover:underline sm:col-span-1"
            >
              Do Not Sell My Personal Information
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
