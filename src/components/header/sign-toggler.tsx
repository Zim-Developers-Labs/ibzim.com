type Props = {
  bgColor?: string;
  textColor?: string;
  linkText?: string;
};

export function SignToggler({ bgColor, linkText, textColor }: Props) {
  return (
    <div
      className={`group block h-fit cursor-pointer rounded-md px-4 py-2 text-sm ${
        bgColor
          ? `text-[${textColor}] bg-[${bgColor}] hover:bg-[${bgColor}]/85`
          : 'bg-teal-400 text-zinc-900 hover:bg-teal-500'
      }`}
    >
      <span className="inline group-hover:hidden">
        {linkText ? linkText : 'Login / Register'}
      </span>
      <span className="hidden group-hover:inline">Coming Soon 😊</span>
    </div>
  );
}
