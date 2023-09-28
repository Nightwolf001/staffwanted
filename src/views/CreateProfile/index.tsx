import React, { FC, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import moment from 'moment';
import { RNCamera } from 'react-native-camera';
import Dropdown from 'react-native-input-select';
import { DatePickerModal } from 'react-native-paper-dates';
import { Container, Row, Col } from 'react-native-flex-grid';
import { View, Image, ScrollView, Modal, TouchableOpacity } from "react-native";
import { useTheme, TextInput, Button, Text, IconButton, Avatar } from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { User } from '../../types';
import { createProfile, fetchGenders, uploadFile } from "../../actions/account.actions";
import { fetchJobRoles, fetchPreviousExperiences, fetchPreferredHours } from "../../actions/jobs.actions";

import { MAPS_API_KEY } from '@env';
import { styles } from "../../theme/styles";
import { setUser } from "../../redux/reducers/user.reducer";

const CreateProfile: FC = () => {

    let cameraRef = useRef<any>();

    const theme = useTheme();
    const dispatch = useDispatch();
    const user_state = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [all_job_roles, setAllJobRoles] = useState<any>([]);
    const [all_genders, setAllGenders] = useState<any>([]);
    const [preferred_hours, setPreferredHours] = useState<any>([]);
    const [experiences, setExperiences] = useState<any>([]);
    const [date_dob_open, setDateDobOpen] = useState(false);
    const [date_start_open, setDateStartOpen] = useState(false);
    const [date_end_open, setDateEndOpen] = useState(false);
    const [modal_visible, setModalVisible] = useState<boolean>(false);
    const [profile_image, setProfileImage] = useState<string>('');

    const [dob, setDob] = useState<any>(null);
    const [start_date, setStartDate] = useState<any>(null);
    const [end_date, setEndDate] = useState<any>(null);
    const [location_modal_visible, setLocationModalVisible] = useState<boolean>(false);

    const [user, setUserData] = useState<User>(user_state);
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        (async () => {

            let genders = await fetchGenders();
            setAllGenders(genders?.data);

            let jobs = await fetchJobRoles();
            setAllJobRoles(jobs?.data);

            let experiences = await fetchPreviousExperiences();
            setExperiences(experiences?.data);

            let preferredHours = await fetchPreferredHours();
            setPreferredHours(preferredHours?.data);

            setDob('');
            setStartDate('');
            setEndDate('');

            // setUserData({ ...user, avatar_id: 99999 });

        })()
    }, []);

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

    const handleDateStartSave = (start_date: any) => {
        const momentDate = moment(start_date.date);
        if (!momentDate.isValid()) {
            console.log('Invalid date');
            return;
        }
        const formattedDate = momentDate.format('DD-MM-YYYY');

        setStartDate(formattedDate);
        setUserData({ ...user, start_date: formattedDate });
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
        setUserData({ ...user, end_date: formattedDate });
        setDateEndOpen(false);
    };
    const handleDateEndCancel = () => {
        setDateEndOpen(false);
    };

    const handleCreateProfile = async () => {
        setSubmitting(true);
        
        dispatch(setUser(user));
        let response = await createProfile(user);
        setSubmitting(false);
        console.log('data', response.data);

        if (response !== 9001) {
            navigation.navigate('CreateProfileVideo');
        } else {
            // onToggleSnackBar();
        }
    }

    const takePicture = async () => {
        if (cameraRef) {
            const options = { quality: 0.1, base64: true };
            const {uri} = await cameraRef.current.takePictureAsync(options);

            let file_name = `${user.id}_avatar`
            let file_type = 'image/jpg'
            let image_uri = uri

            let resp = await uploadFile(file_name, file_type, image_uri);
            let avatar_id = resp[0].id;
            setProfileImage(uri);
            setUserData({ ...user, avatar_id: avatar_id });
            setModalVisible(false);

        }
    };

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
                                    icon={profile_image.length === 0 ? "account-plus" : "account-check"}
                                    iconColor={theme.colors.onPrimary}
                                    size={40}
                                    onPress={() => setModalVisible(true)}
                                />
                            </Col>
                            <Col style={{  justifyContent: 'center', alignItems: 'flex-start', }} xs="8">
                                {profile_image.length === 0 ?
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
                                        placeholderStyle={{ color: theme.colors.primary }}
                                        dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
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
                            {all_job_roles.length !== 0 &&
                                <Col style={{ marginBottom: 9 }} xs="12">
                                <Dropdown
                                    key={'all_job_roles'}
                                    placeholder="Interested in these job roles..."
                                    isMultiple={true}
                                    placeholderStyle={{ color: theme.colors.primary }}
                                    dropdownContainerStyle={{ marginBottom: 0 }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                    options={all_job_roles.length !== 0 && all_job_roles?.map((job: { id: number, attributes: { role: string } }) => (
                                        { value: job.id, label: job.attributes.role }
                                    ))}
                                    selectedValue={user.job_roles}
                                    onValueChange={(value: any) => setUserData({ ...user, job_roles: value })}
                                    primaryColor={theme.colors.primary}
                                />
                            </Col>
                            }
                            <Col style={{ marginBottom: 15 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    label="Experience/Qualifications"
                                    placeholder="Experience/qualifications and/or what you are doing now"
                                    multiline={true}
                                    maxLength={50}
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.work_description}
                                    onChangeText={(text) => setUserData({ ...user, work_description: text })}
                                />
                            </Col>
                            {experiences.length !== 0 &&
                            <Col style={{ marginBottom: 15}} xs="12">
                                <Dropdown
                                    placeholder="Previous Experience"
                                    placeholderStyle={{ color: theme.colors.primary }}
                                    dropdownContainerStyle={{ marginBottom: 0 }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                    options={experiences.length !== 0 && experiences?.map((experience: { id: number, attributes: { name: string } }) => (
                                        { value: experience.id, label: experience.attributes.name }
                                    ))}
                                    selectedValue={user.experience}
                                    onValueChange={(value: any) => setUserData({ ...user, experience: value })}
                                    primaryColor={theme.colors.primary}
                                />
                            </Col>
                            }
                            {preferred_hours.length !== 0 &&
                            <Col style={{ marginBottom: 9 }} xs="12">
                                <Dropdown
                                    placeholder="Preferred Hours"
                                    isMultiple={true}
                                    placeholderStyle={{ color: theme.colors.primary }}
                                    dropdownContainerStyle={{ marginBottom: 0 }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                    options={preferred_hours.length !== 0 && preferred_hours?.map((hours: { id: number, attributes: { name: string } }) => (
                                        { value: hours.id, label: hours.attributes.name }
                                    ))}
                                    selectedValue={user.preferred_hours}
                                    onValueChange={(value: any) => setUserData({ ...user, preferred_hours: value })}
                                    primaryColor={theme.colors.primary}
                                />
                            </Col> 
                            }
                            <Col style={{ marginBottom: 9 }} xs="12">
                                <>
                                    <TextInput
                                        mode='outlined'
                                        label="Available From"
                                        placeholderTextColor={theme.colors.primary}
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
                                        label="Available Until"
                                        placeholderTextColor={theme.colors.primary}
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
                            <Col style={{ marginBottom: 35 }} xs="12">
                                <Button uppercase={true} mode="contained" loading={submitting} onPress={() => handleCreateProfile()}>
                                    Save Profile Detials
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

        </View>
    );
};

export default CreateProfile;