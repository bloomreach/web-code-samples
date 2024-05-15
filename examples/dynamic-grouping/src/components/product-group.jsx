import { Tooltip } from "@bloomreach/react-banana-ui";
import { Price } from "./price";

export const ProductGroup = ({ group }) => {
  return (
    <div className="p-2 shadow-md rounded-md border border-slate-100 w-56">
      <div className="text-md font-semibold mb-1">
        {group.groupValue || <div>&lt;no name&gt;</div>}
      </div>
      <div className="text-xs text-slate-600">
        {group.doclist.numFound}{" "}
        {group.doclist.numFound === 1 ? "product" : "products"}
      </div>
      <div className="grid grid-cols-3 auto-rows-max gap-2 mt-2">
        {group.doclist.docs.map((product, index) => (
          <div className="flex flex-col w-16" key={product.pid}>
            <Tooltip
              title={
                <>
                  <div className="text-sm font-semibold">{product.title}</div>
                  <Price className="text-sm" product={product} />{" "}
                </>
              }
            >
              <div className="w-full rounded-md overflow-hidden border border-slate-200">
                <img src={product.thumb_image} className="w-full" />
              </div>
            </Tooltip>
          </div>
        ))}
        {group.doclist.numFound > group.doclist.docs.length ? (
          <div className="flex flex-col gap-2 w-16 rounded-md border border-slate-200">
            <div className="p-2 text-xs overflow-hidden">
              <div>+ {group.doclist.numFound - group.doclist.docs.length}</div>
              <div>more</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
