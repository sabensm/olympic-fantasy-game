"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import * as cheerio from "cheerio";
import type { Element } from "domhandler";

const WIKIPEDIA_URL =
  "https://en.wikipedia.org/wiki/2026_Winter_Olympics_medal_table";

// Country name (as it appears on Wikipedia) → IOC code
const COUNTRY_TO_IOC: Record<string, string> = {
  "Afghanistan": "AFG", "Albania": "ALB", "Algeria": "ALG", "Andorra": "AND",
  "Angola": "ANG", "Argentina": "ARG", "Armenia": "ARM", "Australia": "AUS",
  "Austria": "AUT", "Azerbaijan": "AZE", "Belgium": "BEL",
  "Bosnia and Herzegovina": "BIH", "Belarus": "BLR", "Bolivia": "BOL",
  "Brazil": "BRA", "Bulgaria": "BUL", "Canada": "CAN", "Chile": "CHI",
  "China": "CHN", "Colombia": "COL", "Costa Rica": "CRC", "Croatia": "CRO",
  "Cyprus": "CYP", "Czech Republic": "CZE", "Czechia": "CZE",
  "Denmark": "DEN", "Ecuador": "ECU", "Egypt": "EGY", "Eritrea": "ERI",
  "Spain": "ESP", "Estonia": "EST", "Ethiopia": "ETH", "Finland": "FIN",
  "France": "FRA", "Great Britain": "GBR", "Georgia": "GEO", "Germany": "GER",
  "Ghana": "GHA", "Greece": "GRE", "Hong Kong": "HKG", "Hungary": "HUN",
  "Indonesia": "INA", "India": "IND", "Iran": "IRI", "Ireland": "IRL",
  "Iceland": "ISL", "Israel": "ISR", "Italy": "ITA", "Jamaica": "JAM",
  "Japan": "JPN", "Kazakhstan": "KAZ", "Kenya": "KEN", "Kyrgyzstan": "KGZ",
  "South Korea": "KOR", "Kuwait": "KUW", "Latvia": "LAT", "Lebanon": "LBN",
  "Liechtenstein": "LIE", "Lithuania": "LTU", "Luxembourg": "LUX",
  "Madagascar": "MAD", "Morocco": "MAR", "Malaysia": "MAS", "Moldova": "MDA",
  "Mexico": "MEX", "Mongolia": "MGL", "North Macedonia": "MKD", "Malta": "MLT",
  "Montenegro": "MNE", "Monaco": "MON", "Netherlands": "NED", "Nigeria": "NGR",
  "Norway": "NOR", "New Zealand": "NZL", "Pakistan": "PAK", "Peru": "PER",
  "Philippines": "PHI", "Poland": "POL", "Portugal": "POR",
  "North Korea": "PRK", "Puerto Rico": "PUR", "Qatar": "QAT", "Romania": "ROU",
  "South Africa": "RSA", "Saudi Arabia": "SAU", "Singapore": "SGP",
  "Slovenia": "SLO", "San Marino": "SMR", "Serbia": "SRB", "Switzerland": "SUI",
  "Slovakia": "SVK", "Sweden": "SWE", "Thailand": "THA", "Tajikistan": "TJK",
  "Turkmenistan": "TKM", "Chinese Taipei": "TPE", "Trinidad and Tobago": "TTO",
  "Turkey": "TUR", "Türkiye": "TUR",
  "United Arab Emirates": "UAE", "Ukraine": "UKR",
  "United States": "USA", "Uzbekistan": "UZB",
  "Individual Neutral Athletes": "AIN",
  "U.S. Virgin Islands": "ISV", "Virgin Islands": "ISV",
  // ROC / Russia variants
  "ROC": "ROC", "Russian Olympic Committee": "ROC",
};

