import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleField,
  Tooltip,
  InfoIcon,
} from "@bloomreach/react-banana-ui";
import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";

import "@bloomreach/react-banana-ui/style.css";
import { getDetails, getRecommendations } from "./api";
import { Price } from "./components/price";
import { products } from "./config";
import { Footer } from "./Footer";
import { account_id, account_name } from "./config";
import BrLogo from "./assets/br-logo-primary.svg";

import "./app.css";

export default function App() {
  const [showJson, setShowJson] = useState(false);
  const [pid, setPid] = useState(products[0].pid);
  const [details, setDetails] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    if (pid) {
      getDetails(pid).then((response) => {
        setDetails(response);
      });

      getRecommendations(pid).then((response) => {
        setSimilarProducts(response);
      });
    }
  }, [pid]);

  const product = details?.response?.docs[0];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#002840]">
        <div className="max-w-5xl mx-auto flex flex-row p-2 text-slate-300 text-xs items-center">
          <div className="grow">
            <span className="font-semibold">Account:</span> {account_name} (
            {account_id})
          </div>
          <ToggleField
            className="text-slate-300 toggle-field"
            label="Show JSON"
            inputProps={{id: "show-json-toggle"}}
            checked={showJson}
            onChange={() => setShowJson(!showJson)}
          />
        </div>
      </div>
      <div className="app p-2 max-w-5xl w-full mx-auto grow">
        <div className="flex gap-2 items-center mt-4 mb-8">
          <div className="flex gap-2 items-center grow text-lg">
            <a href="https://bloomreach.com" target="_blank">
              <img src={BrLogo} width={150} />
            </a>
            <span>✨</span>
            <div className="text-lg font-semibold text-[#002840]">
              Recommendations
            </div>
          </div>
        </div>

        <div>
          <ToggleButtonGroup
            value={pid}
            onChange={(e, newPid) => {
              setPid(newPid);
            }}
          >
            {products.map((product) => (
              <ToggleButton key={product.pid} value={product.pid}>
                <img src={product.preview} style={{ width: "16px" }} />
                {product.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <div className="flex flex-col gap-4 mt-4">
            <div className="w-full">
              {showJson ? (
                <JsonView value={details} collapsed={1} />
              ) : (
                <div>
                  {product ? (
                    <div className="flex flex-row gap-4">
                      <div className="w-96 gap-4 shadow-md rounded-md border border-slate-100 overflow-hidden">
                        <img
                          src={product.thumb_image}
                          alt=""
                          className="w-full"
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-96">
                        <h2 className="text-xl font-bold">{product.title}</h2>
                        <Price product={product} />
                        <p className="text-sm">{product.description}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="w-full">
              <div className="flex gap-2 my-2 items-center">
                <div className="text-md font-semibold">Similar products</div>
                <div>
                  <Tooltip title="This widget shows products similar to the product above">
                    <InfoIcon className="text-slate-500" />
                  </Tooltip>
                </div>
              </div>
              {showJson ? (
                <JsonView value={similarProducts} collapsed={1} />
              ) : (
                <div>
                  {similarProducts.response ? (
                    <div className="flex flex-row gap-4">
                      {similarProducts.response.docs.map((doc) => (
                        <div
                          className="m-2 w-48 shadow-md rounded-md border border-slate-100"
                          key={doc.pid}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="w-full rounded-t-md overflow-hidden border-b border-slate-200 ">
                              <img
                                src={doc.thumb_image}
                                className="mr-2 w-full"
                              />
                            </div>
                            <div className="p-2 pt-0">
                              <h3 className="text-sm font-bold">{doc.title}</h3>
                              <Price className="text-sm" product={doc} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
