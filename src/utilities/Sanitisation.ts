const sanitise = (input: unknown) => String(input).replace(/[^a-z0-9:]/gi, "").toLowerCase();

const b64 = (input: string) => encodeURIComponent(Buffer.from(input).toString("base64"));

const unB64 = (input: string) => Buffer.from(decodeURIComponent(input), "base64").toString("utf-8");

export { sanitise, b64, unB64 };