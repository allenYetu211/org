'use client';

import { Divider, Chip } from '@/components/base';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type StatusType = 'Done' | 'In progress' | 'Not started';

enum StateToChip {
  'Done' = 'success',
  'In progress' = 'progress',
  'Not started' = 'info',
}

export default function MainView() {
  const router = useRouter();
  const [{ loading, notions }, setNotions] = useState<{
    loading: boolean;
    notions: any[];
  }>({
    loading: true,
    notions: [],
  });
  const isDynamic = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!isDynamic.current) {
        isDynamic.current = true;
        const response = await getNotions();
        setNotions({
          loading: false,
          notions: response,
        });
      }
    })();
  }, []);

  async function getNotions() {
    const res = await fetch(`http://localhost:3000/api/notion`);
    const notions = await res.json();
    return notions;
  }

  return (
    <div>
      {loading && <div>Loading...</div>}

      {notions.map((notion, index) => {
        return (
          <div
            onClick={() => {
              router.push(`notion/${notion.pageId}`);
            }}
            key={notion.pageId}
            className="cursor-pointer"
          >
            <div className="text-[18px] flex justify-between items-center">
              {notion.title}

              <Chip iconType={StateToChip[notion.status as StatusType]}>
                <span className="text-[10px]">
                  {notion.status.toUpperCase()}
                </span>
              </Chip>
            </div>

            <p className="text-[10px]">
              {notion.introduce || 'There is no introduction at the moment 😊'}
            </p>

            {index === notions.length - 1 ? null : (
              <Divider className="my-[15px]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
