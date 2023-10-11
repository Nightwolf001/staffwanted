import React, { FC, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import moment from 'moment';
import Dropdown from 'react-native-input-select';
import ActionSheet from 'react-native-actions-sheet';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { DatePickerModal } from 'react-native-paper-dates';
import { Container, Row, Col } from 'react-native-flex-grid';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme, TextInput, Button, Text } from 'react-native-paper';
import { View, Image, ScrollView, Modal, TouchableOpacity, Alert } from "react-native";
import DocumentPicker, { DirectoryPickerResponse, DocumentPickerResponse, isCancel, isInProgress, types } from 'react-native-document-picker'

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { User } from '../../types';
import { updateProfile, uploadFile } from "../../actions/account.actions";
import { fetchJobRoles, fetchPreviousExperiences, fetchPreferredHours } from "../../actions/jobs.actions";

import { styles } from "../../theme/styles";
import { setUser } from "../../redux/reducers/user.reducer";

const CreateProfileCriteria: FC = () => {

    const actionSheetRef = useRef<ActionSheetRef>(null);

    const theme = useTheme();
    const dispatch = useDispatch();
    const user_state = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [all_job_roles, setAllJobRoles] = useState<any>([]);
    const [preferred_hours, setPreferredHours] = useState<any>([]);
    const [experiences, setExperiences] = useState<any>([]);
    const [date_start_open, setDateStartOpen] = useState(false);
    const [date_end_open, setDateEndOpen] = useState(false);

    const [start_date, setStartDate] = useState<any>(null);
    const [end_date, setEndDate] = useState<any>(null);

    const [user, setUserData] = useState<User>(user_state);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [cv_result, setCVResult] = useState<Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null>()

    useEffect(() => {
        (async () => {

            let jobs = await fetchJobRoles();
            setAllJobRoles(jobs?.data);

            let experiences = await fetchPreviousExperiences();
            setExperiences(experiences?.data);

            let preferredHours = await fetchPreferredHours();
            setPreferredHours(preferredHours?.data);

            setStartDate('');
            setEndDate('');

        })()
    }, []);

    console.log('setUserData', user);

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
                "Search criteria updated successfully.",
                [{ text: "OK", onPress: () => navigation.navigate('CreateProfileVideo') }]
            );
        } else {
            Alert.alert(
                "Something went wrong!",
                "Please try again later.",
                [{ text: "OK", onPress: () => setSubmitting(false) }]
            );
        }
    }

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
                const { data } = await updateProfile(user_state.id, { cv_id: file.id, cv_url: file.url, cv_file_name: file.name });
                if (data) {

                    dispatch(setUser(data.attributes));
                    setUserData({ ...user, cv_file_name: data.attributes.cv_file_name });
                    setSubmitting(false);
                    Alert.alert(
                        "Success",
                        "CV updated successfully.",
                        [{ text: "OK", onPress: () => actionSheetRef.current?.hide() }]
                    );

                }

            }

        } catch (e) {
            console.log('e', e)
        }
    }

    const handleActionSheet = () => {
        actionSheetRef.current?.show();
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
                            {all_job_roles.length !== 0 &&
                            <Col style={{ marginBottom: 9 }} xs="12">
                                <Dropdown
                                    key={'all_job_roles'}
                                    placeholder="Interested in these job roles..."
                                    isMultiple={true}
                                    dropdownContainerStyle={{ marginBottom: 0 }}
                                    dropdownIconStyle={{ top: 20 }}
                                    labelStyle={{ top: 10, left: 5 }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 40, paddingVertical: 15 }}
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
                                    dropdownContainerStyle={{ marginBottom: 0 }}
                                    dropdownIconStyle={{ top: 20 }}
                                    labelStyle={{ top: 10, left: 5 }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 40, paddingVertical: 15 }}
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
                                    dropdownContainerStyle={{ marginBottom: 0 }}
                                    dropdownIconStyle={{ top: 20 }}
                                    labelStyle={{ top: 10, left: 5 }}
                                    dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 40, paddingVertical: 15 }}
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
                                        label="Upload CV"
                                        placeholderTextColor={theme.colors.primary}
                                        outlineColor={theme.colors.primary}
                                        outlineStyle={{ borderRadius: 15 }}
                                        value={user.cv_file_name}
                                        onFocus={() => handelPickCV()}
                                        onBlur={() => handelPickCV()}
                                        onTouchStart={() => handelPickCV()}
                                        onTouchEnd={() => handelPickCV()}
                                        editable={false}
                                        right={<TextInput.Icon icon="file-outline" onPress={() => handelPickCV()} />}
                                    />
                                </>
                            </Col>
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
                                <Button uppercase={true} mode="contained" loading={submitting} onPress={() => handleUpdateProfile()}>
                                    Save Search Criteria
                                </Button>
                            </Col>  
                        </Row>
                    </Container>
                </ScrollView>
            </View>

            <ActionSheet ref={actionSheetRef}>
                <Container fluid>
                    <Row style={{ padding: 16 }}>
                        <Col xs="12">
                            <Button style={{ marginTop: 10 }} icon="file-image-plus" mode="contained" onPress={() => actionSheetRef.current?.hide()}>
                                Choose CV File
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

export default CreateProfileCriteria;