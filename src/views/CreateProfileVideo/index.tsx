import React, { FC, useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import moment from 'moment';
import { RNCamera } from 'react-native-camera';
import Dropdown from 'react-native-input-select';
import { DatePickerModal } from 'react-native-paper-dates';
import { Container, Row, Col } from 'react-native-flex-grid';
import { useTheme, IconButton, Button, Text, Snackbar } from 'react-native-paper';
import { View, Image, Alert, Modal, TouchableOpacity, ImageBackground } from "react-native";

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { User } from '../../types';
import { createProfile, fetchGenders } from "../../actions/account.actions";
import { fetchJobRoles, fetchPreviousExperiences, fetchPreferredHours } from "../../actions/jobs.actions";

import { styles } from "../../theme/styles";
import { setUser } from "../../redux/reducers/user.reducer";

const CreateProfileVideo: FC = () => {

    const theme = useTheme();
    let cameraRef = useRef<any>();
    const dispatch = useDispatch();
    const user_state = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [seconds, setSeconds] = useState<number>(0);
    const [user, setUserData] = useState<User>(user_state);
    const [recording, setRecording] = useState<boolean>(false);
    const [recording_ended, setRecordingEnded] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (recording && seconds !== 0) {
            let timer = seconds > 0 && setInterval(() => {
                if(seconds === 0) {
                    setRecording(false);
                    setModalVisible(false);
                    stopRecordingVideo();
                }
                setSeconds(seconds - 1)
            }, 1000); 
            return () => clearInterval(timer || undefined);   
        }
    }, [seconds]);

    const handleCreateProfile = async () => {
    }

    const startRecordingVideo = async () => {
        if (cameraRef && cameraRef.current) {
            let camera = cameraRef.current;
            setRecording(true);
            setSeconds(15);
            const options = { 
                quality: RNCamera.Constants.VideoQuality["288p"], 
                maxDuration: seconds 
            };

            const { uri } = await camera.recordAsync(options);
            console.log('uri', uri);
            Alert.alert('Video', uri);
        }   
    }

    const stopRecordingVideo = async () => {
        if (!recording) { return }
        if (cameraRef && cameraRef.current) {
            let camera = cameraRef.current;
            setSeconds(0);
            setRecording(false);
            await camera.stopRecording();
        }
    }


    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary }]}>
            <View style={{ flex: 1, width: '100%', backgroundColor: theme.colors.primary }}>
                <Image source={require(`../../assets/images/logo_white.png`)} style={styles.xxs_image} />
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <Text style={[styles.text_light_blue_heading, {paddingTop: 10, paddingBottom: 0 }]} variant="headlineSmall">Record a short video intro</Text>
                <Text style={[styles.text_light_blue_heading]} variant="labelLarge">(max 15sec)</Text>
                <View style={[styles.container_curved, { backgroundColor: theme.colors.primary, width: '100%', paddingTop: 0 }]}>
                    <ImageBackground source={require(`../../assets/images/recording_intro.jpg`)} style={[styles.background_image, { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }]}>
                        <Button style={{ position: 'absolute', bottom: 20 }} icon="camera" mode="contained" onPress={() => setModalVisible(true)}>
                            Start Recording
                        </Button>
                    </ImageBackground>
                </View>
            </View>

            <Modal
                style={styles.wrapper}
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {(setModalVisible(false), stopRecordingVideo())}}
                presentationStyle={"pageSheet"}
            >
                <>
                    <TouchableOpacity style={styles.modal_btn_left} onPress={() => (setModalVisible(false), stopRecordingVideo())} >
                        <Text style={styles.modal_txt}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modal_btn_right} onPress={() => console.log()} >
                        <Text style={styles.modal_txt}>Save</Text>
                    </TouchableOpacity>

                    <RNCamera
                        ref={cameraRef}
                        style={[styles.container_curved, { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: theme.colors.primary, width: '100%' }]}
                        type={RNCamera.Constants.Type.front}
                        ratio={'16:9'}
                        captureAudio={true}
                        onRecordingEnd={() => setRecordingEnded(true)}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    >
                        {!recording &&
                            <IconButton
                                style={{ position: 'absolute', bottom: 20 }}
                                icon="record-circle"
                                iconColor={theme.colors.surface}
                                size={70}
                                onPress={() => startRecordingVideo()}
                            />
                        }

                        {recording &&
                            <>
                            <Text style={{ position: 'absolute', top: 20 }} variant="headlineSmall">{seconds} sec left</Text>
                            <IconButton
                                style={{ position: 'absolute', bottom: 20 }}
                                icon="stop-circle"
                                iconColor={theme.colors.surface}
                                size={70}
                                onPress={() => stopRecordingVideo()}
                            />
                            </>
                        }
                    </RNCamera>

                </>
            </Modal>
        </View>
    );
};

export default CreateProfileVideo;