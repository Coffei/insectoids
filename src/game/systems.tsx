import {Dimensions} from 'react-native';
import {ClickableProps, ClickablePoint} from './renderers';
import {GlobalState, RenderedEntity} from '.';
import {birds, insects} from './sprites';

const {width: WIDTH, height: HEIGHT} = Dimensions.get("window");

function isInside(props: ClickableProps, event) {
    const {position: [x, y], size} = props;
    const {pageX: touchX, pageY: touchY} = event;
    return touchX >= (x - size / 2) &&
        touchX <= (x + size / 2) &&
        touchY >= (y - size / 2) &&
        touchY <= (y + size / 2)
}

export function clickPoint(state, {touches}) {
    touches.filter(t => t.type === "press").forEach(t => {
        const clickedKey = Object.keys(state).find((key: string) => {
            if (key != "global") {
                const element = state[key];
                return element.type == "clickable" && isInside(element, t.event);
            }

            return false;
        });

        if (clickedKey) {
            this.setState({hits: this.state.hits + 1});
            delete state[clickedKey];
        }
    });

    const elementsCount = Object.keys(state).length - 1;
    if (state.global.time < 0 && elementsCount == 0) {
        this.setState({running: false});
    }

    return state;
}

export function movePoint(state, {time}) {
    const speedup = state.global.speedup;
    Object.keys(state).forEach((key: string) => {
        if (key != "global") {
            const element = state[key];
            const shift = element.speed * speedup * time.delta / 50;
            element.position[0] = element.position[0] - (shift * element.direction);
        }
    });

    return state;
}

function next(prev: number, interval: number, current: number, speedup: number) {
    const speedupRatio = Math.pow(1 / speedup, 2);
    const randInterval = Math.floor((interval + Math.random() * interval) * speedupRatio);
    const start = prev || current;
    return start + randInterval;
}

function readyToSpawn(plan: number | null, current: number) {
    return plan == null || plan <= current;
}

function randHeight() {
    const topMargin = 100;
    const bottomMargin = 100;
    const rand = Math.floor(Math.random() * (HEIGHT - topMargin - bottomMargin));
    return topMargin + rand;
}

const minSize = HEIGHT / 15;
const maxSize = HEIGHT / 8;
function randSize() {
    return Math.floor(minSize + Math.random() * (maxSize - minSize));
}

const minSpeed = Math.floor(WIDTH / 90);
const maxSpeed = Math.floor(WIDTH / 50);
function randSpeed() {
    return Math.floor(minSpeed + Math.random() * (maxSpeed - minSpeed));
}

function randDirection() {
    const dir = Math.floor(Math.random() * 2);
    if (dir == 0) {
        return 1;
    } else {
        return -1;
    }
}

function getStartPoint(direction, size) {
    if (direction == 1) {
        return WIDTH + size;
    } else {
        return -size;
    }
}

function randItem<T>(sprites: T[]): T {
    const index = Math.floor(Math.random() * sprites.length)
    return sprites[index];
}

export function spawnPoints(state, {time}) {
    const globalState: GlobalState = state.global;
    if (globalState.time > 0) {
        // non-clickables
        if (readyToSpawn(globalState.nonClickableNext, time.current)) {
            const id = globalState.nonClickableItems + 1;
            const key = `nonclickable_${id}"`;
            const size = randSize();
            const height = randHeight();
            const direction = randDirection();
            const newPoint: RenderedEntity = {
                type: "nonclickable",
                sprite: randItem(birds),
                position: [getStartPoint(direction, size), height],
                size: size,
                speed: randSpeed(),
                direction: direction,
                renderer: ClickablePoint
            }

            state[key] = newPoint;
            globalState.nonClickableItems = id;
            globalState.nonClickableNext = next(
                globalState.nonClickableNext,
                globalState.nonClickableInterval,
                time.current,
                globalState.speedup
            );
        }



        // clickables
        if (readyToSpawn(globalState.clickableNext, time.current)) {
            const id = globalState.clickableItems + 1;
            const key = `clickable_${id}"`;
            const size = randSize();
            const height = randHeight();
            const direction = randDirection();
            const newPoint: RenderedEntity = {
                type: "clickable",
                sprite: randItem(insects),
                position: [getStartPoint(direction, size), height],
                size: size,
                speed: randSpeed(),
                direction: direction,
                renderer: ClickablePoint
            }

            state[key] = newPoint;
            globalState.clickableItems = id;
            globalState.clickableNext = next(
                globalState.clickableNext,
                globalState.clickableInterval,
                time.current,
                globalState.speedup
            );

            this.setState({spawnedClickables: this.state.spawnedClickables + 1});
        }
    }

    return state;
}

export function killPoints(state, opts) {
    Object.keys(state).forEach((key) => {
        if (key != "global") {
            const element: ClickableProps = state[key];
            if (element.direction == 1 && element.position[0] <= element.size * (-1) / 2) {
                delete state[key];
            } else if (element.direction == -1 && element.position[0] >= WIDTH + element.size / 2) {
                delete state[key];
            }
        }
    });

    const elementsCount = Object.keys(state).length - 1;
    if (state.global.time < 0 && elementsCount == 0) {
        this.setState({running: false});
    }

    return state;
}

const GAME_DURATION = 60 * 1000;
export function increaseSpeedup(state, {time}) {
    const speedupDelta = time.delta / GAME_DURATION;
    state.global.speedup = state.global.speedup + speedupDelta;
    return state;
}

export function trackGameTime(state, {time}) {
    const globalState: GlobalState = state.global;
    globalState.time = globalState.time - time.delta;

    const elementsCount = Object.keys(state).length - 1;
    if (globalState.time < 0 && elementsCount == 0) {
        this.setState({running: false});
    }

    return state;
}
