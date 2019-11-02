import React, {PureComponent} from "react";
import {BackHandler, View, Text, TouchableWithoutFeedback, ToastAndroid, StyleSheet, Dimensions} from "react-native";
import {GameEngine} from "react-native-game-engine";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar as faStarFull, faStarHalfAlt} from '@fortawesome/free-solid-svg-icons';
import {faStar as faStarEmpty} from '@fortawesome/free-regular-svg-icons';
import {ClickableProps} from "./renderers";
import {clickPoint, movePoint, spawnPoints, killPoints, increaseSpeedup, trackGameTime} from './systems';
import {Typed} from "./types";
import Background from './background';

const {height: HEIGHT} = Dimensions.get("window");

export interface RenderedEntity extends ClickableProps {
    renderer: any
}

export interface GlobalState extends Typed {
    speedup: number,
    clickableItems: number,
    clickableInterval: number,
    clickableNext: number | null,
    nonClickableItems: number,
    nonClickableInterval: number,
    nonClickableNext: number | null,
    time: number
}

interface State {
    running: boolean,
    entities: {[s: string]: GlobalState | RenderedEntity},
    spawnedClickables: number,
    hits: number,
    time: number,
    backTimeout: number,
    timeInterval: number
};

interface Props {
    onExit: () => void
}
export default class Game extends PureComponent<Props, State> {
    backHandler: any;
    constructor(props: Props) {
        super(props);

        this.state = {
            entities: {
                global: {
                    type: "global",
                    speedup: 0.5,
                    time: 60000,
                    clickableItems: 0,
                    clickableInterval: 1500,
                    clickableNext: null,
                    nonClickableItems: 0,
                    nonClickableInterval: 1000,
                    nonClickableNext: null
                }
            },
            running: true,
            spawnedClickables: 0,
            hits: 0,
            time: 60,
            backTimeout: null,
            timeInterval: null,
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.backTimeout) {
                this.props.onExit();
            } else {
                this.setState({
                    backTimeout: setTimeout(() => this.setState({backTimeout: null}), 2000)
                });
                ToastAndroid.show("Pro ukončení zmáčkni ZPĚT ještě jednou.", ToastAndroid.SHORT);
            }
            return true;
        });

        this.setState({
            timeInterval: setInterval(() => this.setState({time: Math.max(0, this.state.time - 1)}), 1000)
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
        if (this.state.backTimeout) clearTimeout(this.state.backTimeout);
        if (this.state.timeInterval) clearInterval(this.state.timeInterval);
    }

    highScoreText() {
        const hits = this.state.hits;
        if (hits == 0) {
            return "Nezabil jsi žádného hmyzáka";
        } else if (hits == 1) {
            return "Zabil jsi 1 hmyzáka";
        } else if (hits <= 4) {
            return `Zabil jsi ${hits} hmyzáky`;
        } else {
            return `Zabil jsi ${hits} hmyzáků`;
        }
    }

    gameOverClick = () => {
        this.props.onExit();
    }

    render() {
        let gameOverPopup = null;
        if (!this.state.running) {
            const hitPercent = this.state.hits / this.state.spawnedClickables

            const star1Icon = hitPercent > 0.20 ? faStarFull : hitPercent > 0.10 ? faStarHalfAlt : faStarEmpty;
            const star2Icon = hitPercent > 0.40 ? faStarFull : hitPercent > 0.30 ? faStarHalfAlt : faStarEmpty;
            const star3Icon = hitPercent > 0.6 ? faStarFull : hitPercent > 0.5 ? faStarHalfAlt : faStarEmpty;
            const star4Icon = hitPercent > 0.8 ? faStarFull : hitPercent > 0.7 ? faStarHalfAlt : faStarEmpty;
            const star5Icon = hitPercent > 0.95 ? faStarFull : hitPercent > 0.85 ? faStarHalfAlt : faStarEmpty;

            gameOverPopup = (
                <TouchableWithoutFeedback style={styles.fullScreenButton} onPress={this.gameOverClick}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameOverText}>Konec hry!</Text>
                        <View style={styles.scoreIcons}>
                            <FontAwesomeIcon icon={star1Icon} style={styles.scoreIcon} size={32} />
                            <FontAwesomeIcon icon={star2Icon} style={styles.scoreIcon} size={32} />
                            <FontAwesomeIcon icon={star3Icon} style={styles.scoreIcon} size={32} />
                            <FontAwesomeIcon icon={star4Icon} style={styles.scoreIcon} size={32} />
                            <FontAwesomeIcon icon={star5Icon} style={styles.scoreIcon} size={32} />
                        </View>
                        <Text style={styles.gameOverScoreText}>{this.highScoreText()}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }

        return (
            <Background>
                <View style={styles.container}>
                    <GameEngine
                        ref="test"
                        running={this.state.running}
                        entities={this.state.entities}
                        systems={[
                            clickPoint.bind(this),
                            movePoint.bind(this),
                            spawnPoints.bind(this),
                            killPoints.bind(this),
                            increaseSpeedup.bind(this),
                            trackGameTime.bind(this)
                        ]}>
                        <View style={styles.topStatsView}>
                            <View style={styles.statsView}><Text style={styles.statsText}>Zásahy: {this.state.hits}</Text></View>
                            <View style={[styles.statsView, styles.right]}><Text style={styles.statsText}>Čas: {this.state.time}s</Text></View>
                        </View>
                    </GameEngine>
                    {gameOverPopup}
                </View>
            </Background>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        width: "100%",
        height: "100%"
    },
    topStatsView: {
        backgroundColor: "white",
        flexDirection: "row",
        padding: 5
    },
    statsView: {
        flex: 1
    },
    statsText: {
        fontSize: Math.floor(HEIGHT / 50)
    },
    right: {
        alignItems: "flex-end"
    },
    gameOverText: {
        color: 'white',
        fontSize: 48
    },
    gameOverScoreText: {
        color: 'white',
        fontSize: 24
    },
    scoreIcons: {
        flexDirection: "row"
    },
    scoreIcon: {
        color: "gold"
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullScreenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    }
});
