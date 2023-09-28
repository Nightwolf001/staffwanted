import React, { FC, useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { View, Image, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { useTheme, TextInput, Button, Text, IconButton, Avatar, Switch } from 'react-native-paper';

import { Container, Row, Col } from 'react-native-flex-grid';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Job, JobsList } from "../../types";
import { JobCard } from "./components";
import { fetchAllJobs } from "../../actions/jobs.actions";
import { Menu, GreetingsText } from "../../components";

import { styles } from "../../theme/styles";

const Home: FC = () => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const [menu_visible, setMenuVisible] = useState(false);
    const user = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [jobsList, setJobsList] = useState<JobsList>();

    useEffect(() => {
        (async () => {
            await fetchData();
        })()
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const fetchData = async () => {
        const jobs = await fetchAllJobs(user.id);
        setJobsList(jobs);
    }

    return (
        <View style={[styles.wrapper, { backgroundColor: theme.colors.primary, width: '100%' }]}>
            <Menu menu_visible={menu_visible} setMenuVisible={setMenuVisible} />
            <View style={{ flex: .8, width: '100%', backgroundColor: theme.colors.primary, justifyContent: 'center' }}>
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
                    </Row>
                </Container>
            </View>
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary }]}>
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
                        <JobCard key={index} job={item as Job} />
                    ))}
                </ScrollView>
            </View>                                
            
        </View>
    );
};

export default Home;