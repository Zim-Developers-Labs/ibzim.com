import "../globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { getSearchData } from "@/lib/sanity/actions";
import { siteConfig } from "@/lib/config";
import { Toaster } from "@/components/ui/sonner";
import Banner from "@/components/banner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IBZim Blog",
  description: "An IB Global iBlog",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { allArticles, popularArticles } = await getSearchData(
    siteConfig.popularArticleIds,
    siteConfig.documentPrefix
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body>
        <Toaster />
          <Banner />
          <Header
            articles={allArticles}
            popularArticles={popularArticles}
          />
          {children}
          <Footer siteShortName={siteConfig.shortName} />
        <Analytics />
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={process.env.GA_SECRET!} />
        {/* <Suspense fallback={null}>
          <GoogleAdsense pId={process.env.P_ID} />
        </Suspense> */}
      </body>
    </html>
  );
}
