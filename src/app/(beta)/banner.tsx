'use client';

export default function BetaBanner() {
  const handleBannerClick = () => {
    const whatsappMessageText = encodeURIComponent(
      `Hi, my name is [Your Name], and I am interested in learning more about the Zim Developers Community and how I can contribute to improving the Zimbabwean Tech Ecosystem.`,
    );
    const whatsappLink = `https://wa.me/+263717238876?text=${whatsappMessageText}`;

    window.open(whatsappLink, '_blank');
  };

  return (
    <aside role="banner" className="sticky top-0 z-50">
      <div
        className="flex items-center justify-center gap-2 bg-zinc-900 px-4 py-3 text-center text-white"
        role="alert"
      >
        <div className="text-xs">Launch Day Coming Soon</div>
        <button
          onClick={handleBannerClick}
          className="cursor-pointer rounded-full bg-white px-2 py-1 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-200"
        >
          Learn more
        </button>
      </div>
    </aside>
  );
}
