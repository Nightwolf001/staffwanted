import React, { FC, useEffect, useRef, useState } from "react";

import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';

import { View, ScrollView, Modal, Alert, TouchableOpacity } from "react-native";
import { useTheme, TextInput, Button, Text, IconButton, Avatar, SegmentedButtons, Switch } from 'react-native-paper';

import moment from 'moment';
import Video from 'react-native-video';
import { RNCamera } from 'react-native-camera';
import Dropdown from 'react-native-input-select';
import ActionSheet from "react-native-actions-sheet";
import { ActionSheetRef } from "react-native-actions-sheet";
import { DatePickerModal } from 'react-native-paper-dates';
import { Container, Row, Col } from 'react-native-flex-grid';
import DocumentPicker, { types } from 'react-native-document-picker'
import { launchImageLibrary } from 'react-native-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { ParamListBase, useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Menu, GreetingsText } from "../../components";

import { User } from '../../types';
import { setUser } from '../../redux/reducers/user.reducer';
import { fetchJobRoles, fetchPreviousExperiences, fetchPreferredHours } from "../../actions/jobs.actions";
import { updateProfile, uploadAvatarFile, uploadFile } from "../../actions/account.actions";

import { MAPS_API_KEY } from '@env';
import { styles } from "../../theme/styles";

