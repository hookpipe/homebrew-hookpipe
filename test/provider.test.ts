import { describe, it, expect } from "vitest";
import provider from "../src/index";

describe("Provider definition", () => {
  it("has a valid id", () => {
    expect(provider.id).toBeTruthy();
    expect(provider.id).toMatch(/^[a-z][a-z0-9-]*$/);
    expect(provider.id).not.toBe("my-service"); // reminder to change from template default
  });

  it("has a name", () => {
    expect(provider.name).toBeTruthy();
    expect(provider.name).not.toBe("My Service"); // reminder to change from template default
  });

  it("has verification config", () => {
    expect(provider.verification).toBeTruthy();
  });

  it("has at least one event", () => {
    expect(Object.keys(provider.events).length).toBeGreaterThan(0);
  });

  it("parseEventType is a function if defined", () => {
    if (provider.parseEventType) {
      expect(typeof provider.parseEventType).toBe("function");
    }
  });

  it("parseEventId is a function if defined", () => {
    if (provider.parseEventId) {
      expect(typeof provider.parseEventId).toBe("function");
    }
  });

  it("decode is a function if defined", () => {
    if (provider.decode) {
      expect(typeof provider.decode).toBe("function");
    }
  });

  it("challenge has detect and respond if defined", () => {
    if (provider.challenge) {
      expect(typeof provider.challenge.detect).toBe("function");
      expect(typeof provider.challenge.respond).toBe("function");
    }
  });

  it("mock functions return objects if defined", () => {
    if (provider.mock) {
      for (const [eventType, generator] of Object.entries(provider.mock)) {
        const result = generator();
        expect(result).toBeTruthy();
        expect(typeof result).toBe("object");
      }
    }
  });

  it("all event keys in presets match declared events or use wildcards", () => {
    if (provider.presets) {
      const eventKeys = Object.keys(provider.events);
      for (const [, patterns] of Object.entries(provider.presets)) {
        for (const pattern of patterns) {
          if (pattern === "*") continue;
          if (pattern.endsWith(".*")) {
            const prefix = pattern.slice(0, -2);
            const hasMatch = eventKeys.some((k) => k.startsWith(prefix));
            expect(hasMatch).toBe(true);
          } else {
            expect(eventKeys).toContain(pattern);
          }
        }
      }
    }
  });
});
