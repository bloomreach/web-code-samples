import { useState, useEffect } from "react";
import {
  account_id,
  domain_key,
  visual_search_widget_id,
} from "../config";

function useVisualSearchApi(imageId: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!imageId) {
      return;
    }
    setLoading(true);
    setData(null);
    setError(null);
    const controller = new AbortController()
    const signal = controller.signal

    fetch(constructUrl(imageId), {signal})
      .then(data => data.json())
      .then((res) => {
        setLoading(false);
        setData(res);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
    return () => {
      controller.abort();
    };
  }, [imageId]);

  return { data, loading, error };
}

const constructUrl = (imageId: string, objectId = "-1") => {
  const uid = encodeURIComponent(`uid=12345:v=11.8:ts=${Date.now()}:hc=3`);

  const params = new URLSearchParams({
    _br_uid_2: uid,
    account_id: account_id,
    domain_key: domain_key,
    api_type: "visual_search",
    url: "https://example.com",
    ref_url: "https://example.com",
    image_id: imageId,
    object_id: objectId,
    fields:
      "pid,score,is_live,title,description,brand,price,price_range,sale_price,sale_price_range,url,promotions,thumb_image,skuid,sku_color,sku_size,sku_thumb_images,sku_swatch_images,sku_price,sku_sale_price,onSale,inStock",
  });

  return `https://pathways.dxpapi.com/api/v2/widgets/visual/search/${visual_search_widget_id}?${params.toString()}`;
};

export default useVisualSearchApi;
