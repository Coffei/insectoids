import React, {PureComponent} from "react";
import {ImageSourcePropType, StyleSheet, ImageBackground} from 'react-native';

interface Props {}

interface State {
    image: ImageSourcePropType
}

export default class Background extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        switch (Math.floor(Math.random() * 6)) {
            case 0:
                this.state = {
                    image: require("../../assets/background-horizontal.png")
                }
                break;
            case 1:
                this.state = {
                    image: require("../../assets/background-vertical.png")
                }
                break;
            case 2:
                this.state = {
                    image: require("../../assets/background-checkers.png")
                }
                break;
            case 3:
                this.state = {
                    image: require("../../assets/background-diagonal.png")
                }
                break;
            case 4:
                this.state = {
                    image: require("../../assets/background-diagonal-reverted.png")
                }
                break;
            case 5:
                this.state = {
                    image: require("../../assets/background-diagonal-both.png")
                }
                break;
        }
    }

    render() {
        return (
            <ImageBackground source={this.state.image} style={styles.base} resizeMode="repeat" >
                {this.props.children}
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    base: {
        width: "100%",
        height: "100%"
    }
})
