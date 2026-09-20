import {
  DENOMINATION_STYLE,
  DENOMINATIONS,
  type Denomination,
  type NoteCount,
} from "@/lib/denominations";
import { formatINR } from "@/lib/format";

export function NoteCountBoxes({
  notes,
  onChange,
}: {
  notes: NoteCount[];
  onChange: (denomination: Denomination, value: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {DENOMINATIONS.map((denomination) => {
        const note = notes.find((item) => item.denomination === denomination)!;
        const style = DENOMINATION_STYLE[denomination];
        return (
          <div
            key={denomination}
            className={`rounded-xl border p-2.5 ${style.bg} ${style.border}`}
          >
            <p className={`text-base font-bold ${style.text}`}>₹{denomination}</p>
            <div className="mt-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => onChange(denomination, note.presentCount - 1)}
                className="h-8 w-8 shrink-0 rounded-md bg-white/80 text-base font-semibold"
              >
                −
              </button>
              <input
                name={`present_${denomination}`}
                type="number"
                min={0}
                value={note.presentCount}
                onChange={(event) =>
                  onChange(denomination, Number(event.target.value) || 0)
                }
                className="h-8 w-full min-w-0 rounded-md border border-black/5 bg-white px-1 text-center text-sm font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => onChange(denomination, note.presentCount + 1)}
                className="h-8 w-8 shrink-0 rounded-md bg-white/80 text-base font-semibold"
              >
                +
              </button>
            </div>
            <p className={`mt-1.5 text-right text-xs font-semibold ${style.text}`}>
              {formatINR(note.presentCount * denomination)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
