/**
 * Single ride/wahana item from `GET client/rides`.
 * `label`/`description` arrive as `{ en, id }` localized objects (or plain strings)
 * and are collapsed to the active locale during parsing.
 */
export interface RideItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  type?: string;
  isHighlight?: boolean;
}
