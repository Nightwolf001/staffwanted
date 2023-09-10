import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import moment from 'moment';

import { View, Image, ScrollView } from "react-native";
import { useTheme, TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import Dropdown from 'react-native-input-select';
import { Container, Row, Col } from 'react-native-flex-grid';


import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { User, JobRolesList, GenderList, PreferredHoursList, PreviousExperiencesList } from '../../types';
import { fetchJobRoles, fetchPreviousExperiences, fetchPreferredHours } from "../../actions/jobs.actions";
import { createProfile, fetchGenders } from "../../actions/account.actions";

import { styles } from "../../theme/styles";

const CreateProfile: FC = () => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const user_state = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [all_job_roles, setAllJobRoles] = useState<any>([]);
    const [all_genders, setAllGenders] = useState<any>([]);
    const [preferred_hours, setPreferredHours] = useState<any>([]);
    const [previous_experiences, setPreviousExperiences] = useState<any>([]);
    const [dateDobOpen, setDateDobOpen] = useState(false);
    const [dateStartOpen, setDateStartOpen] = useState(false);
    const [dateEndOpen, setDateEndOpen] = useState(false);

    const [user, setUser] = useState<User>(user_state);
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        (async () => {

            let genders = await fetchGenders();
            console.log('genders', genders)
            setAllGenders(genders?.data);

            let jobs = await fetchJobRoles();
            console.log('jobs', jobs)
            setAllJobRoles(jobs?.data);

            let previousExperiences = await fetchPreviousExperiences();
            console.log('previousExperiences', previousExperiences)
            setPreviousExperiences(previousExperiences?.data);

            let preferredHours = await fetchPreferredHours();
            console.log('preferredHours', preferredHours)
            setPreferredHours(preferredHours?.data);

        })()
    }, []);

    const handleDateDobSave = (dob : any) => {
        const momentDate = moment(dob.date);
        if (!momentDate.isValid()) {
            console.log('Invalid date');
            return;
        }
        const formattedDate = momentDate.format('DD-MM-YYYY');

        setUser({ ...user, date_of_birth: formattedDate });
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

        setUser({ ...user, start_date: formattedDate });
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

        setUser({ ...user, end_date: formattedDate });
        setDateEndOpen(false);
    };
    const handleDateEndCancel = () => {
        setDateEndOpen(false);
    };

    const handleCreateProfile = async () => {
        setSubmitting(true);
        console.log('handleCreateProfile: ', user);
        // let response = await createProfile(user);
        setSubmitting(false);
        // console.log('data', response.data);

        // if (response !== 9001) {
        //     console.log('data.attributes', response.data.attributes);
        //     dispatch(setUser(response.data.attributes));
        //     navigation.navigate('TabNavigation', { screen: 'Home' });
        // } else {
        //     onToggleSnackBar();
        // }
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
                            <Col style={{ marginBottom: 9, marginTop: 5 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    placeholder="First Name"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.first_name}
                                    onChangeText={(text) => setUser({ ...user, first_name: text })}
                                />
                            </Col>
                            <Col style={{ marginBottom: 9}} xs="12">
                                <TextInput
                                    mode='outlined'
                                    placeholder="Last Name"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.last_name}
                                    onChangeText={(text) => setUser({ ...user, last_name: text })}
                                />
                            </Col>
                            <Col style={{ marginBottom: 9 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    placeholder="Phone Number"
                                    keyboardType="phone-pad"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.phone_number}
                                    onChangeText={(text) => setUser({ ...user, phone_number: text })}
                                />
                            </Col>
                            <Col style={{ marginBottom: 15 }} xs="12">
                                <>
                                    <TextInput
                                        mode='outlined'
                                        placeholder="Date of Birth"
                                        placeholderTextColor={theme.colors.primary}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={user.date_of_birth ? moment(user.date_of_birth).format('DD-MM-YYYY') : undefined}
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
                                        visible={dateDobOpen}
                                        mode="single"
                                        onDismiss={handleDateDobCancel}
                                        date={user.date_of_birth ? new Date(user.date_of_birth) : undefined}
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
                                        // isMultiple={true}
                                        placeholderStyle={{ color: theme.colors.primary }}
                                        dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                        options={all_genders.length !== 0 && all_genders?.map((gender: { id: number, attributes: { name: string } }) => (
                                            { value: gender.id, label: gender.attributes.name }
                                        ))}
                                        selectedValue={user.gender}
                                        onValueChange={(value: any) => setUser({ ...user, gender: value })}
                                        primaryColor={theme.colors.primary}
                                    />
                                </Col>
                            }
                            <Col style={{ marginBottom: 15 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    placeholder="Location"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.location}
                                    onChangeText={(text) => setUser({ ...user, location: text })}
                                />
                            </Col>
                            {all_job_roles.length !== 0 &&
                                <Col style={{ marginBottom: 9 }} xs="12">
                                <Dropdown
                                    key={'all_job_roles'}
                                    placeholder="Interested in these job roles..."
                                    isMultiple={true}
                                    placeholderStyle={{ color: theme.colors.primary }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                    options={all_job_roles.length !== 0 && all_job_roles?.map((job: { id: number, attributes: { role: string } }) => (
                                        { value: job.id, label: job.attributes.role }
                                    ))}
                                    selectedValue={user.job_roles}
                                    onValueChange={(value: any) => setUser({ ...user, job_roles: value })}
                                    primaryColor={theme.colors.primary}
                                />
                            </Col>
                            }
                            <Col style={{ marginBottom: 15 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    placeholder="Experience/qualifications and/or what you are doing now"
                                    multiline={true}
                                    maxLength={50}
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                    value={user.work_description}
                                    onChangeText={(text) => setUser({ ...user, work_description: text })}
                                />
                            </Col>
                            {previous_experiences.length !== 0 &&
                            <Col style={{ marginBottom: 15}} xs="12">
                                <Dropdown
                                    placeholder="Previous Experience"
                                    // isMultiple={true}
                                    placeholderStyle={{ color: theme.colors.primary }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                    options={previous_experiences.length !== 0 && previous_experiences?.map((experience: { id: number, attributes: { name: string } }) => (
                                        { value: experience.id, label: experience.attributes.name }
                                    ))}
                                    selectedValue={user.previous_experience}
                                    onValueChange={(value: any) => setUser({ ...user, previous_experience: value })}
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
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                    options={preferred_hours.length !== 0 && preferred_hours?.map((hours: { id: number, attributes: { name: string } }) => (
                                        { value: hours.id, label: hours.attributes.name }
                                    ))}
                                    selectedValue={user.preferred_hours}
                                    onValueChange={(value: any) => setUser({ ...user, preferred_hours: value })}
                                    primaryColor={theme.colors.primary}
                                />
                            </Col> 
                            }
                            <Col style={{ marginBottom: 9 }} xs="12">
                                <>
                                    <TextInput
                                        mode='outlined'
                                        placeholder="Available From"
                                        placeholderTextColor={theme.colors.primary}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={user.start_date ? moment(user.start_date).format('DD-MM-YYYY') : undefined}
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
                                        visible={dateStartOpen}
                                        mode="single"
                                        onDismiss={handleDateStartCancel}
                                        date={user.start_date ? new Date(user.start_date) : undefined}
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
                                        placeholder="Available Until"
                                        placeholderTextColor={theme.colors.primary}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={user.end_date ? moment(user.end_date).format('DD-MM-YYYY') : undefined}
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
                                        visible={dateEndOpen}
                                        mode="single"
                                        onDismiss={handleDateEndCancel}
                                        date={user.end_date ? new Date(user.end_date) : undefined}
                                        onConfirm={handleDateEndSave}
                                        saveLabel="Save"
                                        label="Select Available Until"
                                        animationType="slide"
                                    />
                                </>
                            </Col>
                            <Col style={{ marginBottom: 35 }} xs="12">
                                <Button uppercase={true} mode="contained" loading={false} onPress={() => handleCreateProfile()}>
                                    Save Profile Detials
                                </Button>
                            </Col>  
                        </Row>
                    </Container>
                </ScrollView>
            </View>
        </View>
    );
};

export default CreateProfile;