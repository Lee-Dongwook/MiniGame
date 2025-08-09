import { Pressable, Text } from "react-native";

export function Card({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}
