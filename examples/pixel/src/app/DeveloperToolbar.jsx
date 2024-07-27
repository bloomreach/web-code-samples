import Link from "next/link";
import {ToggleField} from "@bloomreach/react-banana-ui";
import {account_id, account_name} from "../config";
import {useDebugTools} from "../hooks/useDebugTools";
import useDataLayer from "../hooks/useDataLayer";

export const DeveloperToolbar = () => {
  const {showJson, setShowJson} = useDebugTools();
  const { events } = useDataLayer();

  return (
    <div className="bg-[#002840]">
      <div
        className="max-w-5xl mx-auto flex flex-row gap-2 p-2 text-slate-300 text-xs items-center">
        <div className="grow">
          <span className="font-semibold">Account:</span> {account_name} (
          {account_id})
        </div>
        <div>
          <Link href="/events" className="flex gap-1 hover:text-white">
            Pixel events
            <span
              className="bg-[#ffd500] rounded-full px-2 text-[#002840] font-bold">{events.length}</span>
          </Link>
        </div>
        <div>&middot;</div>
        <ToggleField
          className="text-slate-300 toggle-field"
          label="Show JSON"
          inputProps={{id: "show-json-toggle"}}
          checked={showJson}
          onChange={() => setShowJson(!showJson)}
        />
      </div>
    </div>
  )
}
