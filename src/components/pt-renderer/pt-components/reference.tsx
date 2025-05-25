import { Icons } from '@/components/icons';

export default function annotationReference(props: any) {
  const {
    number,
    //  linkText,
    //   sourceTitle,
    //    datePublished,
    children,
    url,
  } = props;
  return (
    <a href={`#reference-${number}`} className="group relative inline">
      <span className="text-primaryColor hover:text-opacity-90 inline-flex text-sm">
        [{children}] {url?.endsWith('.pdf') && <Icons.pdfIcon />}
      </span>
      {/* <Suspense fallback={"...Loading"} aria-hidden="true">
        <span className="group-hover:block bg-white text-sm absolute z-50 hidden sm:left-0 w-[220px]">
          <span className="block rounded-lg shadow-md border border-accent-2">
            <span className="p-4 block">
              <span className="font-bold">{linkText}</span>{" "}
              <span className="">{sourceTitle}</span>{" "}
              <span className="italic block mt-2 text-zinc-600">
                {datePublished}
              </span>
            </span>
          </span>
        </span>
      </Suspense> */}
    </a>
  );
}
