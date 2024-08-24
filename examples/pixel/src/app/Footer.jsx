import { ExternalLinkIcon } from '@bloomreach/react-banana-ui';

export function Footer() {
  return (
    <div className="footer mt-4 border-t p-4">
      <div className="max-w-5xl mx-auto flex flex-row gap-4">
        <div className="flex flex-col gap-4 w-80">
          <div className="text-lg font-semibold">
            <img src="/br-experience-discovery-full.svg" alt="" className="w-32" />
          </div>
          <p className="text-sm">
            E-commerce search and merchandising focussed on maximizing revenue
          </p>
          <a
            href="https://www.bloomreach.com/en/request-demo"
            target="_blank"
            className={`
            self-start font-semibold bg-[#00b2db] py-2 px-8 text-center text-white
            rounded-full hover:bg-[#1ebee6] active:bg-[#0ca8cc]
            `}
            rel="noreferrer"
          >
            Get in touch
          </a>
        </div>
        <div className="w-64">
          <div className="text-md font-semibold mb-2">About</div>
          <p className="text-sm">
            This code sample shows how to instrument pixel across a simple storefront
          </p>
          <div className="my-2 text-sm">
            <a
              target="_blank"
              className="text-slate-500 hover:underline flex flex-row gap-2 items-center"
              href="https://github.com/bloomreach/web-code-samples/tree/main/examples/pixel"
              rel="noreferrer"
            >
              See the source on Github
              {' '}
              <ExternalLinkIcon size={12} />
            </a>
          </div>
          <div className="my-2 text-sm">
            <a
              target="_blank"
              className="text-slate-500 hover:underline flex flex-row gap-2 items-center"
              href="https://github.com/bloomreach/web-code-samples"
              rel="noreferrer"
            >
              See other code samples
              {' '}
              <ExternalLinkIcon size={12} />
            </a>
          </div>
        </div>
        <div className="grow">
          <div className="text-md font-semibold mb-2">
            Related documentation
          </div>
          <ul className="list-none text-sm">
            <li className="mb-2">
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://documentation.bloomreach.com/discovery/docs/pixel-overview"
                rel="noreferrer"
              >
                Pixel overview
              </a>
            </li>
            <li className="mb-2">
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://documentation.bloomreach.com/discovery/docs/pixel-reference"
                rel="noreferrer"
              >
                Pixel reference
              </a>
            </li>
            <li className="mb-2">
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://documentation.bloomreach.com/discovery/docs/virtual-page-view-pixel"
                rel="noreferrer"
              >
                Single page application tracking
              </a>
            </li>
            <li className="mb-2">
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://documentation.bloomreach.com/discovery/docs/using-tag-manager"
                rel="noreferrer"
              >
                Tag manager pixel integration
              </a>
            </li>
            <li className="mb-2">
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://documentation.bloomreach.com/discovery/docs/bloomreach-discovery-sdk-1"
                rel="noreferrer"
              >
                Bloomreach SDK
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
