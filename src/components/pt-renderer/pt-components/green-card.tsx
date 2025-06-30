import PtRenderer from '..';
import { Icons } from '@/components/icons';

export default function blockGreenCard(props: any) {
  const { title = '', body = {} } = props;
  return (
    <aside className="width-full relative my-8 rounded-xl border-2 border-teal-500 p-4">
      <div className="absolute top-0 left-1/2 grid h-10 w-10 -translate-x-[50%] -translate-y-4 place-content-center rounded-full border-2 border-teal-500 bg-white">
        <Icons.shieldCheck className="h-8 w-8 text-teal-600" />
      </div>
      <span className="mb-2 block font-bold text-teal-600">{title}</span>
      <div className="text-accent-6 text-sm">
        <PtRenderer body={body} />
      </div>
    </aside>
  );
}
