import React, { useEffect, useState } from "react";

import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { View, Modal, ScrollView } from "react-native";
import { Container, Row, Col } from 'react-native-flex-grid';
import { useTheme, Text, IconButton, Button, Switch } from 'react-native-paper';

import { styles } from "../theme/styles";
import { logout } from "../services/interceptor.service";

import { User } from "../types";
import { updateProfile } from "../actions/account.actions";
import { setUser } from "../redux/reducers/user.reducer";


type MenuProps = {
    menu_visible: boolean;
    setMenuVisible: (menu_visible: boolean) => void;
}

const Menu = ({ menu_visible, setMenuVisible } : MenuProps) => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const [is_profile_visible, setIsProfileVisible] = useState<boolean>(false);
    const [is_profile_boosted, setIsProfileBoosted] = useState<boolean>(false);

    useEffect(() => {
        (async () => {

            setIsProfileVisible(user.hide_profile);
            setIsProfileBoosted(user.profile_boosted);

        })()
    }, []);

    const logUserOut =  async () => {
        let {data} = await updateProfile(user.id, { user_logged_in: false })
        let { id, attributes } = data;
        attributes.id = id;
        dispatch(setUser(attributes));
        await logout();
        setMenuVisible(false);
        navigation.navigate('Login');
    }

    const clearProfile = async () => {
        let { data } = await updateProfile(user.id, { user_logged_in: false })
        let { id, attributes } = data;
        attributes.id = id;
        dispatch(setUser({} as User));
        await logout();
        setMenuVisible(false);
        navigation.navigate('Login');
    }

    return (
        <Modal
            style={[styles.wrapper]}
            animationType="slide"
            transparent={false}
            visible={menu_visible}
            onRequestClose={() => { setMenuVisible(false) }}
            presentationStyle={"pageSheet"}
        >
            <View style={{ flex: 1, width: '100%', backgroundColor: theme.colors.primary }}>
                <View style={{ flex: .4, width: '100%', backgroundColor: theme.colors.primary, justifyContent: 'center' }}>
                    <Container fluid>
                        <Row style={{ justifyContent: 'center' }}>
                            <Col style={{ alignItems: 'flex-start', justifyContent: 'center' }} xs="6">
                                <Text style={[styles.text_white_heading]} variant="headlineSmall">Menu</Text>
                            </Col>   
                            <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }} xs="6">
                                <IconButton
                                    icon="close"
                                    iconColor={theme.colors.onPrimary}
                                    size={30}
                                    onPress={() => setMenuVisible(false)}
                                />
                            </Col>   
                         </Row>
                    </Container>       
                </View>

                <View style={[{ borderTopEndRadius: 35, borderTopStartRadius: 35, padding: 16, flex: 3, width: '100%', backgroundColor: theme.colors.onPrimary, justifyContent: 'center' }]}>
                    <ScrollView>
                        <Container fluid>
                            <Row style={{ justifyContent: 'center' }}>
                                <Col style={{ alignItems: 'flex-start', justifyContent: 'center' }} xs="12">
                                    <Button onPress={() => { logUserOut() }} style={{ width: '100%', marginBottom: 10 }} mode="contained" color={theme.colors.primary} labelStyle={{ color: theme.colors.onPrimary }}>Logout</Button>
                                </Col>
                                <Col style={{ alignItems: 'flex-start', justifyContent: 'center' }} xs="12">
                                    <Button onPress={() => { clearProfile() }} style={{ width: '100%', marginBottom: 10 }} mode="contained" color={theme.colors.primary} labelStyle={{ color: theme.colors.onPrimary }}>Clear Profile</Button>
                                </Col>
                            </Row>
                        </Container>        
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default Menu;