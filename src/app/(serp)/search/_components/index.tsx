import Container from '@/components/container';

export default function SERPageComponents({ q }: { q: string }) {
  return (
    <div className="relative w-full bg-zinc-100">
      <div className="from-primaryColor/25 via-secondaryColor/5 flex h-screen w-full flex-col justify-start bg-gradient-to-b to-transparent pt-28">
        <Container>
          <div>query = {q}</div>
        </Container>
      </div>
    </div>
  );
}
