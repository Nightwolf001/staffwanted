import React, { useEffect, useState } from "react";

import { View, Image, ScrollView, Animated, TouchableOpacity, Alert, Dimensions } from "react-native";
import { useTheme, Button, Text, IconButton } from 'react-native-paper';

import { TabView, SceneMap } from 'react-native-tab-view';
import { Container, Row, Col } from 'react-native-flex-grid';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation, RouteProp, useIsFocused } from '@react-navigation/native';

import { styles } from "../../theme/styles";
import { fetchJobStatus, handleJobApplication, handleJobBookmark } from "../../actions/jobs.actions";
import { JobAttributes, RootStackParamList } from '../../types';


type JobScreenRouteProp = RouteProp<RootStackParamList, 'Job'>;
type Props = { route: JobScreenRouteProp };


const jobLocation = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const Job = ({ route }: Props) => {

    const { job } = route.params;
    const { id, attributes } = job;

    // add distance away from job
    const { title, description, job_avatar_uri, employer, salary, location, preferred_hours, job_roles }: JobAttributes = attributes;

    const theme = useTheme();
    const isFocused = useIsFocused();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const deviceWidth = Dimensions.get("window").width;

    const [routes] = useState([
        { key: 'first', title: 'Description' },
        { key: 'second', title: 'Location' },
        { key: 'third', title: 'About' },
    ]);
    const [index, setIndex] = useState(0);
    const [properties, setProperties] = useState<any>([]);

    const [applied, setApplied] = useState<boolean>(false);
    const [bookmarked, setBookmarked] = useState<boolean>(false);
    const [application_status, setApplicationStatus] = useState<string>('');
    
    useEffect(() => {
        (async () => {
            if(!isFocused) return;

            let job_status = await fetchJobStatus(id);
            console.log('job_status', job_status); 
            if(job_status.data.id) {
                setApplied(job_status.data.attributes.applied);
                setBookmarked(job_status.data.attributes.bookmarked);
                setApplicationStatus(job_status.data.attributes.application_status);
            }

            let properties: any = [];
            if (job_roles.data.length !== 0) {
                for (let i = 0; i < job_roles.data.length; i++) {
                    const item = job_roles.data[i];
                    properties.push(item.attributes.role);
                }
            }
            
            if (preferred_hours.data.length !== 0) {
                for (let i = 0; i < preferred_hours.data.length; i++) {
                    const item = preferred_hours.data[i];
                    properties.push(item.attributes.name);
                }
            }

            setProperties(properties);
        })()
    }, [isFocused]);

    const renderScene = SceneMap({
        first: () => (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text variant="bodyMedium">{description}</Text>
            </ScrollView>
            
        ),
        second: jobLocation,
        third: () => (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text variant="bodyMedium">{employer.data.attributes.company_description}</Text>
                <Button style={{ width: '100%', marginTop: 30 }} mode="outlined">View Company Profile</Button>
            </ScrollView>

        ),
    });

    const renderTabBar = (props: any) => {

        const inputRange = props.navigationState.routes.map((x : number, i :number) => i);
        return (
            <Row style={{paddingTop: 10}}>
                {props.navigationState.routes.map((route : any, i : number) => {

                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex : number) =>
                            inputIndex === i ? 1 : 0.5
                        ),
                    });
                    
                    return (
                        <Col>
                            <TouchableOpacity onPress={() => setIndex(i)}>
                                <Animated.Text style={{ opacity }}>
                                    <Text style={{ textAlign: "left", fontWeight: "bold", color: theme.colors.primary }}  variant="labelLarge">{route.title}</Text> 
                                </Animated.Text>
                            </TouchableOpacity>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    const apply = async (id : number, applied: boolean) => {
        let application_status = 'applied';
        let application = await handleJobApplication(id, applied, application_status);
        console.log('application', application);

        if(application.data.attributes.updated) {
            setApplied(applied);
            Alert.alert(
                "Application sent",
                "Your application has been sent to the employer",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('TabNavigation', { screen: 'Jobs' }),
                        style: "cancel"
                    }
                ]
            );
        }
    }

    const cancel = async (id: number) => {

    }

    const bookmark = async (id: number, bookmark : boolean) => {

    }

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary, width: '100%' }]}>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <View style={{ alignItems: 'center', flexGrow: 1, width: '100%' }}>
                    <Container style={{ position: "relative", flex: 1 }} fluid>
                        <Row>
                            <Col xs="12" style={{ alignItems: 'center', marginBottom: 10 }}>
                                <Image source={{ uri: job_avatar_uri }} style={styles.job_image} />
                            </Col>
                            <Col xs="12">
                                {/* <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant="labelLarge" >{employer.data.attributes.company_name}</Text> */}
                                <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant="labelLarge" >{title}</Text>
                                <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="bodyMedium" >{location}</Text>
                                <Text style={{ fontWeight: '400', textAlign: 'center', paddingTop: 5 }} variant="bodySmall" >${salary} p/h</Text>
                            </Col>
                            <Col xs="12" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ justifyContent: 'center', flexDirection: 'row', paddingTop: 10, flexWrap: 'wrap' }}>
                                    {properties.length !== 0 && properties.map((item : string, index: number) => (
                                        <View key={index} style={[styles.job_pill, { backgroundColor: theme.colors.secondary, marginBottom: 10 }]}><Text style={{color: theme.colors.onPrimary, fontSize: 10}}>{item}</Text></View>
                                    ))}
                                </View>
                            </Col>
                            {applied && application_status.length !== 0 &&
                                <Col xs="12" style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <View style={[styles.job_pill, { backgroundColor: theme.colors.primary, marginBottom: 10 }]}><Text style={{ color: theme.colors.onPrimary, fontSize: 10 }}>Applied</Text></View>
                                        <View style={[styles.job_pill, { backgroundColor: theme.colors.primary, marginBottom: 10 }]}><Text style={{ color: theme.colors.onPrimary, fontSize: 10 }}>{application_status}</Text></View>
                                    </View>
                                </Col>
                            }
                        </Row>   
                    </Container>
                    <TabView
                        onIndexChange={setIndex}
                        renderScene={renderScene}
                        renderTabBar={renderTabBar}
                        navigationState={{ index, routes }}
                        initialLayout={{ width: deviceWidth }}
                        pagerStyle={{ width: deviceWidth - 40, alignSelf: 'center', marginTop: 20, marginBottom: 20, borderRadius: 15, backgroundColor: theme.colors.onPrimary }}
                    />
                    {applied  &&
                        <Button onPress={() => { cancel(id) }} style={{ width: '90%', marginBottom: 30 }} mode="contained">Cancel Application</Button>
                    }

                    {!applied &&
                        <Container fluid>
                            <Row style={{ justifyContent: 'center' }}>
                                <Col style={{ paddingTop: 10 }} xs="10">
                                    <Button onPress={() => { apply(id, !applied) }} style={{ width: '100%', marginBottom: 30 }} mode="contained">Apply for job</Button>  
                                </Col>
                                <Col style={{ paddingTop: 5, alignItems: 'flex-start' }} xs="2">
                                    <IconButton
                                        icon={bookmarked ? "bookmark" : "bookmark-outline"}
                                        mode="contained"
                                        iconColor={theme.colors.onPrimary}
                                        style={{ backgroundColor: theme.colors.primary, marginBottom: 30, alignSelf: 'flex-start', marginLeft: -5 }}
                                        size={24}
                                        onPress={() => bookmark(id, !bookmarked)}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    }
                    
                </View>
            </View>
        </View>
    );
};

export default Job;