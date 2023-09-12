import { StyleSheet } from 'react-native';
import { white, black, light_blue } from './colors';

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: white,
    },
    container_curved: {
        flex: 3, 
        paddingTop: 20,
        width: '100%', 
        borderTopEndRadius: 35, 
        borderTopStartRadius: 35,
        alignItems: "center",
    },
    container: {
        flex: 1.4,
        padding: 16,
    },
    loader: {
        alignSelf: 'center',
    },
    add_icon_wrapper: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 40,
        height: 40,
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    refresh_icon_wrapper: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 40,
        height: 40,
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',  
    },
    switch_icon_wrapper: {
        position: 'absolute',
        bottom: 20,
        right: 0,
        left: 0,
        margin: 'auto',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',      
    },
    list_icon_wrapper: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 40,
        height: 40,
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map_icon_wrapper: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 40,
        height: 40,
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background_image: {
        flex: 1,
        width: '100%',
        position: 'relative',
        resizeMode: "contain",
        backGroundPosition: 'top',
    },
    image: {
        flex: 1,
        width: '100%',
        resizeMode: "contain",
        alignSelf: 'center'
    },
    xs_image : {
        flex: 1,
        width: '60%',
        resizeMode: "contain",
        alignSelf: 'center'
    },
    xxs_image: {
        flex: 1,
        width: '40%',
        resizeMode: "contain",
        alignSelf: 'center'
    },
    image_container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    current_city: {
        marginTop: 80,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 26,
        color: white,
    },
    current_temp: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 55,
        color: white,
    },
    current_temp_desc: {
        marginTop: 10,
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 26,
        color: white,
    },
    row_wrapper : {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    grid: {
        flex: 1,
        flexDirection: 'column',
    },
    divider: {
        borderBottomColor: white,
        borderBottomWidth: 1,
        marginTop: 15,
        marginBottom: 25,
    },
    item_start: {
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    item_center: {
        alignItems: 'center',
        alignSelf: 'center'
    },
    item_end: {
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    body1: {
        fontSize: 18,
        color: white,
    },
    body2: {
        fontSize: 14,
        color: white,
    },
    icon_wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        tintColor: white,
        width: 30,
        height: 30,
    },
    modal_txt: {
        color: white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    modal_txt_alt: {
        color: black,
        fontWeight: 'bold',
        fontSize: 16,
    },
    modal_btn_right: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 60,
        height: 40,
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    modal_btn_left: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 60,
        height: 40,
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    modal_heading_txt: {
        color: black,
        fontWeight: 'bold',
        fontSize: 22,        
    },
    card:{
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        borderRadius: 10,
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
    },
    absoluteFillObject: { 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    // Text Global
    text_white_heading: {
        color: white,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    text_light_blue_heading: {
        color: light_blue,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    // Splash / Landing
    splash_image: {
        flex: 1,
        width: '80%',
        resizeMode: "contain",
        alignSelf: 'center'
    },
    // welcome
    logo: {
        flex: 1,
        width: '70%',
        resizeMode: "contain",
        alignSelf: 'center'
    },
    welcome_btn_container: {
        flex: 1,
        padding: 16,
        width: '100%',
        position: 'absolute',
        bottom: 40,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

export { styles }