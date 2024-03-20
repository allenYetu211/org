'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/base';

export default function NotionView({ id }: { id: string }) {
  const router = useRouter();
  const [{ loading, detail }, setDetail] = useState<{
    loading: boolean;
    detail: any[];
  }>({
    loading: true,
    detail: [],
  });
  const isDynamic = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      console.log('isDynamic.current !', isDynamic.current);

      if (!isDynamic.current) {
        isDynamic.current = true;
        const response = await getNotionDetaile();
        setDetail({
          loading: false,
          detail: response,
        });
      }
    })();
  }, []);

  async function getNotionDetaile() {
    const res = await fetch(`http://localhost:3000/api/notion?id=${id}`);
    const detail = await res.json();
    return detail;
  }

  return (
    <div>
      {loading && <>Loading...</>}
      {detail.map((block, index) => {
        return (
          <div key={block.id} className="text-[14px]">
            {block.type === 'paragraph' && (
              <p>{block.paragraph.rich_text[0]?.plain_text}</p>
            )}

            {block.type === 'to_do' && (
              <Checkbox
                className="text-[12px]"
                size="sm"
                defaultSelected
                checked={block.to_do.checked}
              >
                {block.to_do.rich_text[0]?.plain_text}
              </Checkbox>
            )}
          </div>
        );
      })}
    </div>
  );
}
