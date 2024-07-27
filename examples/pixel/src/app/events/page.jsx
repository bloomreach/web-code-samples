'use client';

import JsonView from '@uiw/react-json-view';
import { Button } from '@bloomreach/react-banana-ui';
import useDataLayer from '../../hooks/useDataLayer';

export default function Page() {
  const { events, clearEvents } = useDataLayer();

  return (
    <div>
      <div className="container py-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Pixel events</h1>
              <p className="text-gray-500 dark:text-gray-400">
                View the last 25 pixel events
              </p>
            </div>
            <Button type="secondary" onClick={clearEvents}>Clear</Button>

          </div>
          <div className="flex flex-col gap-4">
            <JsonView value={events} collapsed={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
