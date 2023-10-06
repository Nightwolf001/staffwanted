
import React, { useEffect, useState } from "react";

import { View, Image, TouchableOpacity } from 'react-native';
import { Container, Row, Col } from 'react-native-flex-grid';
import { useTheme, Text, IconButton, Surface } from 'react-native-paper';

import { Job } from "../../../types";
import { styles } from "../../../theme/styles";

type JobCardProps = {
    job: Job,
    navigation?: any
}

const JobCard = ({ job, navigation }: JobCardProps) => {

    if(!job) return
    const { attributes } = job;
    const { title, description, job_avatar_uri, employer, salary, location, preferred_hours, bookmarked, job_roles } = attributes;

    const theme = useTheme();
    
    return (
        <TouchableOpacity style={[styles.job_card]} onPress={() => navigation.navigate('HomeTab', { screen: 'Job', params: { job }} )}>
           
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
                        onPress={() => console.log('pressed')}
                    />
                    <Text style={[{ alignSelf: 'flex-end', marginBottom: 0, color: theme.colors.primary, fontWeight: 'bold', textAlign: 'right' }]} variant="labelLarge">$ {salary} p/h</Text>
                </Col>
                <Col xs="12" style={{ justifyContent: 'center', alignItems: 'flex-end' }}>

                </Col>
            </Row>
           
        </TouchableOpacity>
        
    );
};

export default JobCard;