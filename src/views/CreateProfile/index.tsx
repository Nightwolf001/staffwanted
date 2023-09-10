import React, { FC, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { View, Image, ScrollView } from "react-native";
import { useTheme, TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import Dropdown from 'react-native-input-select';
import { Container, Row, Col } from 'react-native-flex-grid';
import moment from 'moment';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { createProfile, fetchGenders } from "../../actions/account.actions";
import { fetchJobRoles } from "../../actions/jobs.actions";

import { styles } from "../../theme/styles";

const CreateProfile: FC = () => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [all_job_roles, setAllJobRoles] = useState<any>([]);
    const [all_genders, setAllGenders] = useState<any>([]);
    const [dateDobOpen, setDateDobOpen] = useState(false);
    const [dateStartOpen, setDateStartOpen] = useState(false);
    const [dateEndOpen, setDateEndOpen] = useState(false);

    const [dob, setDob] = useState<any>(null);
    const [start_date, setStartDate] = useState<any>(null);
    const [end_date, setEndDate] = useState<any>(null);
    const [job_roles, setJobRoles] = useState<any>({});
    const [gender, setGender] = useState<any>({});
    const [previous_experience, setPreviousExperience] = useState<any>([]);


    useEffect(() => {
        (async () => {

            let genders = await fetchGenders();
            setAllGenders(genders?.data);

            let jobs = await fetchJobRoles();
            setAllJobRoles(jobs?.data);

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
        setDateStartOpen(false);
    };
    const handleDateStartCancel = () => {
        setDateStartOpen(false);
    };

    const handleDateEndSave = (start_date: any) => {
        const momentDate = moment(start_date.date);
        if (!momentDate.isValid()) {
            console.log('Invalid date');
            return;
        }
        const formattedDate = momentDate.format('DD-MM-YYYY');

        setEndDate(formattedDate);
        setDateEndOpen(false);
    };
    const handleDateEndCancel = () => {
        setDateEndOpen(false);
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
                            <Col style={{ marginBottom: 9, marginTop: 5 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    placeholder="First Name"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                />
                            </Col>
                            <Col style={{ marginBottom: 9}} xs="12">
                                <TextInput
                                    mode='outlined'
                                    placeholder="Last Name"
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
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
                                        visible={dateDobOpen}
                                        mode="single"
                                        onDismiss={handleDateDobCancel}
                                        date={dob}
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
                                        isMultiple={true}
                                        placeholderStyle={{ color: theme.colors.primary }}
                                        dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                        options={all_genders.length !== 0 && all_genders?.map((gender: { id: number, attributes: { name: string } }) => (
                                            { value: gender.id, label: gender.attributes.name }
                                        ))}
                                        selectedValue={gender}
                                        onValueChange={(value: any) => setGender(value)}
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
                                    selectedValue={job_roles}
                                    onValueChange={(value: any) => setJobRoles(value)}
                                    primaryColor={theme.colors.primary}
                                />
                            </Col>
                            }
                            <Col style={{ marginBottom: 15 }} xs="12">
                                <TextInput
                                    mode='outlined'
                                    placeholder="Experience/qualifications and/or what you are doing now"
                                    multiline={true}
                                    placeholderTextColor={theme.colors.primary}
                                    outlineColor={theme.colors.primary}
                                    outlineStyle={{ borderRadius: 15 }}
                                />
                            </Col>
                            <Col style={{ marginBottom: 15}} xs="12">
                                <Dropdown
                                    placeholder="Previous Experience"
                                    isMultiple={true}
                                    placeholderStyle={{ color: theme.colors.primary }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                    options={[
                                        { label: 'None', value: 'none' },
                                        { label: '0 - 3 Months', value: 'zero to three months' },
                                        { label: '3 - 12 Months', value: 'three to twelve months' },
                                        { label: '12 Months +', value: 'twelve months plus' },
                                    ]}
                                    selectedValue={previous_experience}
                                    onValueChange={(value: any) => setPreviousExperience(value)}
                                    primaryColor={theme.colors.primary}
                                />
                            </Col>  
                            <Col style={{ marginBottom: 9 }} xs="12">
                                <Dropdown
                                    placeholder="Preferred Hours"
                                    isMultiple={true}
                                    placeholderStyle={{ color: theme.colors.primary }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface }}
                                    options={[
                                        { label: 'Part Time', value: 'part time' },
                                        { label: 'Full Time', value: 'full time' },
                                        { label: 'Weekends', value: 'weekends' },
                                        { label: 'Night Shift', value: 'night shift,' },
                                        { label: 'Flexible', value: 'flexible' },
                                    ]}
                                    selectedValue={previous_experience}
                                    onValueChange={(value: any) => setPreviousExperience(value)}
                                    primaryColor={theme.colors.primary}
                                />
                            </Col> 
                            <Col style={{ marginBottom: 9 }} xs="12">
                                <>
                                    <TextInput
                                        mode='outlined'
                                        placeholder="Available From"
                                        placeholderTextColor={theme.colors.primary}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={dob}
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
                                        date={start_date}
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
                                        visible={dateEndOpen}
                                        mode="single"
                                        onDismiss={handleDateEndCancel}
                                        date={end_date}
                                        onConfirm={handleDateEndSave}
                                        saveLabel="Save"
                                        label="Select Available Until"
                                        animationType="slide"
                                    />
                                </>
                            </Col>
                            <Col style={{ marginBottom: 35 }} xs="12">
                                <Button uppercase={true} mode="contained" loading={false} onPress={() => console.log('pressed')}>
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