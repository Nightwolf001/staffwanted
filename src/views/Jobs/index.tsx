import React, { FC, useEffect, useCallback, useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { View, ScrollView,RefreshControl } from "react-native";
import { useTheme, Text, IconButton, SegmentedButtons } from 'react-native-paper';

import { Container, Row, Col } from 'react-native-flex-grid';

import { ParamListBase, useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { JobsMatch } from "../../types";
import { JobCard } from "./components";

import { Menu, GreetingsText } from "../../components";
import { fetchJobMatches } from "../../actions/jobs.actions";

import { styles } from "../../theme/styles";

const Jobs: FC = () => {

    const theme = useTheme();
    const isFocused = useIsFocused();

    const [menu_visible, setMenuVisible] = useState(false);
    const user = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [section, setSection] = useState('bookmarked');
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const [bookmarkedJobs, setBookmarkedJobs] = useState<JobsMatch[]>([]);
    const [appliedJobs, setAppliedJobs] = useState<JobsMatch[]>([]);

    useEffect(() => {
        (async () => {
            if(!isFocused) return;
            await fetchData();
        })()
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const fetchData = async () => {
        setBookmarkedJobs([]);
        setAppliedJobs([]);
        let { data } = await fetchJobMatches();

        for (let i = 0; i < data.length; i++) {
            const job_match = data[i];

            if (job_match.attributes.bookmarked) {
                setBookmarkedJobs(prevState => [...prevState, job_match]);
            }

            if (job_match.attributes.applied) {
                setAppliedJobs(prevState => [...prevState, job_match]);
            }

        }
    }

    function renderBookmarkedJobs() {
        if (bookmarkedJobs && bookmarkedJobs.length !== 0) {
            return bookmarkedJobs.map((job_match: JobsMatch, index: number) => (
                <JobCard key={index} job_match={job_match} fetchData={fetchData} navigation={navigation} />
            ))
        } else {
            return (
                <Row>
                    <Col xs="12">
                        <Text style={[{ marginBottom: 0, fontWeight: 'bold', color: theme.colors.primary }]} variant="headlineMedium">No bookmarked jobs</Text>
                    </Col>
                </Row>
            )
        }
    }

    function renderAppliedJobs() {
        if (appliedJobs && appliedJobs.length !== 0) {
            return appliedJobs.map((job_match: JobsMatch, index: number) => (
                <JobCard key={index} job_match={job_match} fetchData={fetchData} navigation={navigation} />
            ))
        } else {
            return (
                <Row>
                    <Col xs="12">
                        <Text style={[{ marginBottom: 0, fontWeight: 'bold', color: theme.colors.primary }]} variant="headlineMedium">No Applied jobs</Text>
                    </Col>
                </Row>
            )
        }
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
                <Container fluid>
                    <SegmentedButtons
                        value={section}
                        onValueChange={setSection}
                        buttons={[
                            {
                                value: 'applications',
                                label: 'Applications',
                                checkedColor: theme.colors.primary,
                                uncheckedColor: theme.colors.primary,

                            },
                            {
                                value: 'bookmarked',
                                label: 'Bookmarked',
                                checkedColor: theme.colors.primary,
                                uncheckedColor: theme.colors.primary,
                            },
                        ]}
                    />
                </Container> 
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
                    {section === 'bookmarked' &&
                        renderBookmarkedJobs()
                    }

                    {section === 'applications' &&
                        renderAppliedJobs()
                    }

                </ScrollView>
            </View>

        </View>
    );
};

export default Jobs;