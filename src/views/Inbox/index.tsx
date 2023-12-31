import React, { FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import { View, Image, ScrollView, Modal, TouchableOpacity, Alert } from "react-native";
import { useTheme, TextInput, Button, Text, IconButton, SegmentedButtons, Surface } from 'react-native-paper';

import { Container, Row, Col } from 'react-native-flex-grid';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Menu, GreetingsText } from "../../components";
import { User } from '../../types';

import { styles } from "../../theme/styles";

const Inbox: FC = () => {

    const theme = useTheme();
    const dispatch = useDispatch();

    const [menu_visible, setMenuVisible] = React.useState(false);
    const user = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [section, setSection] = useState('notifications');

    useEffect(() => {
        (async () => {
            console.log('Inbox: ', user);
        })()
    }, []);

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
            <View style={[styles.container_curved, { backgroundColor: theme.colors.onPrimary, padding: 16 }]}>
                <SegmentedButtons
                    value={section}
                    onValueChange={setSection}
                    buttons={[
                        {
                            value: 'notifications',
                            label: 'Notifications',
                            checkedColor: theme.colors.primary,
                            uncheckedColor: theme.colors.primary,
                        },
                        {
                            value: 'inbox',
                            label: 'Inbox',
                            checkedColor: theme.colors.primary,
                            uncheckedColor: theme.colors.primary,

                        },
                    ]}
                />
                <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}> 
                    <Row>
                        <Col xs="12" style={{paddingVertical: 16}}>
                            <Surface mode="elevated" elevation={1} style={{ padding: 16, borderRadius: 15, backgroundColor: "#fafafa" }}>
                                <Text style={[{ marginBottom: 0, fontWeight: 'bold', color: theme.colors.primary }]} variant="headlineMedium">No notifications</Text>
                            </Surface>
                        </Col>
                    </Row>
                </ScrollView>
            </View>

        </View>
    );
};

export default Inbox;