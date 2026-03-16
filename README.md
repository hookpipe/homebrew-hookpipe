# hookflare Provider Template

Template for creating a [hookflare](https://github.com/hookedge/hookflare) provider — a knowledge module that teaches hookflare how to verify, parse, and understand webhooks from a specific service.

## Quick Start

1. **Create your repo from this template**

   Click "Use this template" on GitHub, or:

   ```bash
   gh repo create yourname/hookflare-provider-my-service --template hookedge/hookflare-provider-template
   cd hookflare-provider-my-service
   npm install
   ```

2. **Edit `src/index.ts`**

   Replace the placeholder values with your provider's details:
   - `id` — unique identifier (lowercase, hyphens only)
   - `name` — human-readable name
   - `verification` — how to validate incoming webhook signatures
   - `events` — known event types your service can send

   Delete any optional capabilities you don't need (they're commented out in the template).

3. **Run the tests**

   ```bash
   npm test
   ```

   Tests will fail until you change `id` and `name` from the template defaults — this is intentional.

4. **Share your provider**

   The fastest way — no npm account needed:

   ```bash
   git push
   # Users can install directly from GitHub:
   hookflare connect my-service --provider github:yourname/hookflare-provider-my-service --secret xxx --to https://...
   ```

   Or publish to npm:

   ```bash
   # Update package.json: name, description, repository
   npm publish
   # Users install by package name:
   hookflare connect my-service --provider hookflare-provider-my-service --secret xxx --to https://...
   ```

## Provider Capabilities

| Capability | Required | Description |
|---|---|---|
| `id` | Yes | Unique identifier |
| `name` | Yes | Human-readable name |
| `verification` | Yes | Signature verification method |
| `events` | Yes | Event type catalog |
| `secrets` | No | Multiple credentials (key + IV, certificates) |
| `decode` | No | Decrypt or decode encrypted/signed payloads |
| `parseEventType` | No | Extract event type from payload |
| `parseEventId` | No | Extract event ID from payload |
| `challenge` | No | URL verification challenge-response (Slack, Discord) |
| `mock` | No | Generate fake events for development |
| `presets` | No | Suggested event filter groups |
| `nextSteps` | No | Post-setup instructions for the user |

See the full [Provider Design Guide](https://github.com/hookedge/hookflare/blob/main/packages/providers/DESIGN.md) for details and examples.

## Examples

### Simple HMAC provider (most common)

```typescript
export default defineProvider({
  id: "my-service",
  name: "My Service",
  verification: { header: "x-signature", algorithm: "hmac-sha256" },
  events: {
    "order.created": "New order placed",
    "order.shipped": "Order has shipped",
  },
});
```

### Provider with encrypted payloads

```typescript
export default defineProvider({
  id: "my-psp",
  name: "My Payment Gateway",
  secrets: {
    api_key: { description: "Encryption key" },
    api_iv: { description: "Initialization vector" },
  },
  verification: {
    type: "custom",
    verify: async (secrets, body, headers) => {
      return verifySHA256(body, secrets.api_key);
    },
  },
  decode: async (secrets, body) => {
    return JSON.parse(aesDecrypt(body, secrets.api_key, secrets.api_iv));
  },
  events: {
    "payment.success": "Payment completed",
    "payment.failed": "Payment failed",
  },
});
```

## Naming Convention

- npm package: `hookflare-provider-<your-service>`
- Provider ID: lowercase, hyphens only (e.g., `my-service`)

## License

[MIT](LICENSE) — use this template however you want.
