import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { View, Image, ScrollView, Modal, TouchableOpacity, Alert } from "react-native";
import { useTheme, TextInput, Button, Text, IconButton, Avatar, Chip } from 'react-native-paper';

import { Container, Row, Col } from 'react-native-flex-grid';

import { ParamListBase, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { JobAttributes, RootStackParamList } from '../../types';
import { styles } from "../../theme/styles";


type JobScreenRouteProp = RouteProp<RootStackParamList, 'Job'>;
type Props = { route: JobScreenRouteProp };

const Job = ({ route }: Props) => {

    const { job } = route.params;
    const { id, attributes } = job;
    const { title, description, job_avatar_uri, employer, salary, location, preferred_hours, job_roles, bookmarked }: JobAttributes = attributes;

    const theme = useTheme();
    const dispatch = useDispatch();
    const [menu_visible, setMenuVisible] = React.useState(false);
    const user = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();


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

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary, width: '100%' }]}>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
                <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                    <View style={{flex: 1}}>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <Image source={{ uri: job_avatar_uri }} style={styles.job_image} />
                        </View>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant="labelLarge" >{employer.data.attributes.company_name}</Text>
                        <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="headlineSmall" >{title}</Text>
                        <Text style={{ fontWeight: '400', textAlign: 'center' }} variant="bodyMedium" >{location}</Text>
                        <Text style={{ fontWeight: '400', textAlign: 'center', paddingTop: 5 }} variant="bodyMedium" >${salary} p/h</Text>
                        <View style={{flexDirection: 'row', paddingTop: 10}}>
                            {properties.length !== 0 && properties.map((item : string, index: number) => (
                                <View key={index} style={[styles.job_pill, { backgroundColor: theme.colors.primary, marginBottom: 0 }]}><Text style={{color: theme.colors.onPrimary}}>{item}</Text></View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>

        </View>
    );
};

export default Job;