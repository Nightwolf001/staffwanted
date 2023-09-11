import React, { FC, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { RNCamera } from 'react-native-camera';
import moment from 'moment';

import { View, Image, ScrollView } from "react-native";
import { useTheme, TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import Dropdown from 'react-native-input-select';
import { Container, Row, Col } from 'react-native-flex-grid';



import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { User } from '../../types';
import { fetchJobRoles, fetchPreviousExperiences, fetchPreferredHours } from "../../actions/jobs.actions";
import { createProfile, fetchGenders } from "../../actions/account.actions";

import { styles } from "../../theme/styles";
import { setUser } from "../../redux/reducers/user.reducer";

const CreateProfileVideo: FC = () => {

    const theme = useTheme();
    let cameraRef = useRef(null);
    const dispatch = useDispatch();
    const user_state = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [user, setUserData] = useState<User>(user_state);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleCreateProfile = async () => {
    }

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary }]}>
            <View style={{ flex: 1, width: '100%', backgroundColor: theme.colors.primary }}>
                <Image source={require(`../../assets/images/logo_white.png`)} style={styles.xxs_image} />
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <Text style={[styles.text_light_blue_heading, { paddingTop: 10 }]} variant="headlineSmall">Record a short video intro (max 15sec)</Text>
                <View style={[styles.container_curved, { backgroundColor: theme.colors.primary, width: '100%', paddingTop: 0 }]}>
                    <RNCamera
                        ref={cameraRef}
                        style={[styles.container_curved, { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: theme.colors.primary, width: '100%' }]}
                        type={RNCamera.Constants.Type.front}
                        captureAudio={true}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    >
                        <Button style={{position: 'absolute', bottom: 20}} icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
                            Start Recording
                        </Button>
                    </RNCamera>
                </View>
            </View>
        </View>
    );
};

export default CreateProfileVideo;