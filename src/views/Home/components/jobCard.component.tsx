
import React, { useEffect, useState } from "react";

import { View, Image } from 'react-native';
import { Container, Row, Col } from 'react-native-flex-grid';
import { useTheme, Text, Chip, IconButton } from 'react-native-paper';

import moment from 'moment';

import { Job } from "../../../types";
import { styles } from "../../../theme/styles";

type JobCardProps = {
    job: Job
}

const JobCard = ({ job }: JobCardProps) => {

    if(!job) return
    console.log('job', job);
    const { attributes } = job;
    const { title, description, job_avatar_uri, employer, salary, location, preferred_hours } = attributes;

    const theme = useTheme();

    useEffect(() => {
    });

    return (
        <View style={styles.job_card}>
           
            <Row>
                <Col xs="3">
                    <Image  style={{ borderRadius: 15, width: 80, height: 80 }} source={{ uri: job_avatar_uri }} />
                </Col>
                <Col xs="7" style={{ justifyContent: 'center' }}>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: 'bold' }]} variant="labelLarge">{title}</Text>
                    {/* <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: 'bold' }]} variant="bodySmall">{description}</Text> */}
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary}]} variant="labelMedium">{employer.data.attributes.company_name}</Text>
                    <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: "400" }]} variant="labelSmall">{location}</Text>
                </Col>
                <Col xs="2" style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: -15}}>
                    <IconButton
                        icon="bookmark-outline"
                        iconColor={theme.colors.primary}
                        size={30}
                        onPress={() => console.log('pressed')}
                    />
                </Col>
                <Col xs="8">
                    <Row style={{ padding: 5}}>
                    {preferred_hours.data.map((item, index) => (
                        <Chip key={index} style={{ backgroundColor: theme.colors.primary, margin: 5, marginBottom: 0 }} textStyle={{ color: theme.colors.onPrimary, fontSize: 10 }}>{item.attributes.name}</Chip>
                    ))}
                    </Row>
                </Col> 
                <Col xs="4" style={{ justifyContent: 'center'}}>
                    <Row style={{ marginRight: 2, alignSelf: 'flex-end' }}>
                        <Text style={[{ marginBottom: 0, color: theme.colors.primary, fontWeight: 'bold', textAlign: 'right' }]} variant="labelLarge">$ {salary} p/h</Text>
                    </Row>
                </Col>  
            </Row>
           
        </View>
        
    );
};

export default JobCard;