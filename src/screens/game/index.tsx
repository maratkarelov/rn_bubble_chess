import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
    Alert,
    BackHandler,
    ColorValue,
    Dimensions,
    Modal,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Styles from '../game/styles';
import {baseColor} from '../../theme/appTheme';
import {IconBack, IconFire, Swordman, Tower} from '../../svg';
import ActionButton from '../../components/ActionButton';
import {myRoutes, playerRoutes, StartCapacity} from '../game/gameCollections';
import I18n from '../../locales/i18n';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface Props extends StackScreenProps<any, any> {
}

interface Route {
    key: string;
    startAddress: string;
    points: string[];
}

interface Capacity {
    myCapacity: boolean;
    live: boolean;
    startAddress: string;
    count: number;
}

interface Launch {
    health: number,
    myLaunch: boolean;
    timer: number;
    points: string[];
    currentAddress: string;
    endAddress: string;

}

interface Explosion {
    address: string,
    timer: number
}

export const GameScreen = ({route, navigation}: Props) => {
        const {initInvite, inviteRef} = route.params;
        const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
        const timer = 50;
        const moveSteps = 100;
        const launchCellRatio = 5;
        const explosionSteps = 5;
        const [invite, setInvite] = useState(initInvite);
        const [startAddress, setStartAddress] = useState<string | undefined>(undefined);
        const [endAddress, setEndAddress] = useState<string | undefined>(undefined);
        const [currentRoute, setCurrentRoute] = useState<Route | undefined>(undefined);
        const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
        const [launches, setLaunches] = useState<Launch[]>([]);
        const [explosions, setExplosions] = useState<Explosion[]>([]);
        const startCapacities = [...StartCapacity];
        const [capacities, setCapacities] = useState<Capacity[]>(startCapacities);
        const [timeLeft, setTimeLeft] = useState(1000000000000);
        const [readyForMyLaunch, setReadyForMyLaunch] = useState(false);
        const [readyForHisLaunch, setReadyForHisLaunch] = useState(true);
        const [gameResult, setGameResult] = useState<boolean | undefined>(undefined);
        const [modalVisible, setModalVisible] = useState(false);
        const uid = auth().currentUser?.uid;
        const userRef = firestore().collection('users').doc(uid);

        var Sound = require('react-native-sound');
        // Enable playback in silence mode
        Sound.setCategory('Playback');
        //size
        const {width, height} = Dimensions.get('window');
        let {boardWidth, boardHeight} = {boardWidth: 0, boardHeight: 0};
        const efficientHeight = Platform.OS === 'ios' ? 0.85 : 0.9;
        const efficientWidth = Platform.OS === 'ios' ? 0.8 : 0.85;
        const ratio = height * efficientHeight / width;
        if (ratio > 2) {
            boardWidth = width;
        } else {
            boardHeight = height * efficientHeight;
            boardWidth = boardHeight / 2;
            if (boardWidth / width < efficientWidth) {
                boardWidth = width * efficientWidth;
            }
        }
        const cellSize = boardWidth / 6;

        const refillCapacities = () => {
            const newCapacities = [{startAddress: 'a1', count: 6, live: true, myCapacity: true},
                {startAddress: 'b1', count: 6, live: true, myCapacity: true},
                {startAddress: 'c1', count: 6, live: true, myCapacity: true},
                {startAddress: 'd1', count: 6, live: true, myCapacity: true},
                {startAddress: 'e1', count: 6, live: true, myCapacity: true},
                {startAddress: 'f1', count: 6, live: true, myCapacity: true},
                {startAddress: 'a12', count: 6, live: true, myCapacity: false},
                {startAddress: 'b12', count: 6, live: true, myCapacity: false},
                {startAddress: 'c12', count: 6, live: true, myCapacity: false},
                {startAddress: 'd12', count: 6, live: true, myCapacity: false},
                {startAddress: 'e12', count: 6, live: true, myCapacity: false},
                {startAddress: 'f12', count: 6, live: true, myCapacity: false}];
            setCapacities(newCapacities);

        };

        function listenInvite() {
            inviteRef
                .onSnapshot((querySnapshot: { data: () => any; }) => {
                    const queryInvite = querySnapshot.data();
                    if (queryInvite?.loserRef && queryInvite?.loserRef?.id !== userRef.id) {
                        // opponent gave up
                        console.log(Platform.OS, queryInvite?.loserRef?.id,' loser, ***************,\ni am', userRef.id);
                        setInvite(queryInvite);
                        setModalVisible(true);
                    }
                });
        }

        useEffect(() => {
            refillCapacities();
            listenInvite();
            const backAction = () => {
                setModalVisible(true);
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );

            return () => backHandler.remove();

        }, []);

        const checkNewExplosion = (address: string) => {
            const myTower = launches.find((item) => (item.currentAddress === address && item.myLaunch && item.currentAddress === item.endAddress));
            const myLaunch = launches.find((item) => (item.currentAddress === address && item.myLaunch && item.currentAddress !== item.endAddress));
            const hisTower = launches.find((item) => (item.currentAddress === address && !item.myLaunch && item.currentAddress === item.endAddress));
            const hisLaunch = launches.find((item) => (item.currentAddress === address && !item.myLaunch && item.currentAddress !== item.endAddress));
            if (myTower !== undefined && hisLaunch !== undefined) {
                if (myTower.health === 2) {
                    myTower.health = 1;
                    const newLaunches = launches.filter((l) => l !== hisLaunch);
                    setLaunches(newLaunches);
                    playSound('armor');
                } else {
                    playSound('blaster');
                    setLaunches(launches.filter((l) => l !== hisLaunch && l !== myTower));
                }
                newExplosion(address);
            } else if (myLaunch !== undefined && hisTower !== undefined) {
                if (hisTower.health === 2) {
                    hisTower.health = 1;
                    setLaunches(launches.filter((l) => l !== myLaunch));
                    playSound('armor');
                } else {
                    playSound('blaster');
                    setLaunches(launches.filter((l) => l !== hisTower && l !== myLaunch));
                }
                newExplosion(address);
            } else if (myLaunch !== undefined && hisLaunch !== undefined) {
                setLaunches(launches.filter((item) => item !== myLaunch && item !== hisLaunch));
                playSound('blaster');
                newExplosion(address);
            } else if (myTower !== undefined && hisTower !== undefined) {
                if (hisTower.health === 2) {
                    hisTower.health = 1;
                    setLaunches(launches.filter((l) => l !== myTower));
                    playSound('armor');
                } else if (myTower.health === 2) {
                    myTower.health = 1;
                    setLaunches(launches.filter((l) => l !== hisTower));
                    playSound('armor');
                } else if (myTower.health === hisTower.health) {
                    setLaunches(launches.filter((l) => l !== hisTower && l !== myTower));
                    playSound('blaster');
                }
                newExplosion(address);
            }

        };

        const newExplosion = (address: string) => {
            const newExplosion: Explosion = {
                address: address,
                timer: explosionSteps,
            };
            setExplosions(explosions => [...explosions, newExplosion]);

        };

        useEffect(() => {
                // exit early when we reach 0
                if (gameResult !== undefined) {
                    return;
                }
                let capacityUpdated = false;
                let launchUpdated = false;
                launches.map((launch) => {
                    let capacity = capacities.find((item) => item.startAddress === launch.currentAddress);
                    if (capacity?.live) {
                        capacityUpdated = true;
                        capacity.live = false;
                    }
                    if (launch.timer >= 1) {
                        launchUpdated = true;
                        if (launch.timer === 1) {
                            if (launch.points.length > 0) {
                                launch.currentAddress = launch.points[0];
                                launch.points = launch.points.slice(1);
                                launch.timer = moveSteps;
                            } else {
                                launch.currentAddress = launch.endAddress;
                                launch.health = 2;
                                launch.timer = 0;
                            }
                        } else {
                            launch.timer = launch.timer - 1;
                        }
                    }
                });
                let explosionsUpdated = false;
                explosions.map((item) => {
                    if (item.timer > 0) {
                        item.timer = item.timer - 1;
                        explosionsUpdated = true;
                    } else {
                        setExplosions(explosions.filter((value) => value.timer > 0));
                    }
                });
                if (explosionsUpdated) {
                    setExplosions(explosions);
                }
                if (capacityUpdated) {
                    const value = capacities.find((item) => !item.live);
                    setGameResult(!value?.myCapacity);
                    if (!value?.myCapacity) {
                        firestore().collection('invites').doc(invite.key).update('winner', userRef);
                    }

                    setCapacities(capacities);
                    playSound(value?.myCapacity ? 'lose' : 'win');

                }
                if (launchUpdated) {
                    setLaunches(launches);
                }

                // save intervalId to clear the interval when the
                // component re-renders
                const intervalId = setInterval(() => {
                    setTimeLeft(timeLeft - 1);
                }, timer);

                // clear interval on re-render to avoid memory leaks
                return () => clearInterval(intervalId);
                // add timeLeft as a dependency to re-rerun the effect
                // when we update it
            }, [capacities, launches, timeLeft]
        );

        useEffect(() => {
                if (capacities.find((item) => !item.live) === undefined) {
                    const availableCapacities = capacities.filter((item) => item.count > 0 && item.live && !item.myCapacity);
                    if (availableCapacities.length > 0) {
                        const max = 15;
                        const min = 1;
                        const secondsToPlay = Math.floor(Math.random() * (max - min + 1) + min);
                        const timeout = setTimeout(() => {
                            const rCapacityIndex = Math.floor(Math.random() * availableCapacities.length);
                            const capacity = availableCapacities[rCapacityIndex];
                            const liveFillRoutes = playerRoutes.filter((item) => item.startAddress === capacity.startAddress);
                            const rRouteIndex = Math.floor(Math.random() * liveFillRoutes.length);
                            const route = liveFillRoutes[rRouteIndex];
                            if (route.points !== undefined) {
                                const rEndIndex = Math.floor(Math.random() * route.points.length);
                                const end = route.points[rEndIndex];
                                launch(route, route.startAddress, end, false);
                                setReadyForHisLaunch(true);
                            }
                        }, secondsToPlay * 1000);
                        setReadyForHisLaunch(false);
                        return () => clearTimeout(timeout);
                    }
                }
            }, [readyForHisLaunch]
        );

        const newGame = () => {
            setReadyForMyLaunch(false);
            setGameResult(undefined);
            setReadyForHisLaunch(true);
            refillCapacities();
            setCurrentRoute(undefined);
            setStartAddress(undefined);
            setEndAddress(undefined);
            setLaunches([]);
            setAvailableRoutes([]);
        };

        const handleMyLaunch = (route: Route | undefined, start: string | undefined, end: string | undefined) => {
            setReadyForMyLaunch(false);
            launch(route, start, end, true);
        };

        const launch = (route: Route | undefined, start: string | undefined, end: string | undefined, myLaunch: boolean) => {
            if (start !== undefined && end !== undefined && route?.points !== undefined) {
                const endIndex = route?.points.indexOf(end);
                if (endIndex !== undefined) {
                    const currentCapacity = capacities.find((item) => item.startAddress === start);
                    if (currentCapacity !== undefined) {
                        currentCapacity.count = currentCapacity.count - 1;
                    }
                    setCapacities(capacities);
                    const newLaunch: Launch = {
                        health: 1,
                        myLaunch: myLaunch,
                        timer: moveSteps,
                        currentAddress: route?.points[0],
                        points: route?.points.slice(1, endIndex + 1),
                        endAddress: end,
                    };
                    setLaunches(launches => [...launches, newLaunch]);
                    if (myLaunch) {
                        setCurrentRoute(undefined);
                        setStartAddress(undefined);
                        setEndAddress(undefined);
                        setAvailableRoutes([]);
                    }
                }
            }
        };

        function getItem(selectedAddress: string) {
            const isStartCell = myRoutes.find((route) => (route.startAddress === selectedAddress)) !== undefined;
            if (isStartCell) {
                //click start line point
                if (selectedAddress === startAddress) {
                    setStartAddress(undefined);
                    setAvailableRoutes([]);
                } else {
                    const newAvailableRoutes = myRoutes.filter((item) => {
                        return item.startAddress === selectedAddress;
                    });
                    setStartAddress(selectedAddress);
                    setAvailableRoutes(newAvailableRoutes);
                }
                setEndAddress(undefined);
                setReadyForMyLaunch(false);
                setCurrentRoute(undefined);
            } else {
                //click destination point
                const availableRoutesForEnd = availableRoutes.filter((route) => (route.points.find((point) => (point === selectedAddress)) !== undefined));
                if (availableRoutesForEnd.length > 0) {
                    if (selectedAddress === endAddress) {
                        //повторное нажатие на том же конечном адресе
                        if (availableRoutesForEnd.length === 1) {
                            //для конечного адреса есть только один маршрут
                            setCurrentRoute(availableRoutesForEnd[0]);
                        } else {
                            //для конечного адреса есть несколько маршрутов
                            if (currentRoute?.key === availableRoutesForEnd[availableRoutesForEnd.length - 1].key) {
                                //все обошли, начинаем сначала
                                setCurrentRoute(availableRoutesForEnd[0]);
                            } else {
                                //переход на следующий маршрут
                                const currentRouteIndex = availableRoutesForEnd.indexOf(currentRoute!);
                                const currentRouteNext = availableRoutesForEnd[currentRouteIndex + 1];
                                setCurrentRoute(currentRouteNext);
                            }
                        }
                    } else {
                        //нажали другой конечный адрес возможного маршрута
                        setEndAddress(selectedAddress);
                        setReadyForMyLaunch(true);
                        //первый возможный выделим
                        setCurrentRoute(availableRoutesForEnd[0]);
                    }
                }
            }
        }

        useEffect(() => {
            navigation.setOptions({
                headerShown: true,
                headerBackTitle: '',
                headerTitle: invite?.userRef.id === userRef.id ? invite?.author.name : invite?.user.name,
                headerLeft: () => (
                    <TouchableOpacity style={Styles.back}
                                      onPress={() => setModalVisible(true)}>
                        <IconBack />
                    </TouchableOpacity>
                ),
                headerRight: () => ((readyForMyLaunch || gameResult !== undefined) &&
                    <ActionButton
                        isLoading={false}
                        disable={false}
                        onPress={() => gameResult !== undefined ? newGame() : handleMyLaunch(currentRoute, startAddress, endAddress)}
                        title={I18n.t(gameResult !== undefined ? 'game.reply' : 'game.go')}
                    />
                ),
            });
        }, [readyForMyLaunch, gameResult, currentRoute, endAddress, navigation, startAddress]);


        function cancelGame() {
            return firestore().runTransaction(async transaction => {
                // Get post data first
                const userSnapshot = await transaction.get(userRef);
                if (!userSnapshot.exists) {
                    throw 'User does not exist!';
                }
                transaction.update(userRef, {
                    loses: (userSnapshot.data()?.loses ?? 0) + 1
                });
                transaction.update(inviteRef, {
                    loserRef: userRef ,
                });
            }).then(exitGame);
        }

        function exitGame() {
            userRef.update('iAmReady', true).then(()=>{
                navigation.navigate('HomeScreen');
            });
        }


        const renderDialog = () => {
            return (<Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                        <Text style={Styles.modalText}>{I18n.t(invite?.loserRef ?  'game.opponent_gave_up' : 'game.exit_game')}</Text>
                        <Pressable
                            style={[Styles.button, Styles.buttonOpen]}
                            onPress={() => invite.loserRef ? exitGame() : cancelGame()}>
                            <Text style={Styles.textStyle}>{I18n.t(invite.loserRef ? 'i_see' : 'ok')}</Text>
                        </Pressable>
                        {invite?.loserRef === null && <Pressable
                            style={[Styles.button, Styles.buttonClose]}
                            onPress={() => setModalVisible(false)}>
                            <Text style={Styles.textStyle}>{I18n.t('cancel')}</Text>
                        </Pressable>}
                    </View>
                </View>
            </Modal>);

        };

        const renderLaunch = (address: string, movingLaunch: Launch) => {
            const letter = address.substring(0, 1);
            const nextLetter = movingLaunch?.points[0]?.substring(0, 1);
            const launchRadius = cellSize / (2 * launchCellRatio);
            const launchProgress = movingLaunch.timer / moveSteps;
            let topOffset = movingLaunch.myLaunch ? (cellSize * launchProgress - launchRadius) : (cellSize * (1 - launchProgress) - launchRadius);
            const leftDirectionOffset = cellSize * launchProgress - launchRadius;
            const rightDirectionOffset = cellSize * (1 - launchProgress) - launchRadius;
            let leftOffset = letter === nextLetter ? (cellSize / 2 - launchRadius) : letter === 'a' && movingLaunch.timer < moveSteps / 2 || letter === 'f' && movingLaunch.timer > moveSteps / 2 ? rightDirectionOffset : (letter === 'a' && movingLaunch.timer > moveSteps / 2 || letter === 'f' && movingLaunch.timer < moveSteps / 2 ? leftDirectionOffset : (address > nextLetter ? leftDirectionOffset : rightDirectionOffset));
            return <View
                style={{
                    borderRadius: cellSize / launchCellRatio,
                    width: cellSize / launchCellRatio,
                    height: cellSize / launchCellRatio,
                    backgroundColor: movingLaunch.myLaunch ? baseColor.sky : baseColor.pink,
                    position: 'absolute',
                    left: leftOffset,
                    top: topOffset,
                }}

            />;
        };

        const renderLaunches = (address: string) => {
            const containsTower = launches.find((item) => (item.currentAddress === address && item.points.length === 0));
            const movingLaunches = launches.filter((item) => (item.currentAddress === address && item.points.length > 0));
            checkNewExplosion(address);
            if (movingLaunches !== undefined || containsTower !== undefined) {
                return <View
                    style={{
                        width: cellSize,
                        height: cellSize,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                    }}>
                    {containsTower !== undefined && (
                        <Tower fill={containsTower.myLaunch ? baseColor.sky : baseColor.pink}/>)
                    }
                    {containsTower !== undefined && (
                        <Text> {containsTower.health}</Text>)
                    }
                    {(movingLaunches.map((item) => renderLaunch(address, item)))}
                </View>;
            }
        };

        const renderPoint = (address: string, isStartAddress: boolean, color: ColorValue, showCounter: boolean) => {
            const cellSizeWithPadding = (isStartAddress ? cellSize : cellSize / 2) * 0.5;
            const capacity = capacities.find((item) => item.startAddress === address);
            return <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                {(<View
                    style={{
                        borderRadius: cellSizeWithPadding,
                        width: cellSizeWithPadding,
                        height: cellSizeWithPadding,
                        backgroundColor: color,
                        position: 'absolute',
                        left: cellSize / 2 - (cellSizeWithPadding / 2),
                        top: cellSize / 2 - (cellSizeWithPadding / 2),
                    }}

                />)}
                {showCounter && !capacity?.live && (<IconFire size={'80%'}/>)}
                {showCounter && (<Text
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        color: baseColor.black,
                        fontSize: 20,
                    }}>{capacity?.count}</Text>)}
            </View>;

        };
        const renderAvailableTower = () => {
            return <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Tower fill={baseColor.blue}/>
            </View>;
        };

        const renderSwordman = (address: string) => {
            const capacity = capacities.find((item) => item.startAddress === address);
            return <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Swordman fill={baseColor.blue}/>
                <Text
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        color: baseColor.black,
                        fontSize: 20,
                    }}>{capacity?.count}</Text>
            </View>;
        };

        const playSound = (soundName: string) => {
            var sound = new Sound(soundName + '.mp3', Sound.MAIN_BUNDLE, (error: any) => {
                if (error) {
                    return;
                }
                // Play the sound with an onEnd callback
                sound.play();
            });

        };

        const renderExplosion = (address: string) => {
            const explosion = explosions.find((item) => item.address === address);
            if (explosion !== undefined) {
                const percent = 100 * explosion.timer / explosionSteps;
                return <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                    <IconFire size={percent + '%'}/>
                </View>;
            }
        };

        const boardSquareCell = (row: number, address: string, color: ColorValue, left: number, top: number) => {
            const isAvailableCell = availableRoutes.find((item: Route) => (item.points.find((point: string) => (point === address)))) !== undefined;
            const indexAddr = currentRoute?.points.indexOf(address) ?? -1;
            const indexEnd = currentRoute?.points.indexOf(endAddress ?? '') ?? -1;
            const addressInCurrentRoute = indexAddr >= 0;
            const isSelectedCell = (currentRoute !== undefined && endAddress !== undefined && addressInCurrentRoute && indexAddr <= indexEnd) || address === startAddress;
            const pointColor = isSelectedCell ? baseColor.sky : row === 11 ? baseColor.sky_50 : row === 0 && !isAvailableCell ? baseColor.pink : color === baseColor.wood_25 ? baseColor.gray_30 : baseColor.gray_50;
            return (<TouchableOpacity
                style={{
                    backgroundColor: color,
                    width: cellSize,
                    height: cellSize,
                    position: 'absolute',
                    left: left,
                    top: top,
                }}
                onPress={() => getItem(address)}>
                {renderExplosion(address)}
                {(row > 0 && row < 11) && renderLaunches(address)}
                {(row > 0 && row < 11 && address === endAddress && renderAvailableTower())}
                {(row === 0 && address === endAddress && renderSwordman(address))}
                {(address !== endAddress && (isAvailableCell || row === 0 || row === 11)) &&
                    renderPoint(address, address === startAddress, pointColor, row === 0 || row === 11)}
            </TouchableOpacity>);
        };

        const rows = [];
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 6; col++) {
                rows.push(
                    boardSquareCell(
                        row,
                        letters[col] + (12 - row).toString(),
                        (col + row) % 2 === 0 ? baseColor.white_50 : baseColor.wood_25,
                        (width - boardWidth) / 2 + col * boardWidth / 6,
                        row * cellSize
                    )
                );
            }
        }

        return (
            <View style={Styles.container}>
                {renderDialog()}
                {rows}
                {gameResult !== undefined && <Text style={{
                    fontSize: 60,
                    textAlign: 'center',
                    top: boardHeight / 2 - 70,
                }}>{I18n.t(gameResult ? 'game.game_over_win' : 'game.game_over_lose')}</Text>}
            </View>
        );


    }
;
