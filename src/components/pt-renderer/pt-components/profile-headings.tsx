import { convertToSlug } from '@/lib/utils';

const PH1 = ({ children }: any) => {
  const id = convertToSlug(`${children}`);

  return (
    <h1 className="mb-5 text-[1.875rem] font-[800] md:text-5xl" id={id}>
      {children}
    </h1>
  );
};

const PH2 = ({ children }: any) => {
  const id = convertToSlug(`${children}`);

  return (
    <h2
      className="-mt-20 mb-5 w-full border-b border-zinc-200 pt-28 pb-4 text-2xl md:text-3xl"
      id={id}
    >
      {children}
    </h2>
  );
};

const PH3 = ({ children }: any) => {
  const id = convertToSlug(`${children}`);

  return (
    <h3 className="-mt-20 mb-5 pt-28 text-xl md:text-2xl" id={id}>
      {children}
    </h3>
  );
};

const PH4 = ({ children }: any) => {
  return (
    <h4 className="text-primaryColor mb-4 text-lg md:text-xl">{children}</h4>
  );
};

const PHeadings = {
  h1: PH1,
  h2: PH2,
  h3: PH3,
  h4: PH4,
};

export default PHeadings;
