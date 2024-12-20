import { ExternalLinkIcon } from "@bloomreach/react-banana-ui";
import BrDiscoveryLogo from "./assets/br-experience-discovery-full.svg";

export const Footer = () => {
  return (
    <div className="footer mt-4 border-t p-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-4 md:flex-row md:gap-2">
        <div className="flex flex-col gap-4 md:w-64">
          <div className="text-lg font-semibold">
            <img src={BrDiscoveryLogo} className="w-32"/>
          </div>
          <p className="text-sm">
            E-commerce search and merchandising focussed on maximizing revenue
          </p>
          <a
            href="https://www.bloomreach.com/en/request-demo"
            target="_blank"
            className="self-start font-semibold bg-[#00b2db] py-2 px-8 text-center text-white rounded-full hover:bg-[#1ebee6] active:bg-[#0ca8cc]"
          >
            Get in touch
          </a>
        </div>
        <div className="md:w-64">
          <div className="text-md font-semibold mb-2">About</div>
          <p className="text-sm">
            This code sample shows how to setup catalogs with multiple languages
          </p>
          <div className="my-2 text-sm">
            <a
              target="_blank"
              className="text-slate-500 hover:underline"
              href="https://github.com/bloomreach/web-code-samples/tree/main/examples/multi-language"
            >
              See the source on Github
              {' '}
              <ExternalLinkIcon className="inline" size={12}/>
            </a>
          </div>
        </div>
        <div className="grow">
          <div className="text-md font-semibold mb-2">Related documentation</div>
          <ul className="list-none text-sm flex flex-col gap-2">
            <li>
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://documentation.bloomreach.com/discovery/docs/multi-language"
              >
                Multi-language Support
                {' '}
                <ExternalLinkIcon className="inline" size={12}/>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://documentation.bloomreach.com/discovery/docs/multi-language-site-integration"
              >
                Multi-language site integration
                {' '}
                <ExternalLinkIcon className="inline" size={12}/>
              </a>
            </li>
          </ul>
        </div>
        <div className="grow">
          <div className="text-md font-semibold mb-2">
            Developer resources
          </div>
          <ul className="list-none text-sm flex flex-col gap-2">
            <li>
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://documentation.bloomreach.com/discovery/docs/discovery-sdks"
                rel="noreferrer"
              >
                Bloomreach SDK
                {' '}
                <ExternalLinkIcon className="inline" size={12}/>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://bloomreach.github.io/limitless-ui-react"
                rel="noreferrer"
              >
                Limitless commerce UI kit
                {' '}
                <ExternalLinkIcon className="inline" size={12}/>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://documentation.bloomreach.com/discovery/docs/discovery-web-code-samples"
                rel="noreferrer"
              >
                Web code samples
                {' '}
                <ExternalLinkIcon className="inline" size={12}/>
              </a>
            </li>
            <li>
              <a
                target="_blank"
                className="text-slate-500 hover:underline"
                href="https://github.com/bloomreach/sample-catalogs"
                rel="noreferrer"
              >
                Sample catalogs
                {' '}
                <ExternalLinkIcon className="inline" size={12}/>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
