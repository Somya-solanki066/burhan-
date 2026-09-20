export const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 1] as const;

export type Denomination = (typeof DENOMINATIONS)[number];

export const DENOMINATION_STYLE: Record<
  Denomination,
  { bg: string; border: string; text: string; chip: string }
> = {
  500: {
    bg: "bg-[#efe8f4]",
    border: "border-[#9b7bb8]",
    text: "text-[#5b3d7a]",
    chip: "bg-[#5b3d7a]",
  },
  200: {
    bg: "bg-[#fbf3d5]",
    border: "border-[#d4a017]",
    text: "text-[#8a6a00]",
    chip: "bg-[#c9a227]",
  },
  100: {
    bg: "bg-[#e4f4ef]",
    border: "border-[#2f8f73]",
    text: "text-[#1d6b55]",
    chip: "bg-[#1f7a60]",
  },
  50: {
    bg: "bg-[#e7f6fb]",
    border: "border-[#3aa0c4]",
    text: "text-[#1d6f8a]",
    chip: "bg-[#1f7a98]",
  },
  20: {
    bg: "bg-[#eef6d8]",
    border: "border-[#8aa832]",
    text: "text-[#5a7318]",
    chip: "bg-[#6b8e23]",
  },
  10: {
    bg: "bg-[#f6e8dc]",
    border: "border-[#c47a3a]",
    text: "text-[#8a4b16]",
    chip: "bg-[#a85c22]",
  },
  1: {
    bg: "bg-[#f7efd4]",
    border: "border-[#b8943a]",
    text: "text-[#7a5d12]",
    chip: "bg-[#b8860b]",
  },
};

export type NoteCount = {
  denomination: Denomination;
  presentCount: number;
  missingCount: number;
};

export function emptyNoteCounts(): NoteCount[] {
  return DENOMINATIONS.map((denomination) => ({
    denomination,
    presentCount: 0,
    missingCount: 0,
  }));
}

export function amountFromNotes(notes: NoteCount[]) {
  return notes.reduce(
    (sum, note) => sum + note.presentCount * note.denomination,
    0,
  );
}

export function totalPresentNotes(notes: NoteCount[]) {
  return notes.reduce((sum, note) => sum + note.presentCount, 0);
}

export function totalMissingNotes(notes: NoteCount[]) {
  return notes.reduce((sum, note) => sum + note.missingCount, 0);
}
