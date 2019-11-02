import React, {Component} from "react";
import {View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, Dimensions} from "react-native";
import Game from "../game";

const {height: HEIGHT} = Dimensions.get("window")

interface State {gameVisible: boolean};
export default class Entry extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            gameVisible: false
        }
    }

    render() {
        if (this.state.gameVisible) {
            return (
                <View style={{flex: 1}}>
                    <StatusBar hidden={true} />
                    <Game onExit={() => this.setState({gameVisible: false})} />
                </View>
            )
        } else {
            return (
                <View style={styles.topView}>
                    <StatusBar hidden={true} />
                    <View style={styles.headerView}>
                        <Text style={styles.headerText}>Hmyzáci</Text>
                    </View>
                    <Image
                        style={styles.iconImage}
                        source={require("../../assets/icon.png")}
                        resizeMode="center" />
                    <View style={styles.buttonsView}>
                        <View style={styles.buttonView}>
                            <TouchableOpacity
                                style={[styles.button, styles.mainButton]}
                                onPress={() => this.setState({gameVisible: true})}>
                                <Text style={styles.mainButtonText}>Začni hru</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    topView: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "rgba(255, 255, 255, 0.6)"
    },
    headerView: {
        flex: 0.5,
        flexDirection: "column",
        alignItems: "center"
    },
    iconImage: {
        flex: 0.5,
        width: "100%"
    },
    buttonsView: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row"
    },
    buttonView: {
        flex: 1
    },
    button: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "column",
        alignItems: "center",
        borderColor: "black",
        borderWidth: 1
    },
    mainButton: {
        backgroundColor: "lightblue"
    },
    mainButtonText: {
        fontSize: Math.floor(HEIGHT / 31),
        paddingTop: 8,
        paddingBottom: 8
    },
    headerText: {
        marginTop: 100,
        fontSize: Math.floor(HEIGHT / 24),
        textDecorationLine: "underline"
    }
});
