import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import React, { useEffect } from 'react'
import { Button, Dialog, Text } from 'react-native-paper'

export function CameraPermissionModal({permission}) {
    const navigation = useNavigation();
    const [, requestPermission] = Camera.useCameraPermissions();
    
    return (
        <Dialog visible={!permission || !permission?.granted} onDismiss={navigation.goBack}>
            <Dialog.Title>Camera Permissions</Dialog.Title>
            <Dialog.Content>
                <Text variant="bodyMedium">To use this feature you need to grant camera permissions to application</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={requestPermission}>Done</Button>
            </Dialog.Actions>
        </Dialog>
    )
}
