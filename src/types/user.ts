export interface SpotifyUser {
  display_name: string;
  country: string;
  id: string;
  followers: { total: number };
  images: { url: string }[];
  uri: string;
}
