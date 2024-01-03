import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useTheme } from "react-native-paper";

const timerData = [
    { key: "OFF", time: 0 },
    { key: "3s", time: 3 },
    { key: "5s", time: 5 },
    { key: "10s", time: 10 }
]
export const CountdownTimer = ({ onPress }) => {
    const theme = useTheme();

    const onClick = (time) => {
        onPress(time);
    };

    return (
        <View style={{ ...styles.timerContainer, backgroundColor: theme.colors.background }}>
            <FlatList
                data={timerData}
                style={styles.timerList}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onClick(item.time)}>
                        <Text style={styles.item}>{item.key}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    timerContainer: {
        position: "absolute",
        width: "50%",
        bottom: "25%",
        right: "25%",
        zIndex: 1,
        borderRadius: 10,
        padding: 10,
    },
    timerList: {
        paddingTop: 10,
    },
    item: {
        fontSize: 18,
        textAlign: "center",
        height: 44,
        fontWeight: "bold",
        color: "white",
    },
});