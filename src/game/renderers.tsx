import React from "react";
import {StyleSheet, Image, ImageSourcePropType, ImageStyle} from "react-native";
import {Typed} from './types';

export interface ClickableProps extends Typed {
    sprite: ImageSourcePropType,
    position: [number, number],
    size: number,
    speed: number,
    direction: 1 | -1
}

export function ClickablePoint(props: ClickableProps) {
    const position = {
        left: props.position[0] - props.size / 2,
        top: props.position[1] - props.size / 2,
        height: props.size,
        width: props.size
    }

    let directionTransform: ImageStyle = {};
    if (props.direction == 1) {
        directionTransform = {
            transform: [{rotateY: "180deg"}]
        }
    }

    return (
        <Image
            style={[styles.base, directionTransform, position]}
            source={props.sprite}
            resizeMode="contain" />
    );
}

const styles = StyleSheet.create({
    base: {
        position: "absolute",
    },
    image: {
        flex: 1
    }
});
