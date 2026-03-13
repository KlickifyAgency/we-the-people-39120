'use client';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { useReports } from '@/hooks/useReports';

const MapView = dynamic(() => import('@/components/citizen/MapView'), { ssr: false });

export default function MapPage() {
  const { data: reports = [] } = useReports();
  return (
    <>
      <Header showLogo />
      <div className="h-[calc(100vh-8rem)]">
        <MapView reports={reports} />
      </div>
      <FloatingActionButton />
    </>
  );
}
