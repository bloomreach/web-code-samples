import {
  Alert,
  Button,
  ExternalLinkIcon,
  Modal,
  ModalBody,
  ModalHeader,
  ModalHeaderTitle,
  ToggleField,
} from '@bloomreach/react-banana-ui';
import { useEffect, useState } from 'react';
import JsonView from '@uiw/react-json-view';
import { account_id, account_name } from '../config';
import { useDeveloperTools } from '../hooks/useDeveloperTools';
import useAnalytics from '../hooks/useAnalytics';

export function DeveloperToolbar() {
  const { showJson, setShowJson } = useDeveloperTools();
  const { events, eventsCount, clearEvents } = useAnalytics();
  const [isInIframe, setIsInIframe] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    try {
      if (window !== window.top) {
        setIsInIframe(true);
      }
    } catch (error) {
      // Catch potential cross-origin errors
      setIsInIframe(true);
    }
  }, []);

  function handleShowEvents(e) {
    e.preventDefault();
    setShowEvents(true);
  }

  return (
    <>
      {isInIframe ? (
        <Alert type="warning">
          In an online code editor iframe preview, the cookie is not set in the correct domain. For the
          cookie to be set and sent in the pixel events to see the full set of features in this
          code sample, open the
          {' '}
          <a href="." target="_blank" className="text-blue-600 hover:underline">
            preview in a separate window
            {' '}
            <ExternalLinkIcon size={10} className="inline" />
          </a>
          {' '}
          or run the example locally.
        </Alert>
      ) : null}
      <div className="bg-[#002840]">
        <div
          className="max-w-5xl mx-auto flex flex-row gap-2 p-2 text-slate-300 text-xs items-center"
        >
          <div className="grow">
            <span className="font-semibold">Account:</span>
            {' '}
            {account_name}
            {' '}
            (
            {account_id}
            )
          </div>
          <div>
            <button
              type="button"
              onClick={handleShowEvents}
              className="flex text-xs gap-1 items-center hover:text-white"
            >
              Pixel events
              <span
                className="bg-[#ffd500] rounded-full px-2 ml-1 text-[#002840] font-bold"
              >
                {eventsCount > 25 ? '25+' : eventsCount}
              </span>
            </button>
          </div>
          <div>&middot;</div>
          <ToggleField
            className="text-slate-300 toggle-field"
            label="Show JSON"
            inputProps={{id: 'show-json-toggle'}}
            checked={showJson}
            onChange={() => setShowJson(!showJson)}
          />
          <a
            href="https://github.com/bloomreach/web-code-samples/discussions/new"
            target="_blank"
            className="flex gap-2 items-center font-semibold bg-amber-300 text-slate-800 mx-2 px-2 rounded"
          >
            Feedback
            <ExternalLinkIcon size={10}/>
          </a>
        </div>
      </div>
      <Modal
        open={showEvents}
        onClose={() => setShowEvents(false)}
        width="lg"
      >
        <ModalHeader>
          <div className="flex gap-4">
            <ModalHeaderTitle>
              Pixel events
            </ModalHeaderTitle>
            <Button type="secondary" onClick={clearEvents}>Clear all</Button>
          </div>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
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
        </ModalHeader>
        <ModalBody>
          <div className="min-h-40">
            <JsonView value={events} collapsed={2} />
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
