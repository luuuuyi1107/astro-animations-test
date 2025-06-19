import * as games from "@/libs/games";
import { filters } from "@/libs/constants";
export function getStaticPaths() {
  return Object.entries(games).map(([name, data]) => ({
    params: { name },
    props: { ...data, filter: filters[name as keyof typeof filters] ?? [] as { type: string, name: string}[] }
  }));
}