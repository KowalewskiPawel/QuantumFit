import {
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Portal, useTheme, Modal } from "react-native-paper";

const timerData = [
    { key: "OFF", time: 0 },
    { key: "3s", time: 3 },
    { key: "5s", time: 5 },
    { key: "10s", time: 10 }
]
export const CountdownTimer = ({ onTimeSelect, visible, onDismiss }) => {
    const theme = useTheme();
    const onClick = (time) => {
        onTimeSelect(time);
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{ ...styles.timerContainer, backgroundColor: theme.colors.background }}>
                <FlatList
                    data={timerData}
                    style={styles.timerList}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onClick(item.time)}>
                            <Text style={{...styles.item, color: theme.colors.onPrimary}}>{item.key}</Text>
                        </TouchableOpacity>
                    )}
                />
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    timerContainer: {
        width: "50%",
        left: "25%",
        borderRadius: 15,
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
    },
});