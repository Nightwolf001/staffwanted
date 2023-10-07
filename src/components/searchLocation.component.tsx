import React, { useEffect, useState } from "react";

import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { View, Modal, ScrollView } from "react-native";
import { Container, Row, Col } from 'react-native-flex-grid';
import { useTheme, Text, IconButton, Button, Switch } from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { styles } from "../theme/styles";

import { User } from "../types";
import { updateProfile } from "../actions/account.actions";
import { setUser } from "../redux/reducers/user.reducer";

import { MAPS_API_KEY } from '@env';

type SearchLocationProps = {
    search_visible: boolean;
    setSearchVisible: (search_visible: boolean) => void;
}

const SearchLocation = ({ search_visible, setSearchVisible }: SearchLocationProps) => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.userSlice.user);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    return (
        <Modal
            style={[styles.wrapper]}
            animationType="slide"
            transparent={false}
            visible={search_visible}
            onRequestClose={() => { setSearchVisible(false) }}
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
                                    onPress={() => setSearchVisible(false)}
                                />
                            </Col>
                        </Row>
                    </Container>
                </View>
            </View>
        </Modal>
    );
};

export default SearchLocation;