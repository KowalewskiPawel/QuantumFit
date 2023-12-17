import { Camera, CameraCapturedPicture, CameraType, ImageType } from 'expo-camera';
import { Image } from 'expo-image'
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, ImageSourcePropType, ScrollView } from 'react-native';
import { Button, IconButton, List, MD3Colors, Modal, Portal, Surface, Text } from 'react-native-paper'
import { styles } from "../styles/globalStyles";


export const BodyAnalyzePictureScreen = ({ route, navigation }) => {
    const { side } = route.params;
    const windowWidth = Dimensions.get('window').width;
    const cameraWidth = windowWidth * 0.9;
    const cameraHeight = cameraWidth * (4 / 3);

    const bodyFront = require('../assets/images/body_front.png');
    const bodyRight = require('../assets/images/body_right.png');
    const bodyBack = require('../assets/images/body_back.png');

    const imageSources = {
        front: bodyFront,
        side: bodyRight,
        back: bodyBack,
    }

    const navigateToPhoto = () => {
        navigation.navigate('BodyAnalyzeCameraScreen', { side })
    }

    return (
        <View style={localStyles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{`Take a snapshot of your ${side}`}</Text>
            </View>
            <View style={{ ...localStyles.cameraContainer, width: cameraWidth, height: cameraHeight }}>
                <Image contentFit='contain' style={localStyles.bodyImage} source={imageSources[side]} />
            </View>
            <Button
                onPress={navigateToPhoto}
                uppercase
                icon='camera'
                mode='contained'
                labelStyle={{ fontSize: 18 }}
                style={{ marginTop: 40, padding: 4 }}>
                Take a photo
            </Button>
        </View >
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 56,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: "100%"
    },
    cameraContainer: {
        backgroundColor: 'transparent'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: "flex-start",
        width: '100%',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'flex-end'
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    bodyImage: {
        flex: 1,
        height: '60%',
        width: 'auto'
    }
})