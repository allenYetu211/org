import dynamic from 'next/dynamic';

const NotionView = dynamic(() => import('@/view/notion'), {
  ssr: false,
});

export default function NotionPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-2/3 m-auto py-4">
      <NotionView id={params.id} />
    </div>
  );
}
