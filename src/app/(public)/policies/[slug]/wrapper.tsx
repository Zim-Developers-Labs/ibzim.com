import Container from "@/components/container";
import PtRenderer from "@/components/pt-renderer";
import { PolicyType } from "@/types";
import { LinkIcon } from "lucide-react";
import Link from "next/link";

export default function PolicyLayout({ policy }: { policy: PolicyType }) {
  return (
    <Container className="w-full">
      <div className="grid-cols-[100%] grid min-w-full md:grid-cols-[28%_72%]">
        <div className="hidden md:block">
          <SideBar policy={policy} />
        </div>
        <main className="pl-6 mt-[10px] pt-4">
          <div className="flex items-center gap-2">
            <Link href="/policies" className="block">
              Policies
            </Link>
            <div>/</div>
            <h1 className="text-gray-600">{policy.name}</h1>
          </div>
          <PtRenderer body={policy.body} />
        </main>
      </div>
    </Container>
  );
}

function SideBar({ policy }: { policy: PolicyType }) {
  return (
    <div className="h-full relative pt-[10px]">
      <div className="sticky top-[60px]">
        <div className="w-full text-sm border border-gray-200 rounded-lg px-4 py-6">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
            <span className="mb-3 block text-lg font-[500]">
              Table of Contents
            </span>
            <nav id="tbl_contents">
              {policy.subHeadings?.map((subHeading, index) => (
                <Link
                  key={index}
                  href={`#${encodeURIComponent(subHeading.title)}`}
                  className="hover:text-primaryColor hover:font-semibold mb-4 text-[15px] flex items-center text-sm"
                >
                  {subHeading.type === "h2" && (
                    <div className="h-4 w-4 mr-2">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                  )}

                  {subHeading.type === "h3" && (
                    <>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </>
                  )}
                  {subHeading.type === "h4" && (
                    <>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </>
                  )}

                  <span>{subHeading.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
