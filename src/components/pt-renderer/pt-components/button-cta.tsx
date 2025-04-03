import { ExternalLink } from 'lucide-react';

export default function blockButtonCta(props: any) {
  const { type = '', text = '', linkUrl = '' } = props;

  if (type != 'twoButton') {
    return (
      <button
        className="block w-full rounded-md bg-gradient-to-tr from-[#424242] via-[#000] to-[#424242] py-4 text-center text-white hover:bg-gradient-to-tl"
        onClick={() => {
          window.open(`${linkUrl}`, '_blank');
        }}
      >
        {text} <ExternalLink className="hidden h-4 w-4 sm:inline" />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        window.open(`${linkUrl}`, '_blank');
      }}
    >
      {text}
    </button>
  );
}
