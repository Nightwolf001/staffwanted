import React, { FC, useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import Video from 'react-native-video';
import { RNCamera } from 'react-native-camera';
import { useTheme, IconButton, Button, Text } from 'react-native-paper';
import { View, Image, Alert, Modal, TouchableOpacity, ImageBackground, ActivityIndicator } from "react-native";

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { User } from '../../types';
import { createProfile, uploadFile } from "../../actions/account.actions";

import { styles } from "../../theme/styles";
import { setUser } from "../../redux/reducers/user.reducer";


const CreateProfileVideo: FC = () => {
    
    let videoRef = useRef<any>();
    let cameraRef = useRef<any>();
    
    const theme = useTheme();
    const dispatch = useDispatch();
    const user_state = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [seconds, setSeconds] = useState<number>(0);
    const [user, setUserData] = useState<User>(user_state);
    const [recording, setRecording] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [recording_ended, setRecordingEnded] = useState<boolean>(false);
    const [recorded_file_path, setRecordedFilePath] = useState<string>('');

    useEffect(() => {
        if (recording && seconds !== 0) {
            let timer = seconds >= 0 && setInterval(() => {
                console.log('secconds', seconds)
                setSeconds(seconds - 1);
            }, 1000); 
            return () => clearInterval(timer || undefined);   
        } else if(recording && seconds === 0) {
            stopRecordingVideo();
        }
    }, [seconds]);

    const startRecordingVideo = async () => {
        if (cameraRef && cameraRef.current) {
            let camera = cameraRef.current;
            setRecording(true);
            setSeconds(15);
            const options = { 
                quality: RNCamera.Constants.VideoQuality["288p"], 
                maxDuration: seconds,
                mirrorVideo : false,
                mute : false
            };
            const { uri } = await camera.recordAsync(options);
            setRecordedFilePath(uri);
            console.log('uri', uri);
        }   
    }

    const stopRecordingVideo = async () => {
        if (!recording) { return }
        if (cameraRef && cameraRef.current) {
            let camera = cameraRef.current;
            setSeconds(0);
            setRecording(false);
            setRecordingEnded(true);
            await camera.stopRecording();
        }
    }

    const cancelRecordingVideo = async () => {
            Alert.alert(
                "Are you sure you want to cancel?",
                "Recording wont be saved if you choose to cancel",
                [
                    { text: "Yes Cancel", onPress: async () => (
                            setModalVisible(false),
                            setSeconds(0),
                            setRecording(false),
                            setRecordingEnded(false)
                        ) 
                    },
                    { text: "No Keep Video", onPress: async () => console.log('pressed') }
                ],
                { cancelable: false }
            ); 
    }

    const saveRecordedVideo = async () => {

        setSubmitting(true);
        let video_name = `${user.id}_intro_vid`
        let video_type = 'video/mp4'
        let video_uri = recorded_file_path
        
        let resp = await uploadFile(video_name, video_type, video_uri);
        let video_id = resp[0].id;
        console.log('video_id', video_id);

        let user_object = {
            id : user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number,
            location: user.location,
            experience: user.experience,
            preferred_hours: user.preferred_hours,
            start_date: user.start_date,
            end_date: user.end_date,
            hide_profile: user.hide_profile,
            work_description: user.work_description,
            date_of_birth: user.date_of_birth,
            account_complete: true,
            video_id: video_id,
            avatar_id: user.avatar_id,
            coord: user.coord,
        };
       
        let response = await createProfile(user_object);
        setSubmitting(false);
        console.log('data', response.data);

        if (response !== 9001) {
            //  setUserData({ ...user, video_id: video_id, account_complete: true });
            dispatch(setUser(user_object));
            setRecordingEnded(false);
            setModalVisible(false);
             navigation.navigate('Login');
        } else {
                // onToggleSnackBar();
        }
    }
 
    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary }]}>
            <View style={{ flex: 1, width: '100%', backgroundColor: theme.colors.primary }}>
                <Image source={require(`../../assets/images/logo_white.png`)} style={styles.xxs_image} />
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <Text style={[styles.text_light_blue_heading, {paddingTop: 10, paddingBottom: 0 }]} variant="headlineSmall">Record a short video intro</Text>
                <Text style={[styles.text_light_blue_heading, { color: theme.colors.primary }]} variant="labelLarge">(max 15sec)</Text>
                {submitting && <ActivityIndicator size="large" color={theme.colors.primary} />}
                <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary, width: '100%', paddingTop: 0 }]}>
                    
                        <ImageBackground source={require(`../../assets/images/recording_intro.jpg`)} style={[styles.background_image, { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }]}>
                            <Button style={{ position: 'absolute', bottom: 20 }} icon="camera" mode="contained" onPress={() => setModalVisible(true)}>
                                Start Recording Now
                            </Button>
                        </ImageBackground>
                                      
                </View>
            </View>

            <Modal
                style={styles.wrapper}
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => { cancelRecordingVideo ()}}
                presentationStyle={"pageSheet"}
            >
                <>
       
                    {!recording && !recording_ended &&
                        <TouchableOpacity style={styles.modal_btn_left} onPress={() => setModalVisible(false)} >
                            <Text style={[styles.modal_txt, { color: theme.colors.primary }]}>Close</Text>
                        </TouchableOpacity>
                    }

                    {recording_ended && !recording &&
                    <>
                        <TouchableOpacity style={styles.modal_btn_left} onPress={() => cancelRecordingVideo()} >
                            <Text style={[styles.modal_txt, {color: theme.colors.primary}]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modal_btn_right} onPress={() => saveRecordedVideo()} >
                            <Text style={[styles.modal_txt, { color: theme.colors.primary }]}>Save</Text>
                        </TouchableOpacity>
                    </>
                    }

                    {!recording_ended &&
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
                            <>
                                <Text style={{ position: 'absolute', top: 30, fontWeight: 'bold', color: theme.colors.primary }} variant="labelLarge">Press button to start recording</Text>
                                <IconButton
                                    style={{ position: 'absolute', bottom: 20 }}
                                    icon="record-circle"
                                    iconColor={theme.colors.surface}
                                    size={70}
                                    onPress={() => startRecordingVideo()}
                                />
                            </>
                        }
                    
                        {recording &&
                            <>
                                <Text style={{ position: 'absolute', top: 35, fontWeight: 'bold', color: theme.colors.primary }} variant="labelLarge">{seconds} sec left</Text>        
                                <IconButton
                                    style={{ position: 'absolute', bottom: 20 }}
                                    icon="stop-circle"
                                    iconColor={theme.colors.primary}
                                    size={70}
                                    onPress={() => stopRecordingVideo()}
                                />
                            </>
                        }
                    </RNCamera>
                    }

                    {recording_ended &&
                        <Video
                            ref={videoRef}
                            controls={true}
                            repeat={true}
                            resizeMode={"cover"}
                            source={{ uri: recorded_file_path }}
                            style={styles.backgroundVideo} 
                        />
                    }

                </>
            </Modal>
        </View>
    );
};

export default CreateProfileVideo;