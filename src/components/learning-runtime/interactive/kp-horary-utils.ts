"use client";

export const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
export const RASHI_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

export const NAK_NAMES = [
  "Aśvinī", "Bharaṇī", "Kṛttikā", "Rohiṇī", "Mṛgaśīrṣa", "Ardrā", "Punarvasu", "Puṣya", "Aśleṣā",
  "Maghā", "Pūrva-phālgunī", "Uttara-phālgunī", "Hasta", "Chitrā", "Svātī", "Viśākhā", "Anurādhā", "Jyeṣṭhā",
  "Mūla", "Pūrva-aṣāḍhā", "Uttarā-aṣāḍhā", "Śravaṇa", "Dhaniṣṭhā", "Śatabhiṣaj", "Pūrva-bhādrapada", "Uttarā-bhādrapada", "Revatī"
];

export const NAK_RULERS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
];

const VIM_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const VIM_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
};

export interface SubDivision {
  number: number;
  nakName: string;
  nakNum: number;
  starLord: string;
  subLord: string;
  rashiName: string;
  rashiLord: string;
  absFrom: number; // in arc minutes
  absTo: number;   // in arc minutes
}

export function generate249Subs(): SubDivision[] {
  const list: SubDivision[] = [];
  let currentNum = 1;

  for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
    const nakName = NAK_NAMES[nakIdx];
    const starLord = NAK_RULERS[nakIdx];
    const nakStart = nakIdx * 800; // in arc minutes

    const startVimIdx = VIM_ORDER.indexOf(starLord);
    let currentOffset = 0;

    for (let i = 0; i < 9; i++) {
      const subLord = VIM_ORDER[(startVimIdx + i) % 9];
      const years = VIM_YEARS[subLord];
      const width = (years / 120) * 800;

      const subStart = nakStart + currentOffset;
      const subEnd = subStart + width;

      // Check if it crosses a sign boundary (multiple of 1800 arc minutes)
      const boundary = Math.floor(subEnd / 1800) * 1800;
      if (boundary > subStart && boundary < subEnd) {
        // Straddles boundary! Split it into two divisions.
        
        // Division 1: Left of boundary
        const signIdx1 = Math.min(Math.floor(subStart / 1800), 11);
        list.push({
          number: currentNum++,
          nakName,
          nakNum: nakIdx + 1,
          starLord,
          subLord,
          rashiName: SIGNS[signIdx1],
          rashiLord: RASHI_LORD[signIdx1],
          absFrom: subStart,
          absTo: boundary
        });

        // Division 2: Right of boundary
        const signIdx2 = Math.min(Math.floor(boundary / 1800), 11);
        list.push({
          number: currentNum++,
          nakName,
          nakNum: nakIdx + 1,
          starLord,
          subLord,
          rashiName: SIGNS[signIdx2],
          rashiLord: RASHI_LORD[signIdx2],
          absFrom: boundary,
          absTo: subEnd
        });
      } else {
        // Single division
        const signIdx = Math.min(Math.floor(subStart / 1800), 11);
        list.push({
          number: currentNum++,
          nakName,
          nakNum: nakIdx + 1,
          starLord,
          subLord,
          rashiName: SIGNS[signIdx],
          rashiLord: RASHI_LORD[signIdx],
          absFrom: subStart,
          absTo: subEnd
        });
      }

      currentOffset += width;
    }
  }

  return list;
}

export function formatDMS(arcMinutes: number): string {
  const deg = Math.floor(arcMinutes / 60);
  const min = Math.floor(arcMinutes % 60);
  const sec = Math.round((arcMinutes * 60) % 60);
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′`;
}

export function formatZodiac(arcMinutes: number): string {
  const signIdx = Math.min(Math.floor(arcMinutes / 1800), 11);
  const degMinSec = arcMinutes % 1800;
  const deg = Math.floor(degMinSec / 60);
  const min = Math.floor(degMinSec % 60);
  const sec = Math.round((degMinSec * 60) % 60);
  const signName = SIGNS[signIdx];
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″ ${signName}`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′ ${signName}`;
}
