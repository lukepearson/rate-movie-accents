import { b64 } from "./Sanitisation";

const urls = {
  home: () => "/",
  rating: (actor: string, film: string) => `/rating/${b64(actor)}/${b64(film)}`,
}

export { urls };