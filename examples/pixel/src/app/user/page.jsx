'use client';

import JsonView from '@uiw/react-json-view';
import { useCookies } from 'react-cookie';
import { Button, InputField } from '@bloomreach/react-banana-ui';
import useAnalytics from '../../hooks/useAnalytics';
import { BR_COOKIE } from '../../constants';

export default function Page() {
  const { userId, setUserId } = useAnalytics();
  const [cookies, setCookie, removeCookie] = useCookies([BR_COOKIE]);

  const clearCookie = () => {
    removeCookie(BR_COOKIE);
  };

  return (
    <div className="container py-4">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Tracking identifiers
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg">User ID</h2>
          <InputField
            helperText={(
              <>
                Empty for guest user or set an ID to see how the user_id should be sent in the
                pixel events.
                <a
                  target="_blank"
                  className="text-blue-400 hover:underline"
                  href="https://documentation.bloomreach.com/discovery/docs/pixel-parameters-recommended-implementation"
                  rel="noreferrer"
                >
                  See reference for recommended usage
                </a>
              </>
            )}
            inputProps={{ id: 'user-id-field' }}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h2 className="text-lg">Cookie</h2>
            <Button
              onClick={clearCookie}
              tooltip={`Clears the ${BR_COOKIE} cookie, so it can be reset`}
            >
              Clear
            </Button>
          </div>
          <JsonView value={cookies} />
        </div>
      </div>
    </div>
  );
}
