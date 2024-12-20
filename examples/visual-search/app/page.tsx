"use client";
import {useState, useEffect, useRef, ChangeEvent} from "react";
import {account_name, account_id, domain_key, visual_search_widget_id, sample_images} from "../config";
import { ProductCard, Theme } from "@bloomreach/limitless-ui-react";
import {
  ToggleField,
  InputField,
  Button,
  ExternalLinkIcon,
} from "@bloomreach/react-banana-ui";
import JsonView from "@uiw/react-json-view";
import useVisualSearchApi from "../hooks/useVisualSearchApi";
import { Footer } from "./Footer";

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageId, setImageId] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUrlChange = async (url?: string) => {
    const img = url || imageUrl;
    try {
      const response = await fetch(`/fetch-image-url?url=${img}`);
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], 'product-image');
        await uploadImage(file);
        setImageSrc(img);
      } else {
        throw new Error("Failed to fetch image")
      }
    } catch(err) {
      console.error(err);
      setUploadError("Failed to fetch image");
    }
  }

  const handleImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files && event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e?.target?.result) {
          setImageSrc(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
      await uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('image', file);

    const params = new URLSearchParams({
      account_id: account_id,
      domain_key: domain_key,
      api_type: "visual_search",
    });

    const url = `https://pathways.dxpapi.com/api/v2/widgets/visual/upload/${visual_search_widget_id}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const res = await response.json();
        setImageId(res.response.image_id);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      setUploading(false);
      setUploadError(null);
    } catch(err) {
      console.error("Failed to upload image", err);
      setUploading(false);
      setUploadError("Failed to upload image.");
    }
  };

  const searchWithImageUrl = (url: string) => {
    if (url) {
      setImageUrl(url);
      handleImageUrlChange(url);
    }
  }

  // Onload select a random image to search with
  useEffect(() => {
    const randomImage = sample_images[Math.floor(Math.random() * sample_images.length)];
    searchWithImageUrl(randomImage.image);
  }, [])

  const { loading, error, data } = useVisualSearchApi(imageId);

  return (
    <main className="min-h-screen flex flex-col">
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
      <div className="app p-2 max-w-5xl w-full mx-auto grow flex flex-col">
        <div className="flex gap-2 items-center mt-4 mb-8">
          <div className="flex gap-2 items-center grow">
            <a href="https://bloomreach.com" target="_blank">
              <img src="/br-logo-primary.svg" width={150} />
            </a>
            <span>✨</span>
            <div className="text-lg font-semibold text-[#002840]">
              Visual Search
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex flex-row gap-8 items-top">
            <div className="grow">
              <div className="flex flex-row gap-2">
                <div className="grow">
                  <InputField
                    placeholder="Paste image url"
                    inputProps={{id: "search-field"}}
                    value={imageUrl}
                    fullWidth
                    helperText={
                    <>
                      Try one of these images:
                      {" "}
                      {sample_images.map((item) => (
                        <span
                          key={item.label}
                          className="cursor-pointer px-1 mx-1 bg-blue-100 text-blue-600 hover:underline"
                          onClick={() => searchWithImageUrl(item.image)}
                        >
                            {item.label}
                          </span>
                      ))}
                    </>
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleImageUrlChange()}>Go</Button>
              </div>
            </div>
            <div className="rounded-full bg-[#ffd500] py-1 px-2 h-8 text-base font-semibold">
              OR
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                <div className="text-slate-500 text-xs">Try one of the images in the /public directory or upload your own</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 grow">
          <div className="w-64">
            {imageSrc && (<div>
                <div className="text-sm my-2">Search results for</div>
              <img src={imageSrc} alt="Image Preview" className="w-full" />
              </div>
            )}
          </div>
          {showJson ?
            <JsonView value={data} collapsed={1} /> :
          <Theme className="w-full">
            {uploadError ? <div className="text-sm text-rose-600">{uploadError}</div> : null}
            {uploading ? <div className="text-sm text-slate-500">Uploading image...</div> : null}
            {loading ? <div className="text-sm text-slate-500">Loading...</div> : null}
            {!loading && data?.response ? (
              <div className="w-full flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {data?.response?.docs?.map((product: any) => {
                    return (
                      <ProductCard.Root key={product.pid}>
                        <ProductCard.Header>
                          <ProductCard.Image src={product.thumb_image} alt={product.title}  />
                        </ProductCard.Header>
                        <ProductCard.Body>
                          <ProductCard.Title>{product.title}</ProductCard.Title>
                          {product.variants?.length > 1 ? (
                            <ProductCard.SubTitle>{`${product.variants.length} variants`}</ProductCard.SubTitle>
                          ) : null}
                        </ProductCard.Body>
                        <ProductCard.Footer>
                          <ProductCard.Price price={product.price} salePrice={product.sale_price} />
                        </ProductCard.Footer>
                      </ProductCard.Root>
                    );
                  })}
                </div>

                <div className="m-2 text-xs text-slate-600">
                  Showing {data.response.docs.length} of {data.response.numFound}
                </div>
              </div>

            ) : null}
          </Theme>
          }
        </div>
      </div>
      <Footer />
    </main>
  );
}
