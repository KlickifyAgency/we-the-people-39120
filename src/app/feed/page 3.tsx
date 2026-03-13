import { Header } from '@/components/layout/Header';
import { PublicFeed } from '@/components/citizen/PublicFeed';

export default function FeedPage() {
  return (
    <>
      <Header title="Community Feed" subtitle="Natchez, MS 39120" />
      <div className="h-[calc(100vh-8rem)]">
        <PublicFeed />
      </div>
    </>
  );
}
