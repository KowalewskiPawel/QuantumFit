import React from "react";
import { Text } from "react-native";
import { Avatar, Card, useTheme } from "react-native-paper";

type CustomCardProps = {
  title: string;
  selected?: boolean;
  onPress?: (title: string) => void;
  content?: string;
  icon?: string;
};

export const CustomCard = ({
  title,
  content,
  icon,
  selected,
  onPress,
}: CustomCardProps) => {
  const theme = useTheme();
  return (
    <Card
      style={{
        width: "90%",
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: !selected ? theme.colors.primaryContainer : "#3A5C86",
        borderColor: !selected ? theme.colors.outline : "#6799BE",
      }}
      onPress={() => onPress && onPress(title)}
      mode="outlined"
    >
      <Card.Title
        title={title}
        titleStyle={{ fontWeight: "bold" }}
        left={(props) => (icon ? <Avatar.Icon {...props} icon={icon} /> : null)}
      />
      <Card.Content>
        <Text style={{ color: "#FFF" }}>{content}</Text>
      </Card.Content>
    </Card>
  );
};
