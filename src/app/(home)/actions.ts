'use server';

export async function getStarsCount(): Promise<number> {
  const data = await fetch(
    'https://api.github.com/repos/Zim-Developers-Labs/ibzim.com?v=1',
    {
      next: { revalidate: 86400 },
    },
  );
  const json = await data.json();

  return Number(json.stargazers_count);
}
