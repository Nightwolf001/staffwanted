import React, { FC, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import moment from 'moment';
import { RNCamera } from 'react-native-camera';
import Dropdown from 'react-native-input-select';
import ActionSheet from 'react-native-actions-sheet';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { DatePickerModal } from 'react-native-paper-dates';
import { Container, Row, Col } from 'react-native-flex-grid';
import { launchImageLibrary } from 'react-native-image-picker';
import { View, Image, ScrollView, Modal, TouchableOpacity, Alert } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useTheme, TextInput, Button, Text, IconButton, Avatar } from 'react-native-paper';

import { ParamListBase, useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { User } from '../../types';
import { fetchGenders, uploadFile, uploadAvatarFile, updateProfile } from "../../actions/account.actions";

import { MAPS_API_KEY } from '@env';
import { styles } from "../../theme/styles";
import { setUser } from "../../redux/reducers/user.reducer";

const CreateProfilePersonal: FC = () => {

    let cameraRef = useRef<any>();
    const actionSheetRef = useRef<ActionSheetRef>(null);

    const theme = useTheme();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const user_state = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
   
    const [all_genders, setAllGenders] = useState<any>([]);
    const [date_dob_open, setDateDobOpen] = useState(false);
    const [modal_visible, setModalVisible] = useState<boolean>(false);
    const [user_avatar, setUserAvatar] = useState<string>('');

    const [dob, setDob] = useState<any>(null);
    const [location_modal_visible, setLocationModalVisible] = useState<boolean>(false);

    const [user, setUserData] = useState<any>({});
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        (async () => {

            if(!isFocused) return;

            setUserData({ ...user,
                id: user_state.id, 
                first_name: user_state.first_name, 
                last_name: user_state.last_name, 
                date_of_birth: user_state.date_of_birth,
                gender: user_state.gender,
                location: user_state.location,
                place_id: user_state.place_id,
            });

            let genders = await fetchGenders();
            setAllGenders(genders?.data);

        })()
    }, [isFocused]);

    const handleDateDobSave = (dob : any) => {
        const momentDate = moment(dob.date);
        if (!momentDate.isValid()) {
            console.log('Invalid date');
            return;
        }
        const formattedDate = momentDate.format('DD-MM-YYYY');

        setDob(formattedDate);
        setUserData({ ...user, date_of_birth: formattedDate });
        setDateDobOpen(false);
    };

    const handleDateDobCancel = () => {
        setDateDobOpen(false);
    };

    const takePicture = async () => {
        if (cameraRef) {
            const options = { quality: 0.1, base64: true };
            const {uri} = await cameraRef.current.takePictureAsync(options);

            let file_name = `${user.id}_avatar`
            let file_type = 'image/jpg'
            let image_uri = uri

            let resp = await uploadFile(file_name, file_type, image_uri);
            let avatar_id = resp[0].id;
            let avatar_url = resp[0].url;
            setUserAvatar(uri);

            setUserData({ ...user, avatar_id: avatar_id, avatar_url: avatar_url });
            setModalVisible(false);
            actionSheetRef.current?.hide();

        }
    };

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
            console.log('ImagePicker Error: ', result.errorMessage);
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
                        const { data } = await updateProfile(user_state.id, { avatar_id: file.id, avatar_url: file.url });
                        if (data) {
                            dispatch(setUser(data.attributes));
                            setUserData({...user, avatar_id: file.id, avatar_url: file.url});
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

    const handleUpdateProfile = async () => {
        setSubmitting(true);
        console.log('user.id', user_state.id)
        const { data } = await updateProfile(user_state.id, user);
        if (data) {
            dispatch(setUser(data.attributes));
            setUserData(data.attributes);
            setSubmitting(false);
            Alert.alert(
                "Success",
                "Profile updated successfully.",
                [{text: "OK", onPress: () => navigation.navigate('CreateProfileCriteria')}]
            );
        } else {
            Alert.alert(
                "Something went wrong!",
                "Please try again later.",
                [{ text: "OK", onPress: () => setSubmitting(false) }]
            );
        }
    }

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary }]}>
            <View style={{ flex: 1, width: '100%', backgroundColor: theme.colors.primary }}>
                <Image source={require(`../../assets/images/logo_white.png`)} style={styles.xxs_image} />
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                    <Text style={[styles.text_light_blue_heading, { paddingTop: 10 }]} variant="headlineSmall">Complete your profile.</Text>
                    <Container fluid>
                        <Row>
                            <Col xs="3">
                                <IconButton
                                    style={{ backgroundColor: theme.colors.primary, width: 70, height: 70}}
                                    icon={user_avatar.length === 0 ? "account-plus" : "account-check"}
                                    iconColor={theme.colors.onPrimary}
                                    size={40}
                                    onPress={() => handleActionSheet()}
                                />
                            </Col>
                            <Col style={{  justifyContent: 'center', alignItems: 'flex-start', }} xs="8">
                                {user_avatar.length === 0 ?
                                    <Text style={[styles.text_light_blue_heading, {marginBottom: 0}]} variant="labelLarge">Add your profile image.</Text>
                                :
                                    <Text style={[styles.text_light_blue_heading, { marginBottom: 0 }]} variant="labelLarge">Change your profile image.</Text>
                                }
                            </Col>
                            <Col style={{ marginBottom: 9, marginTop: 5 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    label="First Name"
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.first_name}
                                    onChangeText={(text) => setUserData({ ...user, first_name: text })}
                                />
                            </Col>
                            <Col style={{ marginBottom: 9}} xs="12">
                                <TextInput
                                    mode='outlined'
                                    label="Last Name"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.last_name}
                                    onChangeText={(text) => setUserData({ ...user, last_name: text })}
                                />
                            </Col>
                            <Col style={{ marginBottom: 9 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    label="Phone Number"
                                    keyboardType="phone-pad"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.phone_number}
                                    onChangeText={(text) => setUserData({ ...user, phone_number: text })}
                                />
                            </Col>
                            <Col style={{ marginBottom: 15 }} xs="12">
                                <>
                                    <TextInput
                                        mode='outlined'
                                        label="Date of Birth"
                                        placeholderTextColor={theme.colors.primary}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={dob}
                                        onFocus={() => setDateDobOpen(true)}
                                        onBlur={() => setDateDobOpen(false)}
                                        onTouchStart={() => setDateDobOpen(true)}
                                        onTouchEnd={() => setDateDobOpen(false)}
                                        editable={false}
                                        right={<TextInput.Icon icon="calendar" onPress={() => setDateDobOpen(true)} />}
                                    />
                                    <DatePickerModal
                                        presentationStyle="pageSheet"
                                        locale="en-US"
                                        visible={date_dob_open}
                                        mode="single"
                                        onDismiss={handleDateDobCancel}
                                        date={new Date()}
                                        onConfirm={handleDateDobSave}
                                        saveLabel="Save"
                                        label="Select Date of Birth"
                                        animationType="slide"
                                    />
                                </>
                            </Col>    
                            {all_genders.length !== 0 &&
                                <Col style={{ marginBottom: 9 }} xs="12">
                                    <Dropdown
                                        key={'all_genders'}
                                        placeholder="Select Gender"
                                        dropdownContainerStyle={{ marginBottom: 0 }}
                                        dropdownIconStyle={{ top: 20 }}
                                        labelStyle={{ top: 10, left: 5 }}
                                        dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 40, paddingVertical: 15 }}
                                        options={all_genders.length !== 0 && all_genders?.map((gender: { id: number, attributes: { name: string } }) => (
                                            { value: gender.id, label: gender.attributes.name }
                                        ))}
                                        selectedValue={user.gender}
                                        onValueChange={(value: any) => setUserData({ ...user, gender: value })}
                                        primaryColor={theme.colors.primary}
                                    />
                                </Col>
                            }
                            <Col style={{ marginBottom: 15 }} xs="12">
                                <>
                                    <TextInput
                                        label={'Location'}
                                        mode='outlined'
                                        multiline={false}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={user.location}
                                        onFocus={() => setLocationModalVisible(true)}
                                        onBlur={() => setLocationModalVisible(false)}
                                        onTouchStart={() => setLocationModalVisible(true)}
                                        onTouchEnd={() => setLocationModalVisible(false)}
                                        editable={false}
                                        right={<TextInput.Icon icon="map-marker-circle" onPress={() => setLocationModalVisible(true)} />}
                                    />
                                    <Modal
                                        style={[styles.wrapper]}
                                        animationType="slide"
                                        transparent={false}
                                        visible={location_modal_visible}
                                        onRequestClose={() => { setLocationModalVisible(false) }}
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
                                                                onPress={() => setLocationModalVisible(false)}
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
                                                            setUserData({ ...user, location: data.description, place_id: data.place_id })
                                                            setLocationModalVisible(false);
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
                            <Col style={{ marginBottom: 35 }} xs="12">
                                <Button uppercase={true} mode="contained" loading={submitting} onPress={() => handleUpdateProfile()}>
                                    Save Personal Detials
                                </Button>
                            </Col>  
                        </Row>
                    </Container>
                </ScrollView>
            </View>

            <Modal
                style={styles.wrapper}
                animationType="slide"
                transparent={false}
                visible={modal_visible}
                onRequestClose={() => console.log('Modal closed')}
                presentationStyle={"pageSheet"}
            >

                <TouchableOpacity style={styles.modal_btn_left} onPress={() => setModalVisible(false)} >
                    <Text style={[styles.modal_txt, { color: theme.colors.primary }]}>Close</Text>
                </TouchableOpacity>

                <RNCamera
                    ref={cameraRef}
                    style={[ { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: theme.colors.primary, width: '100%' }]}
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
                    <Row style={{ padding: 16 }}>
                        <Col xs="12">
                            <Button style={{ marginTop: 20 }} icon="camera" mode="contained" onPress={() => takePicture()}>
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

export default CreateProfilePersonal;