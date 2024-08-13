'use client';

import Link from 'next/link';
import JsonView from '@uiw/react-json-view';
import { ArrowLeftIcon, Button, ExternalLinkIcon } from '@bloomreach/react-banana-ui';
import useAnalytics from '../../hooks/useAnalytics';

export default function Page() {
  const { events, clearEvents } = useAnalytics();

  return (
    <div>
      <div className="container py-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-sm cursor-pointer text-blue-400 flex gap-2 hover:underline items-center">
                <ArrowLeftIcon />
                Back to home
              </Link>
              <h1 className="text-2xl font-bold">Pixel events</h1>
              <p className="text-gray-500 dark:text-gray-400">
                View the last 25 pixel events. See the events on the dashboard in
                {' '}
                <a
                  className="text-blue-400 hover:underline inline-flex flex-row gap-2 items-center"
                  href="https://tools.bloomreach.com/navapp/discovery/events/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Events Manager
                  <ExternalLinkIcon size={16} />
                </a>
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
