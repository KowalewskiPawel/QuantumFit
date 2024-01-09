import React from 'react'
import { Dimensions, Pressable, ImageSourcePropType } from 'react-native'
import { Card, MD3Colors, Text, useTheme } from 'react-native-paper'

interface Props {
    title: string;
    image: ImageSourcePropType;
    onPress: () => any;
    disabled?: boolean;
}

const windowWidth = Dimensions.get('window').width;

const ExcerciseTile: React.FC<Props> = ({ title, image, onPress, disabled, }) => {
    const theme = useTheme();
    return (
        <Pressable disabled={disabled} onPress={onPress}>
            <Card>
                <Card.Cover source={image} style={{backgroundColor: theme.colors.background}}/>
                <Card.Content style={{ alignItems: 'center'}}>
                    <Text variant="bodyLarge" style={{marginTop: 8, color: disabled ? theme.colors.onSurfaceDisabled : theme.colors.onSurface }}>{title}</Text>
                </Card.Content>
            </Card>
        </Pressable>
    )
}

export default ExcerciseTile