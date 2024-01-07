import React from "react";
import { Text } from "react-native";
import { Avatar, Card, useTheme } from "react-native-paper";

type CustomCardProps = {
  title?: string;
  selected?: boolean;
  onlyContent?: boolean;
  cardWidth?: number;
  onPress?: (title: string) => void;
  content: string;
  icon?: string;
};

export const CustomCard = ({
  title,
  content,
  icon,
  onlyContent,
  cardWidth,
  selected,
  onPress,
}: CustomCardProps) => {
  const theme = useTheme();
  const onlyContentStyle = onlyContent
    ? { fontWeight: "bold", textAlign: "center", marginTop: 10 }
    : {};

  return (
    <Card
      style={{
        width: cardWidth ? cardWidth : "auto",
        backgroundColor: !selected ? theme.colors.primaryContainer : "#3A5C86",
        borderColor: !selected ? theme.colors.outline : "#6799BE",
      }}
      onPress={() => onPress && onPress(onlyContent ? content : title)}
      mode="outlined"
    >
      {icon && (
        <Card.Title
          title={title}
          titleStyle={{ fontWeight: "bold" }}
          left={(props) => <Avatar.Icon {...props} icon={icon} />}
        />
      )}
      <Card.Content>
        {/* @ts-ignore */}
        <Text style={{ color: theme.colors.onBackground, ...onlyContentStyle }}>{content}</Text>
      </Card.Content>
    </Card>
  );
};
