const sanitise = (input: unknown) => String(input).replace(/[^a-z0-9:]/gi, "").toLowerCase();

const getKey = (actor: string, film: string) => {
  return `item:${sanitise(actor)}:${sanitise(film)}`;
};

const b64 = (input: string) => encodeURIComponent(Buffer.from(input).toString("base64"));

const unB64 = (input: string) => Buffer.from(decodeURIComponent(input), "base64").toString("utf-8");

export { getKey, sanitise, b64, unB64 };