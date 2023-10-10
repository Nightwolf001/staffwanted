import React, { FC, useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { View, Image, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { useTheme, TextInput, Button, Text, IconButton, Chip } from 'react-native-paper';

import Dropdown from 'react-native-input-select';
import { Slider } from '@miblanchard/react-native-slider';
import { DatePickerModal } from 'react-native-paper-dates';
import { Container, Row, Col } from 'react-native-flex-grid';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { ParamListBase, useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Job, JobsList } from "../../types";
import { JobCard } from "./components";

import { METRIC, MAPS_API_KEY } from "@env";
import { fetchAllJobs, fetchJobRoles, fetchPreviousExperiences, fetchPreferredHours } from "../../actions/jobs.actions";
import { Menu, GreetingsText } from "../../components";

import { styles } from "../../theme/styles";

const Home: FC = () => {

    const theme = useTheme();
    const isFocused = useIsFocused();

    const user_data = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [menu_visible, setMenuVisible] = useState(false);
    const [filter_menu_visible, setFilterMenuVisible] = useState(false);
    const [location_search, setLocationSearch] = useState(false);

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [jobsList, setJobsList] = useState<JobsList>();
    const [user, setUser] = useState<any>(user_data);

    const [all_job_roles, setAllJobRoles] = useState<any>([]);
    const [preferred_hours, setPreferredHours] = useState<any>([]);
    const [experiences, setExperiences] = useState<any>([]);

    const [filters, setFilters] = useState<any>({
        id: user.id,
        search: "",
        job_roles: user.job_roles,
        experience: user.experience,
        preferred_hours: user.preferred_hours,
        salary: 10,
        coord: user.coord,
        location: user.location,
        distance: 15,
        metric: METRIC
    });

    useEffect(() => {
        (async () => {

            if(!isFocused) return;
            setUser(user_data);
            setFilters({
                ...filters,
                job_roles: user.job_roles,
                experience: user.experience,
                preferred_hours: user.preferred_hours,
                coord: user.coord,
            })
            
            if(user.job_roles && user.experience && user.preferred_hours) {
                await fetchData();
            }
            
        })()
    }, [isFocused, user]);

    useEffect(() => {
        (async () => {
            const jobs = await fetchAllJobs(filters);
            setJobsList(jobs); 
        })()
    }, [filters.search]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const fetchData = async () => {
        let job_roles = await fetchJobRoles();
        setAllJobRoles(job_roles?.data);

        let experiences = await fetchPreviousExperiences();
        setExperiences(experiences?.data);

        let preferredHours = await fetchPreferredHours();
        setPreferredHours(preferredHours?.data);

        if (user.job_roles && user.experience && user.preferred_hours ) {
            await fetchAllJobData()
        } else {
            await fetchData();
        }
    }

    const fetchAllJobData = async () => {
        console.log('fetchAllJobData filters', filters);
        const jobs = await fetchAllJobs(filters);
        setJobsList(jobs); 
    }

    const handelFilter = async () => {
        setFilterMenuVisible(false);
        const jobs = await fetchAllJobs(filters);
        setJobsList(jobs);
    }

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary, width: '100%' }]}>
            <Menu menu_visible={menu_visible} setMenuVisible={setMenuVisible} />
            <View style={{ flex: 1.1, width: '100%', backgroundColor: theme.colors.primary, justifyContent: 'center' }}>
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
                        <Col style={{ justifyContent: 'center', alignItems: 'flex-start' }} xs="12">
                            <GreetingsText />
                            <Text style={[{ marginBottom: 0, fontWeight: 'bold', color: theme.colors.onPrimary }]} variant="headlineMedium">{user.first_name}</Text>
                        </Col>
                        <Row style={{ justifyContent: 'center'}}>

                            <Col style={{ paddingTop: 10 }} xs="10">
                                <TextInput
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    inputMode="search"
                                    mode='outlined'
                                    placeholder="Find your next gig"
                                    value={filters.search}
                                    onChangeText={(text) => setFilters({ ...filters, search: text })}
                                    outlineColor={theme.colors.onPrimary}
                                    activeOutlineColor={theme.colors.onPrimary}
                                    outlineStyle={{ backgroundColor: theme.colors.onPrimary, borderRadius: 15, width: '100%' }}
                                    left={<TextInput.Icon icon="book-search-outline" />}
                                />
                            </Col>
                            <Col style={{ paddingTop: 15 }} xs="1">
                                <IconButton
                                    icon="filter"
                                    mode="contained"
                                    iconColor={theme.colors.primary}
                                    style={{backgroundColor: theme.colors.onPrimary}}
                                    size={25}
                                    onPress={() => setFilterMenuVisible(true)}
                                />
                            </Col>
                        </Row>
                    </Row>
                </Container>
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary, marginTop: 10 }]}>
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={'#000'}
                        />
                    }
                >
                    {jobsList && jobsList.data.length !== 0 && jobsList?.data.map((item, index) => (
                        <JobCard key={index} job={item as Job} fetchData={fetchData} filterd_coord={filters.coord} navigation={navigation} />
                    ))}

                </ScrollView>
            </View>                                
            <Modal
                style={[styles.wrapper]}
                animationType="slide"
                transparent={false}
                visible={filter_menu_visible}
                onRequestClose={() => { setFilterMenuVisible(false) }}
                presentationStyle={"pageSheet"}
            >
                <View style={{ flex: 1, width: '100%', backgroundColor: theme.colors.primary }}>
                    <View style={{ flex: .4, width: '100%', backgroundColor: theme.colors.primary, justifyContent: 'center' }}>
                        <Container fluid>
                            <Row style={{ justifyContent: 'center' }}>
                                <Col style={{ alignItems: 'flex-start', justifyContent: 'center' }} xs="6">
                                    <Text style={[styles.text_white_heading]} variant="headlineSmall">Filter Jobs</Text>
                                </Col>
                                <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }} xs="6">
                                    <IconButton
                                        icon="close"
                                        iconColor={theme.colors.onPrimary}
                                        size={30}
                                        onPress={() => setFilterMenuVisible(false)}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </View>

                    <View style={[{ borderTopEndRadius: 35, borderTopStartRadius: 35, padding: 16, flex: 3, width: '100%', backgroundColor: theme.colors.onPrimary, justifyContent: 'center' }]}>
                        <ScrollView>
                            <Container fluid>
                                <Row style={{ justifyContent: 'center' }}>
                                    <Col style={{ marginTop: 15 }} xs="12">
                                        <Text style={{ textAlign: "center" }} variant={"labelLarge"}>Search within a {filters.distance} {METRIC} radius</Text>
                                        <Slider
                                            thumbTintColor={theme.colors.primary}
                                            maximumTrackTintColor={theme.colors.primary}
                                            minimumTrackTintColor={"#96C4E2"}
                                            step={5}
                                            maximumValue={100}
                                            value={filters.distance}
                                            onValueChange={value => setFilters({ ...filters, distance: value })}
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
                                                value={filters.location}
                                                onFocus={() => setLocationSearch(true)}
                                                onBlur={() => setLocationSearch(false)}
                                                onTouchStart={() => setLocationSearch(true)}
                                                onTouchEnd={() => setLocationSearch(false)}
                                                editable={false}
                                                right={<TextInput.Icon icon="map-marker-circle" onPress={() => setLocationSearch(true)} />}
                                            />
                                            <Modal
                                                style={[styles.wrapper]}
                                                animationType="slide"
                                                transparent={false}
                                                visible={location_search}
                                                onRequestClose={() => { setLocationSearch(false) }}
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
                                                                        onPress={() => setLocationSearch(false)}
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
                                                                    setFilters({ ...filters, location: data.description, coord: { lat: `${details?.geometry.location.lat}`, lng: `${details?.geometry.location.lng}` } })
                                                                    setLocationSearch(false);
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
                                        <Col style={{ marginBottom: 5 }} xs="12">
                                            <Dropdown
                                                label="Interested in these job roles"
                                                key={'all_job_roles'}
                                                placeholder="Interested in these job roles..."
                                                isMultiple={true}
                                                placeholderStyle={{ color: theme.colors.primary }}
                                                dropdownContainerStyle={{ marginBottom: 0 }}
                                                dropdownIconStyle={{ top: 20 }}
                                                labelStyle={{ top: 10, left: 5 }}
                                                dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 40, paddingVertical: 10 }}
                                                options={all_job_roles.length !== 0 && all_job_roles?.map((job: { id: number, attributes: { role: string } }) => (
                                                    { value: job.id, label: job.attributes.role }
                                                ))}
                                                selectedValue={filters.job_roles}
                                                onValueChange={(value: any) => setFilters({ ...filters, job_roles: value })}
                                                primaryColor={theme.colors.primary}
                                            />
                                        </Col>
                                    }
                                    {experiences.length !== 0 &&
                                        <Col style={{ marginBottom: 5 }} xs="12">
                                            <Dropdown
                                                label="Previous Experience"
                                                placeholder="Previous Experience"
                                                placeholderStyle={{ color: theme.colors.primary }}
                                                dropdownContainerStyle={{ marginBottom: 0 }}
                                                dropdownIconStyle={{ top: 20 }}
                                                labelStyle={{ top: 10, left: 5 }}
                                                dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 50, paddingVertical: 10 }}
                                                options={experiences.length !== 0 && experiences?.map((experience: { id: number, attributes: { name: string } }) => (
                                                    { value: experience.id, label: experience.attributes.name }
                                                ))}
                                                selectedValue={filters.experience}
                                                onValueChange={(value: any) => setFilters({ ...filters, experience: value })}
                                                primaryColor={theme.colors.primary}
                                            />
                                        </Col>
                                    }
                                    {preferred_hours.length !== 0 &&
                                        <Col style={{ marginBottom: 15 }} xs="12">
                                            <Dropdown
                                                label="Preferred Hours"
                                                placeholder="Preferred Hours"
                                                isMultiple={true}
                                                placeholderStyle={{ color: theme.colors.primary }}
                                                dropdownContainerStyle={{ marginBottom: 0 }}
                                                dropdownIconStyle={{ top: 20 }}
                                                labelStyle={{ top: 10, left: 5 }}
                                                dropdownStyle={{ borderRadius: 15, backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, minHeight: 40, paddingVertical: 10 }}
                                                options={preferred_hours.length !== 0 && preferred_hours?.map((hours: { id: number, attributes: { name: string } }) => (
                                                    { value: hours.id, label: hours.attributes.name }
                                                ))}
                                                selectedValue={filters.preferred_hours}
                                                onValueChange={(value: any) => setFilters({ ...filters, preferred_hours: value })}
                                                primaryColor={theme.colors.primary}
                                            />
                                        </Col>
                                    }
                                    {/* <Col style={{ marginBottom: 15 }} xs="12"> */}
                                        {/* 
                                            wage per hour
                                            salary anualy
                                            high to low
                                            low to high

                                        */}
                                        {/* <Text style={{ textAlign: "center" }} variant={"labelLarge"}>Search by salary {filters.salary}</Text>
                                        <Slider
                                            thumbTintColor={theme.colors.primary}
                                            maximumTrackTintColor={theme.colors.primary}
                                            minimumTrackTintColor={"#96C4E2"}
                                            step={5}
                                            maximumValue={1000}
                                            value={filters.salary}
                                            onValueChange={value => setFilters({ ...filters, salary: value })}
                                        />
                                    </Col> */}
                                    <Col style={{ alignItems: 'flex-start', justifyContent: 'center' }} xs="12">
                                        <Button onPress={() => { handelFilter() }} style={{ width: '100%', marginBottom: 10 }} mode="contained" color={theme.colors.primary} labelStyle={{ color: theme.colors.onPrimary }}>Apply Filters</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Home;