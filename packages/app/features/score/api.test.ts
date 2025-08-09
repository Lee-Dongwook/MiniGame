import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitScore } from "./api";

// Mock the http module
vi.mock("@/shared/lib/http", () => ({
  api: vi.fn(),
}));

const mockApi = vi.mocked(await import("@/shared/lib/http")).api;

describe("submitScore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit score with correct parameters", async () => {
    const mockResponse = { ok: true };
    mockApi.mockResolvedValue(mockResponse);

    const result = await submitScore({
      gameId: "reaction",
      score: 150,
      runTimeMs: 5000,
    });

    expect(mockApi).toHaveBeenCalledWith("/scores", {
      method: "POST",
      body: JSON.stringify({
        gameId: "reaction",
        score: 150,
        runTimeMs: 5000,
      }),
    });
    expect(result).toEqual(mockResponse);
  });

  it("should handle different game types", async () => {
    mockApi.mockResolvedValue({ ok: true });

    await submitScore({
      gameId: "memory",
      score: 5,
      runTimeMs: 3000,
    });

    expect(mockApi).toHaveBeenCalledWith("/scores", {
      method: "POST",
      body: JSON.stringify({
        gameId: "memory",
        score: 5,
        runTimeMs: 3000,
      }),
    });
  });
});
