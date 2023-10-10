import React, { useEffect, useState, useMemo } from "react";

import { useTheme, Button, Text, IconButton } from 'react-native-paper';
import { View, Image, ScrollView, Animated, TouchableOpacity, Alert, Dimensions } from "react-native";

import MapView, { Marker } from 'react-native-maps';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Container, Row, Col } from 'react-native-flex-grid';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation, RouteProp, useIsFocused } from '@react-navigation/native';

import { styles } from "../../theme/styles";
import { EmployerAttributes, RootStackParamList } from '../../types';


type EmployerScreenRouteProp = RouteProp<RootStackParamList, 'Employer'>;
type Props = { route: EmployerScreenRouteProp };

const Employer = ({ route }: Props) => {

    const { id, attributes } = route.params;
    // add distance away from job
    const { company_name, company_avatar_url, company_location, company_description, company_email, company_number, company_website, coords }: EmployerAttributes = attributes;

    const theme = useTheme();
    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            if(!isFocused) return;
        })()
    }, [isFocused]);

    const Markers = useMemo(() => {
        if(!coords) return;
        return (
            <Marker
                key={id}
                tracksViewChanges={false}
                pinColor={theme.colors.primary}
                coordinate={{
                    latitude: parseFloat(coords.lat),
                    longitude: parseFloat(coords.lng),
                }}
                title={company_name}
            >
                <View>
                    <Image style={[styles.icon, { tintColor: theme.colors.primary }]} resizeMode='contain' source={require(`../../assets/icons/location.png`)} />
                </View>
            </Marker>
        );
    }, [coords]);

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary, width: '100%' }]}>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1, width: '100%' }}>
                    <Container style={{ position: "relative", flex: 1 }} fluid>
                        <Row>
                            <Col xs="12" style={{ alignItems: 'center', marginBottom: 10 }}>
                                <Image source={{ uri: company_avatar_url, }} style={styles.job_image} />
                            </Col>
                            <Col xs="12">
                                <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant="labelLarge" >{company_name}</Text>
                                <Button icon="map-marker-circle" mode="text" onPress={() => console.log('Pressed')}>
                                    <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="bodyMedium" >{company_location}</Text>
                                </Button>
                                <Button icon="web" mode="text" onPress={() => console.log('Pressed')}>
                                    <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="bodyMedium" >{company_website}</Text>
                                </Button>
                                <Button icon="email" mode="text" onPress={() => console.log('Pressed')}>
                                    <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="bodyMedium" >{company_email}</Text>
                                </Button>
                                <Button icon="phone" mode="text" onPress={() => console.log('Pressed')}>
                                    <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="bodyMedium" >{company_number}</Text>
                                </Button>
                            </Col>
                            <Col xs="12">
                                <Text style={{ fontWeight: 'bold', textAlign: 'left', paddingTop: 15 }} variant="labelLarge" >About Us</Text>
                                <Text style={{ fontWeight: '400', textAlign: 'left', paddingTop: 5 }} variant="bodySmall" >{company_description}</Text>
                            </Col>
                            {coords &&
                            <Col xs="12">
                                <Text style={{ fontWeight: 'bold', textAlign: 'left', paddingTop: 15, paddingBottom: 5 }} variant="labelLarge" >Our Headquaters</Text>
                                <View style={{ minHeight: 250 }}>
                                    <MapView
                                        style={{ ...styles.absoluteFillObject }}
                                        initialRegion={{
                                            latitude: parseFloat(coords.lat),
                                            longitude: parseFloat(coords.lng),
                                            latitudeDelta: 0.0025,
                                            longitudeDelta: 0.0025,
                                        }}
                                    >
                                        {Markers}
                                    </MapView>
                                </View>
                            </Col>
                            }
                        </Row>
                    </Container>
                </ScrollView>
            </View>
        </View>
    );
};

export default Employer;