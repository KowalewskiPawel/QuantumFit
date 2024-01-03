import React, { FC, PropsWithChildren } from 'react'
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import { Text } from 'react-native-paper'
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    variant?: VariantProp<never>
}
export const TopHeader: FC<PropsWithChildren<Props>> = ({ children, containerStyle, titleStyle, variant = "headlineMedium" }) => {
    return (
        <View style={[{ padding: 24 }, containerStyle]}>
            <Text
                style={[{ textAlign: "center" }, titleStyle]}
                variant={variant}
            >{children}</Text>
        </View>
    )
};