import { Header } from '@/components/layout/Header';
import { PublicFeed } from '@/components/citizen/PublicFeed';

export default function MapPage() {
  return (
    <>
      <Header showLogo />
      <div className="h-[calc(100vh-8rem)]">
        <PublicFeed />
      </div>
    </>
  );
}
