import React, { useEffect, useState, useMemo } from "react";

import { useTheme, Button, Text, IconButton } from 'react-native-paper';
import { View, Image, ScrollView, Animated, TouchableOpacity, Alert, Dimensions } from "react-native";

import MapView, { Marker } from 'react-native-maps';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Container, Row, Col } from 'react-native-flex-grid';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation, RouteProp, useIsFocused } from '@react-navigation/native';

import { styles } from "../../theme/styles";
import { Employer as EmployerType, EmployerAttributes, RootStackParamList } from '../../types';


type EmployerScreenRouteProp = RouteProp<RootStackParamList, 'Employer'>;
type Props = { route: EmployerScreenRouteProp };


const Employer = ({ route }: Props) => {

    const { id, attributes } = route.params;
    // add distance away from job
    const { company_avatar_url, company_location, company_description }: EmployerAttributes = attributes;

    const theme = useTheme();
    const isFocused = useIsFocused();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const deviceWidth = Dimensions.get("window").width;

    useEffect(() => {
        (async () => {
            if(!isFocused) return;
        })()
    }, [isFocused]);

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
                                <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="bodyMedium" >{company_location}</Text>
                                <Text style={{ fontWeight: '400', textAlign: 'center', paddingTop: 5 }} variant="bodySmall" >{company_description}</Text>
                            </Col>
                        </Row>
                    </Container>
                </ScrollView>
            </View>
        </View>
    );
};

export default Employer;