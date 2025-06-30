import Link from 'next/link';
import Container from '../container';
import { navigation } from './constants';
import { Icons } from '../icons';

function NavItem(navitem: { name: string; slug: string; type?: string }) {
  return (
    <li>
      <Link
        href={navitem.slug}
        className="border-primaryColor hover:text-primaryColor border-dotted text-sm leading-6 hover:border-b-2"
        rel={navitem.type === 'nofollow' ? 'nofollow' : ''}
      >
        {navitem.name}
      </Link>
    </li>
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
          <div className="col-span-1 lg:col-span-6">
            <div className="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 md:gap-8">
                <div className="mt-10 md:mt-0">
                  <div className="text-sm leading-6 font-semibold text-white">
                    Legal
                  </div>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.legal.map((item) => (
                      <NavItem
                        name={item.name}
                        slug={item.href}
                        key={item.name}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col items-center md:items-end lg:col-span-3 lg:justify-start">
            <div className="flex flex-col items-center gap-6 md:items-end">
              <div className="flex space-x-6">
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
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 pt-20 text-center md:gap-8">
          <p className="text-sm font-medium text-zinc-400">
            © 2023 - 2025 IBZim Blog. ALL RIGHTS RESERVED.
          </p>
          <p className="text-sm text-zinc-400">
            {siteShortName} is among the federally registered trademarks of
            Xfinity Pros, Inc and may not be used by third parties without
            explicit permission. The display of third-party trademarks and trade
            names on this site does not necessarily indicate any affiliation or
            the endorsement of {siteShortName}. If you click an affiliate link
            and buy a product or service, we may be paid a fee by that merchant.
          </p>
          <p></p>
        </div>
      </Container>
    </footer>
  );
}
