import { vi } from "vitest";

// Mock React Native modules
vi.mock("react-native", () => ({
  View: "View",
  Text: "Text",
  Pressable: "Pressable",
  FlatList: "FlatList",
  RefreshControl: "RefreshControl",
  TextInput: "TextInput",
}));

vi.mock("expo-router", () => ({
  router: {
    push: vi.fn(),
  },
}));

vi.mock("expo-haptics", () => ({
  impactAsync: vi.fn(),
  selectionAsync: vi.fn(),
  notificationAsync: vi.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
  },
  NotificationFeedbackType: {
    Error: "error",
  },
}));

// Mock performance API
global.performance = {
  now: vi.fn(() => Date.now()),
} as any;
