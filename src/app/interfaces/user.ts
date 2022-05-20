import { WatchMovie } from "./watch-movie";

export interface User {
  email: string;
  password: string;
  name: string;
  watchlist: WatchMovie[];
  id: boolean;
}
