export default function Answer({ children }: any) {
  return (
    <div className="text-md text-primary rounded-br-md rounded-bl-md bg-zinc-100 p-2 text-left text-sm leading-relaxed sm:p-4 sm:text-base">
      {children}
    </div>
  );
}
