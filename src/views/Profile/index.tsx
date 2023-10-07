import React, { FC, useEffect, useRef, useState } from "react";

import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';

import { View, ScrollView, Modal, Alert } from "react-native";
import { useTheme, TextInput, Button, Text, IconButton, Avatar, SegmentedButtons, Switch } from 'react-native-paper';

import moment from 'moment';
import Video from 'react-native-video';
import { RNCamera } from 'react-native-camera';
import Dropdown from 'react-native-input-select';
import { DatePickerModal } from 'react-native-paper-dates';
import { Container, Row, Col } from 'react-native-flex-grid';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { ParamListBase, useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Menu, GreetingsText } from "../../components";

import { User } from '../../types';
import { setUser } from '../../redux/reducers/user.reducer';
import { fetchJobRoles, fetchPreviousExperiences, fetchPreferredHours } from "../../actions/jobs.actions";
import { updateProfile, fetchGenders, uploadFile } from "../../actions/account.actions";

import { MAPS_API_KEY } from '@env';
import { styles } from "../../theme/styles";

const Profile: FC = () => {

    let videoRef = useRef<any>();
    let cameraRef = useRef<any>();

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

    const [section, setSection] = React.useState('job');

    const [user_data, setUserData] = useState<User>(user);

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

    // add dates I camt work on
    // add CV
    // add video
    // add profile picture
    
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
                            <Avatar.Image size={80}
                                style={{backgroundColor: theme.colors.onPrimary }}
                                source={{
                                    uri: `http://localhost:1337/${user.avatar_url}`
                                }}
                            />
                        </Col>
                    </Row>
                </Container>
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                    {/* <Text style={[styles.text_light_blue_heading, { paddingTop: 10 }]} variant="headlineSmall">Manage your profile</Text> */}
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
        </View>
    );
};

export default Profile;