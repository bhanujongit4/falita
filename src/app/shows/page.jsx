import ShowsBoard from "../components/showsboard";
import { getShows, todayInIndia } from "../../lib/shows";

export const revalidate = 300;

export const metadata = {
  title: "Live | Falita",
  description: "Upcoming shows and past nights from Falita.",
};

export default async function ShowsPage() {
  const { shows, failed } = await getShows();
  const today = todayInIndia();

  // upcoming: soonest first (undated ones go last). past: most recent first
  const upcoming = shows
    .filter((s) => !s.date || s.date.iso >= today)
    .sort((a, b) => (a.date?.iso ?? "9999").localeCompare(b.date?.iso ?? "9999"));
  const past = shows
    .filter((s) => s.date && s.date.iso < today)
    .sort((a, b) => b.date.iso.localeCompare(a.date.iso));

  return <ShowsBoard upcoming={upcoming} past={past} today={today} failed={failed} />;
}