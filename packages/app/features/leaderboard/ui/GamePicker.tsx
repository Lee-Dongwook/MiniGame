import { Pressable, View, Text } from "react-native";
import type { GameId } from "../model";

const GAMES: GameId[] = ["reaction", "memory", "stroop-swipe", "quick-math"];

interface Props {
  value: GameId;
  onChange: (v: GameId) => void;
}

export function GamePicker({ value, onChange }: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
      {GAMES.map((id) => (
        <Pressable
          key={id}
          onPress={() => onChange(id)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 10,
            borderWidth: 1,
            opacity: value === id ? 1 : 0.6,
          }}
        >
          <Text>{id}</Text>
        </Pressable>
      ))}
    </View>
  );
}
