import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "scrape Wikipedia medal table",
  { minutes: 30 },
  api.scrape.scrapeWikipedia
);

export default crons;