// IOC country code → flag emoji mapping
const IOC_FLAGS: Record<string, string> = {
  AFG: "\u{1F1E6}\u{1F1EB}", ALB: "\u{1F1E6}\u{1F1F1}", ALG: "\u{1F1E9}\u{1F1FF}",
  AND: "\u{1F1E6}\u{1F1E9}", ANG: "\u{1F1E6}\u{1F1F4}", ARG: "\u{1F1E6}\u{1F1F7}",
  ARM: "\u{1F1E6}\u{1F1F2}", AUS: "\u{1F1E6}\u{1F1FA}", AUT: "\u{1F1E6}\u{1F1F9}",
  AZE: "\u{1F1E6}\u{1F1FF}", BEL: "\u{1F1E7}\u{1F1EA}", BIH: "\u{1F1E7}\u{1F1E6}",
  BLR: "\u{1F1E7}\u{1F1FE}", BOL: "\u{1F1E7}\u{1F1F4}", BRA: "\u{1F1E7}\u{1F1F7}",
  BUL: "\u{1F1E7}\u{1F1EC}", CAN: "\u{1F1E8}\u{1F1E6}", CHI: "\u{1F1E8}\u{1F1F1}",
  CHN: "\u{1F1E8}\u{1F1F3}", COL: "\u{1F1E8}\u{1F1F4}", CRC: "\u{1F1E8}\u{1F1F7}",
  CRO: "\u{1F1ED}\u{1F1F7}", CYP: "\u{1F1E8}\u{1F1FE}", CZE: "\u{1F1E8}\u{1F1FF}",
  DEN: "\u{1F1E9}\u{1F1F0}", ECU: "\u{1F1EA}\u{1F1E8}", EGY: "\u{1F1EA}\u{1F1EC}",
  ERI: "\u{1F1EA}\u{1F1F7}", ESP: "\u{1F1EA}\u{1F1F8}", EST: "\u{1F1EA}\u{1F1EA}",
  ETH: "\u{1F1EA}\u{1F1F9}", FIN: "\u{1F1EB}\u{1F1EE}", FRA: "\u{1F1EB}\u{1F1F7}",
  GBR: "\u{1F1EC}\u{1F1E7}", GEO: "\u{1F1EC}\u{1F1EA}", GER: "\u{1F1E9}\u{1F1EA}",
  GHA: "\u{1F1EC}\u{1F1ED}", GRE: "\u{1F1EC}\u{1F1F7}", HKG: "\u{1F1ED}\u{1F1F0}",
  HUN: "\u{1F1ED}\u{1F1FA}", INA: "\u{1F1EE}\u{1F1E9}", IND: "\u{1F1EE}\u{1F1F3}",
  IRI: "\u{1F1EE}\u{1F1F7}", IRL: "\u{1F1EE}\u{1F1EA}", ISL: "\u{1F1EE}\u{1F1F8}",
  ISR: "\u{1F1EE}\u{1F1F1}", ITA: "\u{1F1EE}\u{1F1F9}", JAM: "\u{1F1EF}\u{1F1F2}",
  JPN: "\u{1F1EF}\u{1F1F5}", KAZ: "\u{1F1F0}\u{1F1FF}", KEN: "\u{1F1F0}\u{1F1EA}",
  KGZ: "\u{1F1F0}\u{1F1EC}", KOR: "\u{1F1F0}\u{1F1F7}", KUW: "\u{1F1F0}\u{1F1FC}",
  LAT: "\u{1F1F1}\u{1F1FB}", LBN: "\u{1F1F1}\u{1F1E7}", LIE: "\u{1F1F1}\u{1F1EE}",
  LTU: "\u{1F1F1}\u{1F1F9}", LUX: "\u{1F1F1}\u{1F1FA}", MAD: "\u{1F1F2}\u{1F1EC}",
  MAR: "\u{1F1F2}\u{1F1E6}", MAS: "\u{1F1F2}\u{1F1FE}", MDA: "\u{1F1F2}\u{1F1E9}",
  MEX: "\u{1F1F2}\u{1F1FD}", MGL: "\u{1F1F2}\u{1F1F3}", MKD: "\u{1F1F2}\u{1F1F0}",
  MLT: "\u{1F1F2}\u{1F1F9}", MNE: "\u{1F1F2}\u{1F1EA}", MON: "\u{1F1F2}\u{1F1E8}",
  NED: "\u{1F1F3}\u{1F1F1}", NGR: "\u{1F1F3}\u{1F1EC}", NOR: "\u{1F1F3}\u{1F1F4}",
  NZL: "\u{1F1F3}\u{1F1FF}", PAK: "\u{1F1F5}\u{1F1F0}", PER: "\u{1F1F5}\u{1F1EA}",
  PHI: "\u{1F1F5}\u{1F1ED}", POL: "\u{1F1F5}\u{1F1F1}", POR: "\u{1F1F5}\u{1F1F9}",
  PRK: "\u{1F1F0}\u{1F1F5}", PUR: "\u{1F1F5}\u{1F1F7}", QAT: "\u{1F1F6}\u{1F1E6}",
  ROU: "\u{1F1F7}\u{1F1F4}", RSA: "\u{1F1FF}\u{1F1E6}", SAU: "\u{1F1F8}\u{1F1E6}",
  SGP: "\u{1F1F8}\u{1F1EC}", SLO: "\u{1F1F8}\u{1F1EE}", SMR: "\u{1F1F8}\u{1F1F2}",
  SRB: "\u{1F1F7}\u{1F1F8}", SUI: "\u{1F1E8}\u{1F1ED}", SVK: "\u{1F1F8}\u{1F1F0}",
  SWE: "\u{1F1F8}\u{1F1EA}", THA: "\u{1F1F9}\u{1F1ED}", TJK: "\u{1F1F9}\u{1F1EF}",
  TKM: "\u{1F1F9}\u{1F1F2}", TPE: "\u{1F1F9}\u{1F1FC}", TTO: "\u{1F1F9}\u{1F1F9}",
  TUR: "\u{1F1F9}\u{1F1F7}", UAE: "\u{1F1E6}\u{1F1EA}", UKR: "\u{1F1FA}\u{1F1E6}",
  USA: "\u{1F1FA}\u{1F1F8}", UZB: "\u{1F1FA}\u{1F1FF}",
  AIN: "\u{1F3F3}\u{FE0F}",  // Individual Neutral Athletes
  ISV: "\u{1F1FB}\u{1F1EE}", // US Virgin Islands
};

