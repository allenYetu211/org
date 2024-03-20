import dynamic from 'next/dynamic';

const MediaView = dynamic(() => import('@/view/media'), {
  ssr: false,
});

export default function MediaPage() {
  return <MediaView />;
}