const Profile: FC = () => {

    let videoRef = useRef<any>();
    let cameraRef = useRef<any>();
    const actionSheetRef = useRef<ActionSheetRef>(null);

    const theme = useTheme();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const [menu_visible, setMenuVisible] = useState(false);
    const user = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [all_job_roles, setAllJobRoles] = useState<any>([]);
    const [preferred_hours, setPreferredHours] = useState<any>([]);
    const [experiences, setExperiences] = useState<any>([]);
    const [date_start_open, setDateStartOpen] = useState(false);
    const [date_end_open, setDateEndOpen] = useState(false);

    const [start_date, setStartDate] = useState<any>(null);
    const [end_date, setEndDate] = useState<any>(null);

    const [is_profile_visible, setIsProfileVisible] = useState<boolean>(false);
    const [is_profile_boosted, setIsProfileBoosted] = useState<boolean>(false);

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [modal_visible, setModalVisible] = useState<boolean>(false);

    const [section, setSection] = useState('job');
    const [user_data, setUserData] = useState<User>(user);
    const [user_avatar, setUserAvatar] = useState<string>("");

    const [camera_visible, setCameraVisible] = useState<boolean>(false);

    useEffect(() => {
        (async () => {

            let jobs = await fetchJobRoles();
            setAllJobRoles(jobs?.data);

            let experiences = await fetchPreviousExperiences();
            setExperiences(experiences?.data);

            let preferredHours = await fetchPreferredHours();
            setPreferredHours(preferredHours?.data);

            setStartDate(user_data.start_date);
            setEndDate(user_data.end_date);

            setIsProfileVisible(user_data.hide_profile);
            setIsProfileBoosted(user_data.profile_boosted);

            setUserAvatar(`https://staffwanted-api.madebycode.co.za/${user_data.avatar_url}`)

        })()
    }, [isFocused]);

    const handleDateStartSave = (start_date: any) => {
        const momentDate = moment(start_date.date);
        if (!momentDate.isValid()) {
            console.log('Invalid date');
            return;
        }
        const formattedDate = momentDate.format('DD-MM-YYYY');

        setStartDate(formattedDate);
        setUserData({ ...user_data, start_date: formattedDate });
        setDateStartOpen(false);
    };
    const handleDateStartCancel = () => {
        setDateStartOpen(false);
    };

    const handleDateEndSave = (end_date: any) => {
        const momentDate = moment(end_date.date);
        if (!momentDate.isValid()) {
            console.log('Invalid date');
            return;
        }
        const formattedDate = momentDate.format('DD-MM-YYYY');

        setEndDate(formattedDate);
        setUserData({ ...user_data, end_date: formattedDate });
        setDateEndOpen(false);
    };
    const handleDateEndCancel = () => {
        setDateEndOpen(false);
    };

    const onToggleProfileVisibility = () => {
        setIsProfileVisible(!is_profile_visible);
        setUserData({ ...user_data, hide_profile: !is_profile_visible });
    }
    const onToggleProfileBoost = () => {
        setIsProfileBoosted(!is_profile_boosted);
        setUserData({ ...user_data, profile_boosted: !is_profile_boosted });
    }

    const handelUpdateProfile = async () => {
        setSubmitting(true);
        const {data} = await updateProfile(user.id, user_data);
        if (data) {
            dispatch(setUser(data.attributes));
            setUserData(data.attributes);
            setSubmitting(false);
            Alert.alert(
                "Success",
                "Profile updated successfully.",
                [
                    { text: "OK", onPress: () => navigation.navigate('Profile') }
                ]
            );
        }
    }

    const handleActionSheet = () => {
        actionSheetRef.current?.show();
    }

    const launchImgLibrary = async () => {
        
        const result = await launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
            presentationStyle: 'pageSheet'
        });

        if (result.didCancel) {
            actionSheetRef.current?.hide();
        } else if (result.errorCode) {
            Alert.alert(
                "Something went wrong!",
                result.errorMessage,
                [{ text: "OK", onPress: () => actionSheetRef.current?.hide() }]
            );
           
        } else {
            
            if (result?.assets?.length !== undefined && result.assets.length !== 0) {
                setSubmitting(true);
                for (let i = 0; i < result.assets.length; i++) {

                    const asset = result.assets[i];
                    setUserAvatar(asset.uri ?? '');

                    const file_name = asset.fileName ?? '';
                    const file_type = asset.type ?? '';
                    const file_uri = asset.uri ?? '';
                    const file_data = await uploadAvatarFile(file_name, file_type, file_uri);
                    

                    for (let f = 0; f < file_data.length; f++) {

                        const file = file_data[f];
                        const { data } = await updateProfile(user.id, { avatar_id: file.id, avatar_url: file.url });
                        if (data) {
                            
                            dispatch(setUser(data.attributes));
                            setUserData(data.attributes);
                            setSubmitting(false);
                            Alert.alert(
                                "Success",
                                "Profile picture updated successfully.",
                                [{ text: "OK", onPress: () => actionSheetRef.current?.hide() }]
                            );

                        }
  
                    }                    
                }
            }
        }
    }

    const takePicture = async () => {

        if (cameraRef) {
            const options = { quality: 0.2, base64: true };
            const { uri, base64 } = await cameraRef.current.takePictureAsync(options);

            console.log('uri', uri);

            let file_name = `${user.id}_avatar`
            let file_type = 'image/jpeg'
            let image_uri = uri

            let resp = await uploadAvatarFile(file_name, file_type, image_uri);
            console.log('resp', JSON.stringify(resp))
            let avatar_id = resp[0].id;
            let avatar_url = resp[0].url;

            setUserAvatar(uri);
            const { data } = await updateProfile(user.id, { avatar_id: avatar_id, avatar_url: avatar_url });

            if (data) {

                dispatch(setUser(data.attributes));
                setUserData(data.attributes);
                setSubmitting(false);
                Alert.alert(
                    "Success",
                    "Profile picture updated successfully.",
                    [{ text: "OK", onPress: () => (setCameraVisible(false), actionSheetRef.current?.hide() )}]
                );

            }
        }
    };

    const handelPickCV = async () => {
        try {
            const pickerResult = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
                type: types.pdf
            })

            let file_name = pickerResult.name ?? "cv file";
            let file_type = pickerResult.type ?? "application/pdf";
            let file_uri = pickerResult.uri ?? "";
            const file_data = await uploadFile(file_name, file_type, file_uri);

            for (let f = 0; f < file_data.length; f++) {

                const file = file_data[f];
                const { data } = await updateProfile(user.id, { cv_id: file.id, cv_url: file.url, cv_file_name: file.name });
                if (data) {

                    dispatch(setUser(data.attributes));
                    setUserData({ ...user_data, cv_file_name: data.attributes.cv_file_name });
                    setSubmitting(false);
                    Alert.alert(
                        "Success",
                        "CV updated successfully.",
                        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                    );

                }

            }

        } catch (e) {
            console.log('e', e)
        }
    }

    // add dates I cant work on
    // add video
    
    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary, width: '100%' }]}>
            <Menu menu_visible={menu_visible} setMenuVisible={setMenuVisible} />
            <View style={{ flex: .8, width: '100%', backgroundColor: theme.colors.primary, justifyContent: 'center' }}>
                <Container fluid>
                    <Row>
                        <Col style={{ justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 5 }} xs="12">
                            <IconButton
                                icon="menu"
                                iconColor={theme.colors.onPrimary}
                                size={25}
                                onPress={() => setMenuVisible(true)}
                            />
                        </Col>
                        <Col style={{ justifyContent: 'center', alignItems: 'flex-start' }} xs="8">
                            <GreetingsText />
                            <Text style={[{ marginBottom: 0, fontWeight: 'bold', color: theme.colors.onPrimary }]} variant="headlineMedium">{user.first_name}</Text>
                        </Col>
                        <Col style={{ justifyContent: 'center', alignItems: 'flex-end'}} xs="4">
                            <TouchableOpacity style={{position: "relative"}} onPress={() => handleActionSheet()}>
                                <IconButton
                                    style={{position: "absolute", bottom: -10, left: -10, backgroundColor: theme.colors.secondary}}
                                    icon="plus"
                                    mode="contained"
                                    iconColor={theme.colors.primary}
                                    size={15}
                                    onPress={() => handleActionSheet()}
                                />
                                <Avatar.Image size={80}
                                    style={{backgroundColor: theme.colors.onPrimary, position: "relative", zIndex: -1 }}
                                    source={{
                                        uri: user_avatar ? user_avatar : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
                                    }}
                                />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </Container>
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                    <Container fluid>
                        <SegmentedButtons
                            value={section}
                            onValueChange={setSection}
                            buttons={[
                                {
                                    value: 'job',
                                    label: 'Job Criteria',
                                    checkedColor: theme.colors.primary,
                                    uncheckedColor: theme.colors.primary,
                                },
                                {
                                    value: 'personal',
                                    label: 'Personal Details',
                                    checkedColor: theme.colors.primary,
                                    uncheckedColor: theme.colors.primary,
                                    
                                },
                            ]}
                        />
                        {section === 'job' &&
                            <Row style={{ justifyContent: 'center' }}>
                                {all_job_roles.length !== 0 &&
                                    <Col style={{ marginBottom: 5 }} xs="12">
                                        <Dropdown
                                            key={'all_job_roles'}
                                            label="My Job roles"
                                            placeholder="Interested in these job roles"
                                            isMultiple={true}
                                            placeholderStyle={{ color: theme.colors.primary }}
                                            dropdownContainerStyle={{ marginBottom: 0 }}
                                            dropdownIconStyle={{ top: 20 }}
                                            labelStyle={{ top: 10, left: 5 }}
                                            dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 40, paddingVertical: 10 }}
                                            options={all_job_roles.length !== 0 && all_job_roles?.map((job: { id: number, attributes: { role: string } }) => (
                                                { value: job.id, label: job.attributes.role }
                                            ))}
                                            selectedValue={user_data.job_roles}
                                            onValueChange={(value: any) => setUserData({ ...user_data, job_roles: value })}
                                            primaryColor={theme.colors.primary}
                                        />
                                    </Col>
                                }
                                {experiences.length !== 0 &&
                                    <Col style={{ marginBottom: 5 }} xs="12">
                                        <Dropdown
                                            placeholder="Previous Experience"
                                            label="My Previous Experience"
                                            placeholderStyle={{ color: theme.colors.primary }}
                                            dropdownContainerStyle={{ marginBottom: 0 }}
                                            dropdownIconStyle={{ top: 20 }}
                                            labelStyle={{ top: 10, left: 5 }}
                                            dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 50, paddingVertical: 10 }}
                                            options={experiences.length !== 0 && experiences?.map((experience: { id: number, attributes: { name: string } }) => (
                                                { value: experience.id, label: experience.attributes.name }
                                            ))}
                                            selectedValue={user_data.experience}
                                            onValueChange={(value: any) => setUserData({ ...user_data, experience: value })}
                                            primaryColor={theme.colors.primary}
                                        />
                                    </Col>
                                }
                                {preferred_hours.length !== 0 &&
                                    <Col style={{ marginBottom: 15 }} xs="12">
                                        <Dropdown
                                            placeholder="Preferred Hours"
                                            label="My Preferred Hours"
                                            isMultiple={true}
                                            placeholderStyle={{ color: theme.colors.primary }}
                                            dropdownContainerStyle={{ marginBottom: 0 }}
                                            dropdownIconStyle={{ top: 20 }}
                                            labelStyle={{ top: 10, left: 5 }}
                                            dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 40, paddingVertical: 10 }}
                                            options={preferred_hours.length !== 0 && preferred_hours?.map((hours: { id: number, attributes: { name: string } }) => (
                                                { value: hours.id, label: hours.attributes.name }
                                            ))}
                                            selectedValue={user_data.preferred_hours}
                                            onValueChange={(value: any) => setUserData({ ...user_data, preferred_hours: value })}
                                            primaryColor={theme.colors.primary}
                                        />
                                    </Col>
                                }
                                <Col style={{ marginBottom: 9 }} xs="12">
                                    <>
                                        <TextInput
                                            mode='outlined'
                                            label="CV"
                                            multiline={true}
                                            outlineColor={theme.colors.primary}
                                            outlineStyle={{ borderRadius: 15 }}
                                            value={user_data.cv_file_name}
                                            onFocus={() => handelPickCV()}
                                            onBlur={() => handelPickCV()}
                                            onTouchStart={() => handelPickCV()}
                                            onTouchEnd={() => handelPickCV()}
                                            editable={false}
                                            right={<TextInput.Icon icon="file-outline" onPress={() => handelPickCV()} />}
                                        />
                                    </>
                                </Col>
                                <Col style={{ marginBottom: 15 }} xs="12">
                                    <TextInput
                                        label={'Description'}
                                        mode='outlined'
                                        placeholder="Experience/qualifications and/or what you are doing now"
                                        multiline={true}
                                        maxLength={150}
                                        placeholderTextColor={theme.colors.primary}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={user_data.work_description}
                                        onChangeText={(text) => setUserData({ ...user_data, work_description: text })}
                                    />
                                </Col>
                                <Col style={{ marginBottom: 9 }} xs="12">
                                    <>
                                        <TextInput
                                            mode='outlined'
                                            label={'Available From'}
                                            outlineColor={theme.colors.primary}
                                            outlineStyle={{ borderRadius: 15 }}
                                            value={start_date}
                                            onFocus={() => setDateStartOpen(true)}
                                            onBlur={() => setDateStartOpen(false)}
                                            onTouchStart={() => setDateStartOpen(true)}
                                            onTouchEnd={() => setDateStartOpen(false)}
                                            editable={false}
                                            right={<TextInput.Icon icon="calendar" onPress={() => setDateStartOpen(true)} />}
                                        />
                                        <DatePickerModal
                                            presentationStyle="pageSheet"
                                            locale="en-US"
                                            visible={date_start_open}
                                            mode="single"
                                            onDismiss={handleDateStartCancel}
                                            date={new Date()}
                                            onConfirm={handleDateStartSave}
                                            saveLabel="Save"
                                            label="Select Available From"
                                            animationType="slide"
                                        />
                                    </>
                                </Col>
                                <Col style={{ marginBottom: 25 }} xs="12">
                                    <>
                                        <TextInput
                                            mode='outlined'
                                            label={'Available Until'}
                                            outlineColor={theme.colors.primary}
                                            outlineStyle={{ borderRadius: 15 }}
                                            value={end_date}
                                            onFocus={() => setDateEndOpen(true)}
                                            onBlur={() => setDateEndOpen(false)}
                                            onTouchStart={() => setDateEndOpen(true)}
                                            onTouchEnd={() => setDateEndOpen(false)}
                                            editable={false}
                                            right={<TextInput.Icon icon="calendar" onPress={() => setDateEndOpen(true)} />}
                                        />
                                        <DatePickerModal
                                            presentationStyle="pageSheet"
                                            locale="en-US"
                                            visible={date_end_open}
                                            mode="single"
                                            onDismiss={handleDateEndCancel}
                                            date={new Date()}
                                            onConfirm={handleDateEndSave}
                                            saveLabel="Save"
                                            label="Select Available Until"
                                            animationType="slide"
                                        />
                                    </>
                                </Col>
                            </Row>
                        }
                        {section === 'personal' &&
                            <Row style={{ justifyContent: 'center' }}>
                                <Col style={{ marginBottom: 9, marginTop: 25, alignItems: 'flex-start' }} xs="10">
                                    <Text style={[{ paddingTop: 4.5 }]} variant="labelLarge">Hide your profile from employers?</Text>
                                </Col>
                                <Col style={{ marginBottom: 9, marginTop: 25, alignItems: 'flex-end', }} xs="2">
                                    <Switch value={is_profile_visible} onValueChange={onToggleProfileVisibility} />
                                </Col>
                                <Col style={{ marginBottom: 9, marginTop: 5, alignItems: 'flex-start' }} xs="10">
                                    <Text style={[{ paddingTop: 4.5 }]} variant="labelLarge">Boost your profile for higher engament?</Text>
                                </Col>
                                <Col style={{ marginBottom: 9, marginTop: 5, alignItems: 'flex-end', }} xs="2">
                                    <Switch value={is_profile_boosted} onValueChange={onToggleProfileBoost} />
                                </Col>
                                <Col style={{ marginBottom: 9, marginTop: 15 }} xs="12">
                                    <TextInput
                                        mode='outlined'
                                        label="First Name"
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={user_data.first_name}
                                        onChangeText={(text) => setUserData({ ...user_data, first_name: text })}
                                    />
                                </Col>
                                <Col style={{ marginBottom: 9 }} xs="12">
                                    <TextInput
                                        mode='outlined'
                                        label="Last Name"
                                        placeholderTextColor={theme.colors.primary}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={user_data.last_name}
                                        onChangeText={(text) => setUserData({ ...user_data, last_name: text })}
                                    />
                                </Col>
                                <Col style={{ marginBottom: 9 }} xs="12">
                                    <TextInput
                                        mode='outlined'
                                        label={'Phone Number'}
                                        keyboardType="phone-pad"
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={user_data.phone_number}
                                        onChangeText={(text) => setUserData({ ...user_data, phone_number: text })}
                                    />
                                </Col>
                                <Col style={{ marginBottom: 15 }} xs="12">
                                    <>
                                        <TextInput
                                            label={'Location'}
                                            mode='outlined'
                                            multiline={true}
                                            outlineColor={theme.colors.primary}
                                            outlineStyle={{ borderRadius: 15 }}
                                            value={user_data.location}
                                            onFocus={() => setModalVisible(true)}
                                            onBlur={() => setModalVisible(false)}
                                            onTouchStart={() => setModalVisible(true)}
                                            onTouchEnd={() => setModalVisible(false)}
                                            editable={false}
                                            right={<TextInput.Icon icon="map-marker-circle" onPress={() => setModalVisible(true)} />}
                                        />
                                        <Modal
                                            style={[styles.wrapper]}
                                            animationType="slide"
                                            transparent={false}
                                            visible={modal_visible}
                                            onRequestClose={() => { setModalVisible(false) }}
                                            presentationStyle={"pageSheet"}
                                        >
                                            <View style={{ flex: 1, width: '100%', backgroundColor: theme.colors.primary }}>
                                                <View style={{ flex: .4, width: '100%', backgroundColor: theme.colors.primary, justifyContent: 'center' }}>
                                                    <Container fluid>
                                                        <Row>
                                                            <Col style={{ alignItems: 'flex-start', justifyContent: 'center' }} xs="10">
                                                                <Text style={[styles.text_white_heading]} variant="headlineSmall">Search your location.</Text>
                                                            </Col>
                                                            <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }} xs="2">
                                                                <IconButton
                                                                    icon="close"
                                                                    iconColor={theme.colors.onPrimary}
                                                                    size={30}
                                                                    onPress={() => setModalVisible(false)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </View>

                                                <View style={[{ borderTopEndRadius: 35, borderTopStartRadius: 35, padding: 16, flex: 3, width: '100%', backgroundColor: theme.colors.onPrimary, justifyContent: 'center' }]}>
                                                    <ScrollView>
                                                        <GooglePlacesAutocomplete
                                                            styles={{
                                                                textInput: {
                                                                    borderRadius: 15,
                                                                    borderWidth: 1,
                                                                    borderColor: theme.colors.primary,
                                                                    color: '#5d5d5d',
                                                                    fontSize: 16,
                                                                },
                                                                predefinedPlacesDescription: {
                                                                    color: '#1faadb',
                                                                },
                                                            }}
                                                            placeholder='Search for your location...'
                                                            fetchDetails={true}
                                                            onPress={(data, details = null) => {
                                                                console.log(data, details);
                                                                setUserData({ ...user_data, location: data.description, place_id: data.place_id, coord: { lat: `${details?.geometry.location.lat}`, lng: `${details?.geometry.location.lng}` } })
                                                                setModalVisible(false);
                                                            }}
                                                            query={{
                                                                key: MAPS_API_KEY,
                                                                language: 'en',
                                                                types: 'geocode'
                                                            }}
                                                        />
                                                    </ScrollView>
                                                </View>
                                            </View>
                                        </Modal>
                                    </>
                                </Col>
                            </Row>
                        }
                        <Button uppercase={true} mode="contained" loading={submitting} onPress={() => handelUpdateProfile()}>
                            Update Profile Detials
                        </Button>
                        <View style={{height: 100}}></View>
                    </Container>                
                </ScrollView>
            </View>
            <Modal
                style={styles.wrapper}
                animationType="slide"
                transparent={false}
                visible={camera_visible}
                onRequestClose={() => console.log('Modal closed')}
                presentationStyle={"pageSheet"}
            >

                <TouchableOpacity style={styles.modal_btn_left} onPress={() => setCameraVisible(false)} >
                    <Text style={[styles.modal_txt, { color: theme.colors.primary }]}>Close</Text>
                </TouchableOpacity>

                <RNCamera
                    ref={cameraRef}
                    style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: theme.colors.primary, width: '100%' }]}
                    type={RNCamera.Constants.Type.front}
                    captureAudio={true}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                >
                    <IconButton
                        style={{ position: 'absolute', bottom: 20, backgroundColor: theme.colors.onPrimary }}
                        icon="camera"
                        iconColor={theme.colors.primary}
                        size={50}
                        onPress={() => takePicture()}
                    />
                </RNCamera>
            </Modal>
            <ActionSheet ref={actionSheetRef}>
                <Container fluid>
                    <Row style={{padding: 16}}>
                        <Col xs="12">
                            <Button style={{ marginTop: 20 }} icon="camera" mode="contained" onPress={() => setCameraVisible(true)}>
                                Take new picture
                            </Button>
                        </Col>
                        <Col xs="12">
                            <Button style={{ marginTop: 10 }} icon="file-image-plus" mode="contained" onPress={() => launchImgLibrary()}>
                                Choose from camera roll
                            </Button>
                        </Col>
                        <Col xs="12">
                            <Button style={{ marginTop: 30 }} mode="outlined" onPress={() => actionSheetRef.current?.hide()}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </ActionSheet>
        </View>
    );
};

export default Profile;