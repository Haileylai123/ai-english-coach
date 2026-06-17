// services/furniture.ts — Maps each furniture item to its slot type and render specs.
// Common-sense placement: beds go center-bottom (big), rugs go full floor, etc.

export type FurnitureSlot =
  | 'bed'          // bottom-center, big item
  | 'floor'        // full-width rug on the floor
  | 'table'        // mid-height surface (bookshelf, plant) — floats over floor
  | 'topLeft'      // upper-left corner — small accent
  | 'topRight'     // upper-right corner — small accent
  | 'bottomLeft'   // bottom-left corner
  | 'bottomRight'; // bottom-right corner

export interface FurnitureSpec {
  /** Default slot (where the item makes most sense) */
  slot: FurnitureSlot;
  /** Width to render at in the room */
  width: number;
  /** Height to render at in the room */
  height: number;
  /** Emoji to use as fallback if image missing */
  emoji: string;
  /** True if item can sit on top of a table (e.g. plant, ball on shelf) */
  stackable?: boolean;
}

/**
 * Each furniture item gets one canonical slot.
 * Items in same slot-family can be swapped.
 */
export const FURNITURE_SPECS: Record<string, FurnitureSpec> = {
  // bed slot — big items, bottom center. Bed image is 500x500 square, so slot height controls visible size.
  'bed':       { slot: 'bed',    width: 320, height: 170, emoji: '🛏️' },
  'tree':      { slot: 'bed',    width: 72, height: 88, emoji: '🌳' },

  // floor slot — wide items, full floor (rugs, mats)
  'rug':       { slot: 'floor',  width: 320, height: 88, emoji: '🟫' },

  // table slot — mid-height, narrower (bookshelf, plant)
  'bookshelf': { slot: 'table',  width: 56, height: 70, emoji: '📚' },
  'plant':     { slot: 'table',  width: 40, height: 54, emoji: '🌿' },

  // corner slots — small accent items (user picks left or right corner)
  'ball':      { slot: 'bottomLeft',  width: 38, height: 38, emoji: '⚽' },
  'bowl':      { slot: 'bottomLeft',  width: 38, height: 38, emoji: '🥣' },
};

/** All slot IDs in display order */
export const ALL_SLOTS: FurnitureSlot[] = ['bed', 'floor', 'table', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

/** Slugs for the four corner positions shown in the picker UI */
export const CORNER_SLOTS: FurnitureSlot[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

/** All items — returned for any slot, with that slot's preferred items first. */
export function itemsForSlot(slot: FurnitureSlot): string[] {
  const all = Object.keys(FURNITURE_SPECS);
  const preferred = Object.entries(FURNITURE_SPECS)
    .filter(([_, spec]) => spec.slot === slot)
    .map(([id]) => id);
  const rest = all.filter(id => !preferred.includes(id));
  return [...preferred, ...rest];
}

/** Human-readable slot label (zh-HK) */
export const SLOT_LABELS: Record<FurnitureSlot, string> = {
  bed: '🛏️ 床位（下中）',
  floor: '🟫 地板',
  table: '📚 桌面（中）',
  topLeft: '↖️ 左上',
  topRight: '↗️ 右上',
  bottomLeft: '↙️ 左下',
  bottomRight: '↘️ 右下',
};

/** Short label for the room slot picker sheet */
export function slotPickerTitle(slot: FurnitureSlot): string {
  switch (slot) {
    case 'bed':         return '下中（中間）';
    case 'floor':       return '地板';
    case 'table':       return '桌面（中）';
    case 'topLeft':     return '左上角';
    case 'topRight':    return '右上角';
    case 'bottomLeft':  return '左下角';
    case 'bottomRight': return '右下角';
  }
}
