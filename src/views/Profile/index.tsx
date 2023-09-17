import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import moment from 'moment';


import { View, Image, ScrollView, Modal, TouchableOpacity } from "react-native";
import { useTheme, TextInput, Button, Text, IconButton, Avatar } from 'react-native-paper';

import Video from 'react-native-video';
import { RNCamera } from 'react-native-camera';
import Dropdown from 'react-native-input-select';
import { DatePickerModal } from 'react-native-paper-dates';
import { Container, Row, Col } from 'react-native-flex-grid';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


import { User } from '../../types';
import { fetchJobRoles, fetchPreviousExperiences, fetchPreferredHours } from "../../actions/jobs.actions";
import { createProfile, fetchGenders, uploadFile } from "../../actions/account.actions";

import { styles } from "../../theme/styles";

const Profile: FC = () => {

    let videoRef = useRef<any>();
    let cameraRef = useRef<any>();

    const theme = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [all_job_roles, setAllJobRoles] = useState<any>([]);
    const [all_genders, setAllGenders] = useState<any>([]);
    const [preferred_hours, setPreferredHours] = useState<any>([]);
    const [experiences, setExperiences] = useState<any>([]);
    const [date_dob_open, setDateDobOpen] = useState(false);
    const [date_start_open, setDateStartOpen] = useState(false);
    const [date_end_open, setDateEndOpen] = useState(false);

    const [dob, setDob] = useState<any>(null);
    const [start_date, setStartDate] = useState<any>(null);
    const [end_date, setEndDate] = useState<any>(null);

    const [user_data, setUserData] = useState<User>(user);

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

            setDob(user_data.date_of_birth);
            setStartDate(user_data.start_date);
            setEndDate(user_data.end_date);

        })()
    }, []);


    const handleDateDobSave = (dob: any) => {
        const momentDate = moment(dob.date);
        if (!momentDate.isValid()) {
            console.log('Invalid date');
            return;
        }
        const formattedDate = momentDate.format('DD-MM-YYYY');

        setDob(formattedDate);
        setUserData({ ...user_data, date_of_birth: formattedDate });
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

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary }]}>
            <View style={{ flex: .8, width: '100%', backgroundColor: theme.colors.primary, justifyContent: 'center' }}>
                <Container fluid>
                    <Row>
                        <Col style={{ justifyContent: 'center', alignItems: 'flex-start' }} xs="8">
                            <Text style={[{ marginBottom: 0, color: theme.colors.onPrimary }]} variant="headlineSmall">Good Afternoon</Text>
                            <Text style={[{ marginBottom: 0, fontWeight: 'bold', color: theme.colors.onPrimary }]} variant="headlineMedium">{user.first_name}</Text>
                        </Col>
                        <Col style={{ justifyContent: 'center', alignItems: 'flex-end'}} xs="4">
                            <Avatar.Image size={80}
                                style={{backgroundColor: theme.colors.onPrimary }}
                                source={{
                                    uri: `http://localhost:1337/${user.avatar_id?.url}`
                                }}
                            />
                        </Col>
                    </Row>
                </Container>
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                    <Text style={[styles.text_light_blue_heading, { paddingTop: 10 }]} variant="headlineSmall">Manage profile.</Text>
                    <Container fluid>
                        <Row>
                            <Col style={{ marginBottom: 9, marginTop: 5 }} xs="12">
                                <TextInput
                                    label={'First Name'}
                                    mode='outlined'
                                    placeholder="First Name"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user_data.first_name}
                                    onChangeText={(text) => setUserData({ ...user_data, first_name: text })}
                                />
                            </Col>
                            <Col style={{ marginBottom: 9 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    label={'Last Name'}
                                    placeholder="Last Name"
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
                                    placeholder="Phone Number"
                                    keyboardType="phone-pad"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user_data.phone_number}
                                    onChangeText={(text) => setUserData({ ...user_data, phone_number: text })}
                                />
                            </Col>
                            <Col style={{ marginBottom: 15 }} xs="12">
                                <>
                                    <TextInput
                                        mode='outlined'
                                        label={'Date of Birth'}
                                        placeholder="Date of Birth"
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
                                <TextInput
                                    label={'Location'}
                                    mode='outlined'
                                    placeholder="Location"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.location}
                                    onChangeText={(text) => setUserData({ ...user, location: text })}
                                />
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
                                    label={'Description'}
                                    mode='outlined'
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
                                <Col style={{ marginBottom: 15 }} xs="12">
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
                                        label={'Available From'}
                                        placeholder="Available From"
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
                                        label={'Available Until'}
                                        placeholder="Available Until"
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
                        </Row>
                        <View style={{height: 100}}></View>
                    </Container>                
                </ScrollView>
            </View>
        </View>
    );
};

export default Profile;