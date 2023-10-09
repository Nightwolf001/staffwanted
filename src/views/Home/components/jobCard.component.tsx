
import React, { useEffect, useState } from "react";

import { View, Image, TouchableOpacity } from 'react-native';
import { Container, Row, Col } from 'react-native-flex-grid';
import { useTheme, Text, IconButton, Surface } from 'react-native-paper';

import { Job } from "../../../types";
import { styles } from "../../../theme/styles";

import { handleJobBookmark } from "../../../actions/jobs.actions";

type JobCardProps = {
    job: Job,
    navigation?: any,
    fetchData: () => void;
}

const JobCard = ({ job, navigation, fetchData }: JobCardProps) => {

    if(!job) return
    const { attributes } = job;
    const { title, description, job_avatar_uri, employer, salary, location, preferred_hours, bookmarked, job_roles } = attributes;

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

    const handleBookmark = async (job_id: number, bookmark: boolean) => {

        if (bookmark) {
            bookmark = false;
        } else {
            bookmark = true;
        }

        const data = await handleJobBookmark(job_id, bookmark);
        if (data) {
            fetchData();
            console.log('handleBookmark data', data);
        }
    }

    const theme = useTheme();
    
    return (
        <TouchableOpacity style={[styles.job_card]} onPress={() => navigation.navigate({ name: 'Job', params: { job }} )}>
            <Row>
                <Col xs="3">
                    <Image  style={{ borderRadius: 15, width: 80, height: 80 }} source={{ uri: job_avatar_uri }} />
                </Col>
                <Col xs="6" style={{ justifyContent: 'center' }}>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: 'bold' }]} variant="labelLarge">{title}</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary}]} variant="labelMedium">{employer.data.attributes.company_name}</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: "400" }]} variant="labelSmall">{location}</Text>
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