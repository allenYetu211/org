import dynamic from 'next/dynamic';

const MainView = dynamic(() => import('@/view/main'), {
  ssr: false,
});

export default function MainPage() {
  return (
    <div className="w-2/3 m-auto py-4">
      <MainView />
    </div>
  );
}
