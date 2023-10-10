
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import { Image, TouchableOpacity } from 'react-native';
import { getPreciseDistance, convertDistance } from 'geolib';
import { Row, Col } from 'react-native-flex-grid';
import { useTheme, Text, IconButton } from 'react-native-paper';

import { METRIC } from "@env";
import { Job } from "../../../types";
import { styles } from "../../../theme/styles";

import { handleJobBookmark } from "../../../actions/jobs.actions";

type JobCardProps = {
    job: Job,
    navigation?: any,
    filterd_coord?: any,
    fetchData: () => void;
}

const JobCard = ({ job, navigation, filterd_coord, fetchData }: JobCardProps) => {

    if(!job) return
    const { attributes } = job;
    const { title, job_avatar_uri, employer, salary, location, bookmarked, coord } = attributes;

    const [distance_from_saved_address, setDistanceFromSavedLocation] = useState<number>(0);
    const user = useSelector((state: RootState) => state.userSlice.user);

    
    useEffect(() => {
        calculatePreciseDistance();
    }, [filterd_coord, coord]);


    const calculatePreciseDistance = () => {
        var pdis = getPreciseDistance(
            { latitude: filterd_coord.lat, longitude: filterd_coord.lng },
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

    const theme = useTheme();
    
    return (
        <TouchableOpacity style={[styles.job_card]} onPress={() => navigation.navigate({ name: 'Job', params: job } )}>
            <Row>
                <Col xs="3">
                    <Image  style={{ borderRadius: 15, width: 80, height: 80 }} source={{ uri: job_avatar_uri }} />
                </Col>
                <Col xs="6" style={{ justifyContent: 'center' }}>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: 'bold' }]} variant="labelMedium">{title}</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary}]} variant="labelMedium">{employer.data.attributes.company_name}</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: "400" }]} variant="labelSmall">{location}</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: "400" }]} variant="labelSmall">{distance_from_saved_address} {METRIC} away</Text>
                </Col>
                <Col xs="3" style={{ justifyContent: 'center', alignItems: 'flex-end'}}>
                    <IconButton
                        style={{ justifyContent: 'flex-start', alignItems: 'flex-end' }}
                        icon={bookmarked ? "bookmark"  : "bookmark-outline"}
                        iconColor={theme.colors.primary}
                        size={30}
                        onPress={() => handleBookmark(job.id, bookmarked)}
                    />
                    <Text style={[{ alignSelf: 'flex-end', marginBottom: 0, color: theme.colors.primary, fontWeight: 'bold', textAlign: 'right' }]} variant="labelLarge">$ {salary} p/h</Text>
                </Col>
            </Row>
        </TouchableOpacity>
        
    );
};

export default JobCard;