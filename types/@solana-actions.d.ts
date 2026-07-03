declare module "@solana/actions" {
  export const ACTIONS_CORS_HEADERS: Record<string, string>;

  export interface ActionGetResponse {
    type?: string;
    icon: string;
    title: string;
    description: string;
    label: string;
    error?: { message: string };
    links?: {
      actions: {
        type?: string;
        label: string;
        href: string;
        parameters?: {
          name: string;
          label?: string;
          required?: boolean;
        }[];
      }[];
    };
  }

  export interface ActionPostResponse {
    type?: string;
    transaction: string | import("@solana/web3.js").Transaction;
    message?: string;
    redirect?: string;
  }

  export function createPostResponse(
    input: {
      fields: ActionPostResponse;
      signers?: any[];
      options?: {
        minContextSlot?: number;
        commitment?: string;
      };
    }
  ): Promise<ActionPostResponse>;
}
