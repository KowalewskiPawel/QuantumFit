import { Camera, CameraCapturedPicture, CameraType, ImageType } from 'expo-camera';
import { Image } from 'expo-image'
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, ImageSourcePropType, ScrollView } from 'react-native';
import { Button, IconButton, List, MD3Colors, Surface, Text } from 'react-native-paper'
import { styles } from "../styles/globalStyles";

export const BodyAnalyzeCameraScreen = () => {
    const windowWidth = Dimensions.get('window').width;

    const [type, setType] = useState(CameraType.front);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const cameraRef = useRef<Camera>(null);
    const [takenPictures, setTakenPictures] = useState<CameraCapturedPicture[]>([]);
    const [counter, setCounter] = useState(0);

    // const _getAvailableSizes = async () => {
    //     try {
    //         console.log("I am Trying motherfucker!");
    //         const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
    //         console.log("NEXT PLACE");
    //         setSizes(sizes);
    //         console.log({ sizes });

    //         const ratios = await cameraRef.current.getSupportedRatiosAsync();
    //         console.log({ ratios })
    //         setSupportedRatios(ratios)
    //     } catch (e) {
    //         setSizes([])
    //     }
    // }

    const takePicture = async () => {
        const picture = await cameraRef.current.takePictureAsync({
            quality: 0.75,
            scale: 0.6,
            imageType: ImageType.jpg,
        });

        if (takenPictures.length >= 4) {
            alert('Max number of pictures: 4');
            return;
        } else {
            console.log("Picture taken, should save");
            const newPics = takenPictures;
            newPics.push(picture);
            setTakenPictures(() => {
                // console.log("SetState Triggered");
                return newPics
            })
        }
    }


    useEffect(() => {
        console.log(takenPictures)
    }, [takenPictures.length])


    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button mode='contained' onPress={requestPermission} >grant permission</Button>
            </View>
        );
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    return (
        <View style={localStyles.container}>
            <View style={{ ...localStyles.cameraContainer, width: windowWidth, height: (windowWidth * (4 / 3)) }}>
                <Camera useCamera2Api autoFocus ref={cameraRef} style={localStyles.camera} type={type}>
                    <View style={localStyles.buttonContainer}>
                        <IconButton size={26} icon="camera-flip-outline" iconColor={MD3Colors.secondary10} onPress={toggleCameraType} />
                    </View>
                </Camera >
            </View>
            <IconButton size={60} style={{ marginTop: 16 }} icon="camera" onPress={takePicture} />
            <ScrollView horizontal style={localStyles.galleryContainer} >
                {takenPictures.map(pic => <Image style={localStyles.galleryImage} key={pic.uri} source={pic.uri} />)}
            </ScrollView>
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
        width: "100%",
    },
    camera: {
        flex: 1,
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
    sizeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
    },
    galleryContainer: {
        flexDirection: 'row',

    },

    galleryImage: {
        width: 50,
        height: (50 * (4 / 3)),
        margin: 10
    }
})