function isMilanActiveHours(): boolean {
  // CET = UTC+1. In February there's no daylight saving.
  // Active window: 09:00-23:59 CET -> 08:00-22:59 UTC
  const utcHour = new Date().getUTCHours();
  return utcHour >= 8 && utcHour <= 22;
}

async function fetchWithRetry(
  url: string,
  retries = 2,
  delayMs = 5000
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      if (attempt < retries) {
        console.warn(`Fetch attempt ${attempt} failed (${response.status}), retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        throw new Error(`Failed to fetch Wikipedia after ${retries} attempts: ${response.status}`);
      }
    } catch (error) {
      if (attempt < retries) {
        console.warn(`Fetch attempt ${attempt} error: ${error}, retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Unreachable");
}

export const scrapeWikipedia = action({
  args: {},
  handler: async (ctx) => {
    if (!isMilanActiveHours()) {
      console.log("Outside Milan active hours (09:00-23:59 CET). Skipping.");
      return;
    }

    console.log("Fetching Wikipedia medal table...");
    const response = await fetchWithRetry(WIKIPEDIA_URL);

    const html = await response.text();
    const $ = cheerio.load(html);

    // Find the medal table - look for a wikitable with Gold/Silver/Bronze headers
    let medalTable: cheerio.Cheerio<Element> | null = null;
    $("table.wikitable").each((_, table) => {
      const headerText = $(table).find("th").text();
      if (
        headerText.includes("Gold") &&
        headerText.includes("Silver") &&
        headerText.includes("Bronze")
      ) {
        medalTable = $(table);
        return false; // break
      }
    });

    if (!medalTable) {
      throw new Error("Could not find medal table on Wikipedia page");
    }

    const records: {
      country: string;
      countryCode: string;
      countryFlag?: string;
      gold: number;
      silver: number;
      bronze: number;
      total: number;
    }[] = [];

    $(medalTable!)
      .find("tr")
      .each((_, row) => {
        // Country name is in a <th scope="row">, not a <td>
        const countryHeader = $(row).find('th[scope="row"]');
        if (countryHeader.length === 0) return; // skip header/total rows

        const headerText = countryHeader.text().trim();
        if (headerText.toLowerCase().startsWith("total") || headerText === "") return;

        // Extract country name from the link inside the <th>
        const countryLink = countryHeader.find("a").last();
        let country = countryLink.text().trim() || headerText;

        // Remove trailing asterisk (host nation marker) and whitespace
        country = country.replace(/\*+$/, "").trim();

        // Look up IOC code from country name — skip unknown countries
        const countryCode = COUNTRY_TO_IOC[country];
        if (!countryCode) {
          console.warn(`Unknown country "${country}" — skipping`);
          return;
        }
        const countryFlag = IOC_FLAGS[countryCode];

        // Medal counts are in the <td> cells
        const cells = $(row).find("td");
        const numbers = cells
          .map((_, cell) => {
            const num = parseInt($(cell).text().trim(), 10);
            return isNaN(num) ? null : num;
          })
          .get()
          .filter((n): n is number => n !== null);

        // Numbers should be: rank, gold, silver, bronze, total
        // Take the last 4 values for medal counts
        if (numbers.length >= 4) {
          const total = numbers[numbers.length - 1];
          const bronze = numbers[numbers.length - 2];
          const silver = numbers[numbers.length - 3];
          const gold = numbers[numbers.length - 4];

          if (country) {
            records.push({ country, countryCode, countryFlag, gold, silver, bronze, total });
          }
        }
      });

    console.log(`Parsed ${records.length} countries from Wikipedia.`);

    if (records.length === 0) {
      console.warn("No medal data found — table may not be populated yet or Wikipedia layout changed.");
      return;
    }

    if (records.length < 5) {
      console.warn(`Only ${records.length} countries parsed — possible Wikipedia layout change. Skipping update.`);
      return;
    }

    await ctx.runMutation(internal.medals.upsertMedals, { records });
    console.log("Medal data saved to Convex.");
  },
});
