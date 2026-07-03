export const ACTIONS_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Encoding",
} as const;

export type ActionGetResponse = {
  type: "action";
  title: string;
  icon: string;
  description: string;
  label: string;
  error?: { message: string };
  links?: {
    actions: {
      type: "transaction";
      label: string;
      href: string;
      parameters?: { name: string; label: string; required: boolean }[];
    }[];
  };
};

export type ActionPostResponse = {
  transaction: string;
};

export async function createPostResponse({
  fields,
}: {
  fields: { type: string; transaction: { serialize: (opts: { requireAllSignatures: boolean; verifySignatures: boolean }) => Buffer } };
}): Promise<ActionPostResponse> {
  const serialized = fields.transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });
  const base64 = Buffer.from(serialized).toString("base64");
  return { transaction: base64 };
}
