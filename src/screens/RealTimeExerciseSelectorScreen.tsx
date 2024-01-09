import React from 'react'
import { styles } from '../styles/globalStyles';
import { Dimensions, ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';
import ExcerciseTile from '../components/ExcerciseTile';
import { TopHeader } from '../components';

// Images
const sitUpsImage = require('../assets/images/exercises/sit_ups.jpeg');
const sitUpsImageDisabled = require('../assets/images/exercises/sit_ups.jpeg');
const crunchesImage = require('../assets/images/exercises/crunches.jpeg');
const crunchesImageDisabled = require('../assets/images/exercises/crunches_disabled.jpeg');
const pushUpsImage = require('../assets/images/exercises/push_ups.jpeg');
const pushUpsImageDisabled = require('../assets/images/exercises/push_ups_disabled.jpeg');
const jumpingJacksImage = require('../assets/images/exercises/jumping_jacks.jpeg');
const jumpingJacksImageDisabled = require('../assets/images/exercises/jumping_jacks_disabled.jpeg');

const exercises = [
    {
        name: "Sit ups",
        image: sitUpsImage,
        imageDisabled: sitUpsImageDisabled,
        disabled: false
    },
    {
        name: "Crunches",
        image: crunchesImage,
        imageDisabled: crunchesImageDisabled,
        disabled: true
    },
    {
        name: "Push ups",
        image: pushUpsImage,
        imageDisabled: pushUpsImageDisabled,
        disabled: true
    },
    {
        name: "Jumping jacks",
        image: jumpingJacksImage,
        imageDisabled: jumpingJacksImageDisabled,
        disabled: true
    },
]

const windowWidth = Dimensions.get('window').width;

export const RealTimeExerciseSelectorScreen = ({ navigation }) => {

    const renderExcercises = () => {
        return exercises.map((exercise, index) => {
            return (
                <View key={`${exercise.name}-${index}`} style={{ flex: 1, flexBasis: '45%' }}>
                    <ExcerciseTile
                        title={exercise.name}
                        image={exercise.disabled ? exercise.imageDisabled : exercise.image}
                        onPress={() => navigation.navigate('RealTimeExerciseAnalysis')}
                        disabled={exercise.disabled}
                    />
                </View>
            )
        })
    }

    return (
        <ScrollView style={{ ...styles.container }}>
            <TopHeader>Select an exercise</TopHeader>
            <View style={{ flexDirection: 'row', columnGap: 20, rowGap: 20, flexWrap: 'wrap', flex: 1 }}>
                {renderExcercises()}
            </View>
            <Button
                icon="arrow-left"
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={{ marginVertical: 20, width: (windowWidth - 40), alignSelf: "center" }}
            >
                Go back
            </Button>
        </ScrollView>
    );
}