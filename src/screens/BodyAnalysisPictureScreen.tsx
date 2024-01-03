// import { Image } from 'expo-image'
import { Dimensions, SafeAreaView, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { Button } from 'react-native-paper'
import { useAppDispatch } from '../app/store';
import { resetBodyPhotosState } from '../features/bodyPhotos/slice';
import { TopHeader } from '../components';
import { styles } from '../styles/globalStyles';


export const BodyAnalysisPictureScreen = ({ route, navigation }) => {
    const dispatch = useAppDispatch();
    const { side } = route.params;
    const windowWidth = Dimensions.get('window').width;
    const imageWidth = windowWidth * 0.7;
    const imageHeight = imageWidth * (4 / 3);

    const bodyFront = require('../assets/images/body_front.png');
    const bodyRight = require('../assets/images/body_right.png');
    const bodyBack = require('../assets/images/body_back.png');

    const imageSources = {
        front: bodyFront,
        side: bodyRight,
        back: bodyBack,
    }

    const navigateToPhoto = () => {
        navigation.navigate('BodyAnalysisCameraScreen', { side })
    }

    const handleCancel = () => {
        navigation.navigate("MainMenu");
        dispatch(resetBodyPhotosState());
    };

    const handleSkip = () => {
        const nextScreenMap = {
            front: 'side',
            side: 'back',
            back: 'front'
        }
        if (side == 'back') {
            navigation.navigate('BodyAnalysis')
        } else {
            navigation.navigate('BodyAnalysisPictureScreen', { side: nextScreenMap[side] })
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <TopHeader>{`Take a snapshot of your ${side}`}</TopHeader>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image contentFit='contain' style={{ width: imageWidth, height: imageHeight }} source={imageSources[side]} />
                </View>
                <View style={{ flexDirection: 'column', rowGap: 10, marginTop: 20 }}>
                    <Button
                        onPress={navigateToPhoto}
                        icon='camera'
                        mode='contained'
                    >
                        Take a photo
                    </Button>
                    {side !== 'front' &&
                        <Button
                            onPress={handleSkip}
                            mode='contained-tonal'
                        >
                            Skip this part
                        </Button>
                    }
                    <Button
                        onPress={handleCancel}
                        mode='outlined'
                    >
                        Cancel
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}