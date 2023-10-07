import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { View, Image, ScrollView, Animated, TouchableOpacity, Alert, Dimensions } from "react-native";
import { useTheme, TextInput, Button, Text, IconButton, Avatar, Chip } from 'react-native-paper';

import { Container, Row, Col } from 'react-native-flex-grid';
import { TabView, SceneMap } from 'react-native-tab-view';

import { ParamListBase, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { JobAttributes, RootStackParamList } from '../../types';
import { styles } from "../../theme/styles";


type JobScreenRouteProp = RouteProp<RootStackParamList, 'Job'>;
type Props = { route: JobScreenRouteProp };


const jobLocation = () => (
    console.log('jobLocation'),
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const companyProfile = () => (
    console.log('companyProfile'),
    <View style={{ flex: 1, backgroundColor: '#973ab7' }} />
);


const Job = ({ route }: Props) => {

    const { job } = route.params;
    const { id, attributes } = job;
    // add distance away from job
    const { title, description, job_avatar_uri, employer, salary, location, preferred_hours, job_roles, bookmarked }: JobAttributes = attributes;

    const theme = useTheme();
    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight = Dimensions.get("window").height / 1.8;

    const user = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Description' },
        { key: 'second', title: 'Location' },
        { key: 'third', title: 'About' },
    ]);
    const [properties, setProperties] = useState<any>([]);

    useEffect(() => {

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

    }, []);

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
            </ScrollView>

        ),
    });

    const renderTabBar = (props: any) => {

        const inputRange = props.navigationState.routes.map((x : number, i :number) => i);
        return (
            <Row style={{paddingTop: 20, paddingBottom: 10}}>
                {props.navigationState.routes.map((route : any, i : number) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex : number) =>
                            inputIndex === i ? 1 : 0.5
                        ),
                    });
                    console.log('opacity', opacity)
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
                                <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant="labelLarge" >{employer.data.attributes.company_name}</Text>
                                <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="headlineSmall" >{title}</Text>
                                <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="bodyMedium" >{location}</Text>
                                <Text style={{ fontWeight: '400', textAlign: 'center', paddingTop: 5 }} variant="bodyMedium" >${salary} p/h</Text>
                            </Col>
                            <Col xs="12">
                            <View style={{ justifyContent: 'center', flexDirection: 'row', paddingTop: 10, flexWrap: 'wrap' }}>
                                {properties.length !== 0 && properties.map((item : string, index: number) => (
                                    <View key={index} style={[styles.job_pill, { backgroundColor: theme.colors.primary, marginBottom: 10 }]}><Text style={{color: theme.colors.onPrimary, fontSize: 10}}>{item}</Text></View>
                                ))}
                            </View>
                            </Col>
                        </Row>   
                    </Container>
                    <TabView
                        pagerStyle={{ width: deviceWidth - 40, alignSelf: 'center', marginTop: 20, marginBottom: 20, borderRadius: 15, backgroundColor: theme.colors.onPrimary }}
                        renderTabBar={renderTabBar}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: deviceWidth }}
                    />
                    <Button onPress={() => { console.log() }} style={{ width: '90%', marginBottom: 30 }} mode="contained">Apply for job</Button>
                </View>
            </View>
        </View>
    );
};

export default Job;