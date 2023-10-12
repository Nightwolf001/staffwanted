
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import { getPreciseDistance, convertDistance } from 'geolib';
import { View, Image, TouchableOpacity } from 'react-native';
import { Container, Row, Col } from 'react-native-flex-grid';
import { useTheme, Text, IconButton, Surface } from 'react-native-paper';

import { styles } from "../../../theme/styles";
import { METRIC } from "@env";
import { JobsMatch, JobAttributes } from "../../../types";

import { handleJobBookmark } from "../../../actions/jobs.actions";

type JobCardProps = {
    job_match: JobsMatch,
    navigation?: any,
    fetchData: () => void;
}

const JobCard = ({ job_match, navigation, fetchData }: JobCardProps) => {

    // extract variables from objects
    if (!job_match) return
    const { attributes } = job_match;
    const { bookmarked, applied, job, application_status } = attributes;
    const { id } = job.data;
    const { title, job_avatar_uri, employer, salary_currency, salary_type, salary_value, location, coord } = job.data.attributes as JobAttributes;

    const theme = useTheme();
    const [distance_from_saved_address, setDistanceFromSavedLocation] = useState<number>(0);
    const user = useSelector((state: RootState) => state.userSlice.user);
    
    useEffect(() => {
        calculatePreciseDistance();
    }, []);

    const calculatePreciseDistance = () => {
        var pdis = getPreciseDistance(
            { latitude: user.coord.lat, longitude: user.coord.lng },
            { latitude: coord.lat, longitude: coord.lng },
        );
        
        let distance = convertDistance(pdis, METRIC);
        setDistanceFromSavedLocation(parseFloat(distance.toFixed(2)));
    };

    const handleBookmark = async (job_id: number, bookmark: boolean) => {

        if (bookmark) {
            bookmark = false;
        } else {
            bookmark = true;
        }

        const data = await handleJobBookmark(user.id, job_id, bookmark);
        if (data) {
            fetchData();
            console.log('handleBookmark data', data);
        }
    }

    return (
        <TouchableOpacity style={[styles.job_card]} onPress={() => navigation.navigate({ name: 'Job', params: job.data } )}>
            <Row style={{position: "relative"}}>
                <Col xs="3" style={{ justifyContent: 'center' }}>
                    <Image resizeMode="cover" style={{ borderRadius: 15, width: 80, height: 80 }} source={{ uri: job_avatar_uri }} />
                </Col>
                <Col xs="7" style={{ justifyContent: 'center' }}>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: 'bold' }]} variant="labelMedium">{title}</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary }]} variant="labelMedium">{employer.data.attributes.company_name}</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: "400" }]} variant="labelSmall">{location}</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: "400" }]} variant="labelSmall">{distance_from_saved_address} {METRIC} away</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: 'bold' }]} variant="labelSmall">{salary_currency}{salary_value} {salary_type}</Text>
                </Col>
                <Col xs="2" style={{ justifyContent: 'flex-start' }}>
                    <IconButton
                        style={{ marginTop: -10 }}
                        icon={bookmarked ? "bookmark" : "bookmark-outline"}
                        iconColor={theme.colors.primary}
                        size={30}
                        onPress={() => handleBookmark(id, bookmarked)}
                    />

                </Col>
                {applied && application_status.length !== 0 && 
                    <Col xs="12" style={{ justifyContent: 'center', alignItems: 'flex-end', marginBottom: -10, marginTop: -35}}>
                        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingTop: 10, flexWrap: 'wrap' }}>
                            <View style={[styles.job_pill, { backgroundColor: theme.colors.secondary, marginBottom: 9 }]}><Text style={{ color: theme.colors.onPrimary, fontSize: 10, textTransform: 'capitalize' }}>Applied</Text></View>
                            <View style={[styles.job_pill, { backgroundColor: theme.colors.secondary, marginBottom: 9 }]}><Text style={{ color: theme.colors.onPrimary, fontSize: 10, textTransform: 'capitalize' }}>{application_status}</Text></View>
                        </View>
                    </Col>
                }
            </Row>
        </TouchableOpacity>
    );
};

export default JobCard;