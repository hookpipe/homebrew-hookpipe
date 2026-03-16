/**
 * hookflare Provider Template
 *
 * Replace this with your provider implementation.
 * See: https://github.com/hookedge/hookflare/blob/main/packages/providers/DESIGN.md
 *
 * Minimum required: id, name, verification, events
 * Everything else is optional — delete what you don't need.
 */

export interface ProviderDefinition {
  id: string;
  name: string;
  website?: string;
  dashboardUrl?: string;

  secrets?: Record<string, { description: string; required?: boolean }>;

  verification:
    | { type: "stripe-signature"; header: string }
    | { type: "slack-signature"; header: string }
    | {
        header: string;
        algorithm: "hmac-sha256" | "hmac-sha1";
        encoding?: "hex" | "base64";
      }
    | {
        type: "custom";
        verify: (
          secrets: Record<string, string>,
          body: string,
          headers: Record<string, string>,
        ) => Promise<boolean>;
      };

  decode?: (
    secrets: Record<string, string>,
    body: string,
    headers: Record<string, string>,
  ) => Promise<unknown>;

  events: Record<
    string,
    | string
    | { description: string; category?: string; schema?: unknown }
  >;

  parseEventType?: (body: unknown) => string;
  parseEventId?: (body: unknown) => string;

  challenge?: {
    detect: (body: unknown) => boolean;
    respond: (body: unknown) => unknown;
  };

  mock?: Record<string, () => unknown>;

  presets?: Record<string, string[]>;

  nextSteps?: {
    dashboard?: string;
    instruction?: string;
  };
}

export function defineProvider(def: ProviderDefinition): ProviderDefinition {
  return def;
}

// ---------------------------------------------------------------------------
// Your provider starts here. Edit everything below.
// ---------------------------------------------------------------------------

export default defineProvider({
  // REQUIRED: Unique identifier (lowercase, hyphens only)
  id: "my-service",

  // REQUIRED: Human-readable name
  name: "My Service",

  // Optional: Service website and webhook configuration page
  website: "https://example.com",
  dashboardUrl: "https://example.com/settings/webhooks",

  // Optional: Declare multiple secrets (omit for single --secret)
  // secrets: {
  //   api_key: { description: "API key for decryption" },
  //   api_iv: { description: "Initialization vector" },
  // },

  // REQUIRED: How to verify incoming webhooks
  // Option A: Generic HMAC (most common)
  verification: {
    header: "x-webhook-signature",
    algorithm: "hmac-sha256",
    encoding: "hex",
  },
  // Option B: Custom verification (for non-HMAC providers)
  // verification: {
  //   type: "custom",
  //   verify: async (secrets, body, headers) => {
  //     // Your verification logic here
  //     return true;
  //   },
  // },

  // Optional: Decrypt or decode the payload before processing
  // Needed for providers that send encrypted or signed payloads (AES, JWS, etc.)
  // decode: async (secrets, body, headers) => {
  //   const decrypted = decrypt(body, secrets.api_key, secrets.api_iv);
  //   return JSON.parse(decrypted);
  // },

  // REQUIRED: Known event types this provider can send
  events: {
    "order.created": "A new order was created",
    "order.updated": "An existing order was updated",
    "payment.completed": {
      description: "Payment was successfully processed",
      category: "payments",
    },
  },

  // Optional: How to extract event type and ID from the payload
  parseEventType: (body: any) => body.event ?? body.type,
  parseEventId: (body: any) => body.id,

  // Optional: URL verification challenge (Slack, Discord)
  // challenge: {
  //   detect: (body: any) => body.type === "url_verification",
  //   respond: (body: any) => ({ challenge: body.challenge }),
  // },

  // Optional: Generate fake events for development and testing
  // mock: {
  //   "order.created": () => ({
  //     id: `evt_${Date.now()}`,
  //     type: "order.created",
  //     data: { order_id: "ord_123", total: 49.99 },
  //   }),
  // },

  // Optional: Suggested event filter presets
  // presets: {
  //   orders: ["order.*"],
  //   payments: ["payment.*"],
  //   all: ["*"],
  // },

  // Optional: Post-setup instructions for the user
  nextSteps: {
    dashboard: "https://example.com/settings/webhooks",
    instruction:
      "Add the webhook URL in your service dashboard under Settings → Webhooks.",
  },
});
