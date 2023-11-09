import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
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
import {authorRoutes, userRoutes} from '../game/gameCollections';
import I18n from '../../locales/i18n';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firestoreCollections, firestoreFields} from '../../constants/firestore';
import {useInterval} from 'react-interval-hook';

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
    directionToTop: boolean;
    timer: number;
    points: string[];
    currentAddress: string;
    endAddress: string;

}

interface Explosion {
    address: string,
    timer: number
}

let remoteOpponentCounter = 0;
let handleMyLaunchCounter = 0;

export const GameScreen = ({route, navigation}: Props) => {
        const {initInvite, initInviteRef} = route.params;
        const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
        const pointMovingInterval = 500;
        const moveSteps = 20;
        const launchCellRatio = 5;
        const explosionSteps = 5;
        const [inviteRef, setInviteRef] = useState(initInviteRef);
        const [invite, setInvite] = useState(initInvite);
        const [startAddress, setStartAddress] = useState<string | undefined>(undefined);
        const [endAddress, setEndAddress] = useState<string | undefined>(undefined);
        const [currentRoute, setCurrentRoute] = useState<Route | undefined>(undefined);
        const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
        const [launches, setLaunches] = useState<Launch[]>([]);
        const [explosions, setExplosions] = useState<Explosion[]>([]);
        const [capacities, setCapacities] = useState<Capacity[]>([]);
        const [step, setStep] = useState(0);
        const [readyForMyLaunch, setReadyForMyLaunch] = useState(false);
        const [readyForHisLaunch, setReadyForHisLaunch] = useState(false);
        const [gameResult, setGameResult] = useState<boolean | undefined>(undefined);
        const [waitingOpponentReadMyStep, setWaitingOpponentReadMyStep] = useState<boolean | undefined>(undefined);
        const [modalVisible, setModalVisible] = useState(false);
        const uid = auth().currentUser?.uid;
        const userRef = firestore().collection(firestoreCollections.USERS).doc(uid);
        const stepIds: any[] = [];

        var Sound = require('react-native-sound');
        // Enable playback in silence mode
        Sound.setCategory('Playback');
        //size
        const {width, height} = Dimensions.get('window');
        let {boardWidth, boardHeight} = {boardWidth: 0, boardHeight: 0};
        const efficientHeight = Platform.OS === 'ios' ? 0.85 : 0.9;
        const efficientWidth = Platform.OS === 'ios' ? 0.8 : 0.85;
        const capacityCount = 6;
        const timerRefillCapacity = 300;
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
            const iAmAuthor = invite === undefined || invite?.authorRef.id === userRef.id;
            if (capacities.length === 0) {
                const newCapacities = [
                    {startAddress: 'a1', count: capacityCount, live: true, myCapacity: iAmAuthor},
                    {startAddress: 'b1', count: capacityCount, live: true, myCapacity: iAmAuthor},
                    {startAddress: 'c1', count: capacityCount, live: true, myCapacity: iAmAuthor},
                    {startAddress: 'd1', count: capacityCount, live: true, myCapacity: iAmAuthor},
                    {startAddress: 'e1', count: capacityCount, live: true, myCapacity: iAmAuthor},
                    {startAddress: 'f1', count: capacityCount, live: true, myCapacity: iAmAuthor},
                    {startAddress: 'a12', count: capacityCount, live: true, myCapacity: !iAmAuthor},
                    {startAddress: 'b12', count: capacityCount, live: true, myCapacity: !iAmAuthor},
                    {startAddress: 'c12', count: capacityCount, live: true, myCapacity: !iAmAuthor},
                    {startAddress: 'd12', count: capacityCount, live: true, myCapacity: !iAmAuthor},
                    {startAddress: 'e12', count: capacityCount, live: true, myCapacity: !iAmAuthor},
                    {startAddress: 'f12', count: capacityCount, live: true, myCapacity: !iAmAuthor}];
                setCapacities(newCapacities);
            } else {
                capacities.forEach((item) => {
                    item.count = item.count + capacityCount;
                });
                setReadyForHisLaunch(!readyForHisLaunch)
            }
            // console.log(Platform.OS, 'newCapacities', newCapacities);

        };

        function listenInvite() {
            const opponentStepsSubscriber = inviteRef?.collection(firestoreCollections.STEPS)
                .where(firestoreFields.PLAYER_REF, '!=', userRef)
                .where(firestoreFields.READ, '==', false)
                .onSnapshot({
                    error: (e: Error) => console.log('*****************', e),
                    next: (querySnapshot: any[]) => {
                        const batch = firestore().batch();
                        querySnapshot?.forEach(documentSnapshot => {
                            const stepIdsLocal: any[] = [];
                            if (stepIds.find((id) => (id === documentSnapshot.ref.id)) === undefined && stepIdsLocal.find((id) => (id === documentSnapshot.ref.id)) === undefined) {
                                batch.update(documentSnapshot.ref, firestoreFields.READ, true);
                                const opponentStep = documentSnapshot.data();
                                stepIdsLocal.push([documentSnapshot.ref.id]);
                                stepIds.push([documentSnapshot.ref.id]);
                                remoteOpponentCounter++;
                                console.log(invite?.userRef.id === userRef.id ? invite?.user.name : invite?.author.name, 'line 158 remoteOpponentCounter', remoteOpponentCounter, Date());
                                launch(opponentStep.route, opponentStep.end, false);
                            }
                        });
                        return batch.commit();
                    },
                });
            const myStepsSubscriber = inviteRef?.collection(firestoreCollections.STEPS)
                .where(firestoreFields.PLAYER_REF, '==', userRef)
                .where(firestoreFields.READ, '==', false)
                .onSnapshot({
                    error: (e: Error) => console.log('*****************', e),
                    next: (querySnapshot: any[]) => {
                        setWaitingOpponentReadMyStep(querySnapshot.length > 0);
                    },
                });
            // let opponentStepsSubscriber = inviteRef
            //     .onSnapshot({
            //         error: (e: Error) => console.log('*****************', e),
            //         next: (querySnapshot: any[]) => {
            //             const queryInvite = querySnapshot.data();
            //             setInvite(queryInvite);
            //             if (queryInvite?.loserRef && queryInvite?.loserRef?.id !== userRef.id) {
            //                 // opponent gave up
            //                 setModalVisible(true);
            //             }
            //             const userField = queryInvite?.userRef.id === userRef.id ? firestoreFields.STEP_AUTHOR : firestoreFields.STEP_USER;
            //             const opponentStep = queryInvite[userField];
            //             if (opponentStep) {
            //                 remoteOpponentCounter++;
            //                 console.log(invite?.userRef.id === userRef.id ? invite?.author.name : invite?.user.name, 'line 158 remoteOpponentCounter', remoteOpponentCounter, Date());
            //                 launch(opponentStep.route, opponentStep.start, opponentStep.end, false);
            //                 inviteRef.update(userField, null);
            //             }
            //         },
            //     });
            return () => {
                opponentStepsSubscriber();
                myStepsSubscriber();
            };
        }

        useEffect(() => {
            remoteOpponentCounter = 0;
            handleMyLaunchCounter = 0;
            refillCapacities();
            listenInvite();
            setReadyForHisLaunch(true);
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
            const bottomPlayerTower = launches.find((item) => (item.currentAddress === address && item.directionToTop && item.currentAddress === item.endAddress));
            const bottomPlayerLaunch = launches.find((item) => (item.currentAddress === address && item.directionToTop && item.currentAddress !== item.endAddress));
            const topPlayerTower = launches.find((item) => (item.currentAddress === address && !item.directionToTop && item.currentAddress === item.endAddress));
            const topPlayerLaunch = launches.find((item) => (item.currentAddress === address && !item.directionToTop && item.currentAddress !== item.endAddress));
            if (bottomPlayerTower !== undefined && topPlayerLaunch !== undefined) {
                if (bottomPlayerTower.health === 2) {
                    bottomPlayerTower.health = 1;
                    const newLaunches = launches.filter((l) => l !== topPlayerLaunch);
                    setLaunches(newLaunches);
                    playSound('armor');
                } else {
                    playSound('blaster');
                    setLaunches(launches.filter((l) => l !== topPlayerLaunch && l !== bottomPlayerTower));
                }
                newExplosion(address);
            } else if (bottomPlayerLaunch !== undefined && topPlayerTower !== undefined) {
                if (topPlayerTower.health === 2) {
                    topPlayerTower.health = 1;
                    setLaunches(launches.filter((l) => l !== bottomPlayerLaunch));
                    playSound('armor');
                } else {
                    playSound('blaster');
                    setLaunches(launches.filter((l) => l !== topPlayerTower && l !== bottomPlayerLaunch));
                }
                newExplosion(address);
            } else if (bottomPlayerLaunch !== undefined && topPlayerLaunch !== undefined) {
                setLaunches(launches.filter((item) => item !== bottomPlayerLaunch && item !== topPlayerLaunch));
                playSound('blaster');
                newExplosion(address);
            } else if (bottomPlayerTower !== undefined && topPlayerTower !== undefined) {
                if (topPlayerTower.health === 2) {
                    topPlayerTower.health = 1;
                    setLaunches(launches.filter((l) => l !== bottomPlayerTower));
                    playSound('armor');
                } else if (bottomPlayerTower.health === 2) {
                    bottomPlayerTower.health = 1;
                    setLaunches(launches.filter((l) => l !== topPlayerTower));
                    playSound('armor');
                } else if (bottomPlayerTower.health === topPlayerTower.health) {
                    setLaunches(launches.filter((l) => l !== topPlayerTower && l !== bottomPlayerTower));
                    playSound('blaster');
                }
                newExplosion(address);
            }

        };

        const newExplosion = (address: string) => {
            const addExplosion: Explosion = {
                address: address,
                timer: explosionSteps,
            };
            setExplosions(() => [...explosions, addExplosion]);

        };
        useInterval(() => {
            setStep(step + 1);
            if (step > 0 && step % timerRefillCapacity === 0) {
                refillCapacities();
            }
        }, pointMovingInterval);

        useEffect(() => {
                // exit early when we reach 0
                if (gameResult !== undefined) {
                    return;
                }
                let gameOver = false;
                launches.map((launch) => {
                    let capacity = capacities.find((item) => item.startAddress === launch.currentAddress);
                    if (capacity?.live) {
                        gameOver = true;
                        capacity.live = false;
                    }
                    if (launch.timer > 0) {
                        if (launch.timer === 1) {
                            if (launch.points.length > 0) {
                                // console.log(Platform.OS, 'line 247 new cell', Date())
                                launch.currentAddress = launch.points[0];
                                launch.points = launch.points.slice(1);
                                launch.timer = moveSteps;
                            } else {
                                launch.currentAddress = launch.endAddress;
                                launch.health = 2;
                                launch.timer = 0;
                            }
                        } else {
                            // console.log(Platform.OS, 'line 253', Date())
                            launch.timer = launch.timer - 1;
                        }
                    }
                });
                setLaunches(launches);
                explosions.forEach((item) => {
                    if (item.timer > 0) {
                        item.timer = item.timer - 1;
                    } else {
                        setExplosions(explosions.filter((value) => value.timer > 0));
                    }
                });
                if (gameOver) {
                    const value = capacities.find((item) => !item.live);
                    setGameResult(!value?.myCapacity);
                    const inviteField = value?.myCapacity ? firestoreFields.LOSER_REF : firestoreFields.WINNER_REF;
                    if (value?.myCapacity) {
                        inviteRef?.update(inviteField, userRef);
                    }
                    playSound(value?.myCapacity ? 'lose' : 'win');

                }
            }, [step, capacities, explosions, launches]
        );

        useEffect(() => {
                if (capacities.find((item) => !item.live) === undefined) {
                    const availableCapacities = capacities.filter((item) => item.count > 0 && item.live && !item.myCapacity);
                    if (availableCapacities.length > 0) {
                        const max = 0;
                        const min = 10;
                        const secondsToPlay = Math.floor(Math.random() * (max - min + 1) + min);
                        const timeout = setTimeout(() => {
                            const rCapacityIndex = Math.floor(Math.random() * availableCapacities.length);
                            const capacity = availableCapacities[rCapacityIndex];
                            const liveFillRoutes = userRoutes.filter((item) => item.startAddress === capacity.startAddress);
                            const rRouteIndex = Math.floor(Math.random() * liveFillRoutes.length);
                            const route = liveFillRoutes[rRouteIndex];
                            if (route?.points !== undefined) {
                                const rEndIndex = Math.floor(Math.random() * route.points.length);
                                const end = route.points[rEndIndex];
                                launch(route, end, false);
                            }
                            setReadyForHisLaunch(true);
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
            refillCapacities();
            setCurrentRoute(undefined);
            setStartAddress(undefined);
            setEndAddress(undefined);
            setLaunches([]);
            setAvailableRoutes([]);
        };

        const handleMyLaunch = (launchRoute: Route | undefined, end: string | undefined) => {
                handleMyLaunchCounter++;
                console.log(invite?.userRef.id === userRef.id ? invite?.user.name : invite?.author.name, 'line 343 handleMyLaunch', handleMyLaunchCounter, Date());
                setReadyForMyLaunch(false);
                if (inviteRef) {
                    const stepRef = inviteRef.collection(firestoreCollections.STEPS).doc();
                    return firestore().runTransaction(async transaction => {
                            const currentCapacityAddress = launchRoute?.startAddress;
                            const inviteSnapshot = await transaction.get(inviteRef);
                            if (!inviteSnapshot.exists) {
                                throw 'Post does not exist!';
                            }
                            const currentCapacityValue = inviteSnapshot.data()[currentCapacityAddress];
                            if (currentCapacityValue > 0) {
                                transaction.set(stepRef, {
                                    [firestoreFields.PLAYER_REF]: userRef,
                                    [firestoreFields.READ]: false,
                                    date: Date(),
                                    route: launchRoute,
                                    end: end,
                                });

                                transaction.update(inviteRef, {[currentCapacityAddress]: currentCapacityValue - 1});
                            }

                        }
                    ).then(() => launch(launchRoute, end, true));
                } else {
                    launch(launchRoute, end, true);
                }
                // inviteRef.collection(firestoreCollections.STEPS).add(
                //     {
                //         [firestoreFields.PLAYER_REF]: userRef,
                //         [firestoreFields.READ]: false,
                //         date: Date(),
                //         route: launchRoute,
                //         end: end,
                //
                //     }).then(() => launch(launchRoute, end, true));
            }
        ;

        const launch = (launchRoute: Route | undefined, end: string | undefined, myLaunch: boolean) => {
            // console.log(invite?.userRef.id === userRef.id ? invite?.user.name : invite?.author.name, launchRoute, end);
            if (launchRoute?.startAddress !== undefined && end !== undefined && launchRoute?.points !== undefined) {
                const endIndex = launchRoute?.points.indexOf(end);
                if (endIndex !== undefined) {
                    const currentCapacity = capacities.find((item) => item.startAddress === launchRoute.startAddress);
                    if (currentCapacity !== undefined) {
                        currentCapacity.count = currentCapacity.count - 1;
                    }
                    // setCapacities(capacities);
                    const newLaunch: Launch = {
                        health: 1,
                        directionToTop: invite === undefined ? myLaunch : (invite.authorRef.id === userRef.id && myLaunch) || (invite.userRef.id === userRef.id && !myLaunch),
                        timer: moveSteps,
                        currentAddress: launchRoute?.points[0],
                        points: launchRoute?.points.slice(1, endIndex + 1),
                        endAddress: end,
                    };
                    launches.push(newLaunch);
                    // console.log(Platform.OS, 'line 370\n', launches.length +' launches','\n' , launches,'\n new launch ' ,newLaunch);
                    // setLaunches(items => [...items, newLaunch]);
                    if (myLaunch) {
                        setCurrentRoute(undefined);
                        setStartAddress(undefined);
                        setEndAddress(undefined);
                        setAvailableRoutes([]);
                    }
                }
            }
        };

// console.log(Platform.OS, ' 389 : launches count', launches.length);

        function getItem(selectedAddress: string) {
            const routes = invite === undefined || invite.authorRef.id === userRef.id ? authorRoutes : userRoutes;
            const isStartCell = routes.find((route) => (route.startAddress === selectedAddress)) !== undefined;
            if (isStartCell) {
                //click start line point
                if (selectedAddress === startAddress) {
                    setStartAddress(undefined);
                    setAvailableRoutes([]);
                } else {
                    const newAvailableRoutes = routes.filter((item) => {
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

// console.log('steps',invite.stepUser, invite.stepAuthor)

        useEffect(() => {
            navigation.setOptions({
                headerShown: true,
                headerBackTitle: '',
                headerTitle: (invite ? invite?.userRef.id === userRef.id ? invite?.author.name : invite?.user.name : "") + I18n.t('game.reload') + (timerRefillCapacity - (step * pointMovingInterval / 1000) % timerRefillCapacity).toFixed(0),
                headerLeft: () => (
                    <TouchableOpacity style={Styles.back}
                                      onPress={() => setModalVisible(true)}>
                        <IconBack/>
                    </TouchableOpacity>
                ),
                headerRight: () => ((readyForMyLaunch || gameResult !== undefined) &&
                    <ActionButton
                        isLoading={waitingOpponentReadMyStep}
                        disable={waitingOpponentReadMyStep}
                        onPress={() => gameResult !== undefined ? newGame() : handleMyLaunch(currentRoute, endAddress)}
                        title={I18n.t(gameResult !== undefined ? 'game.reply' : 'game.go')}
                    />
                ),
            });
        }, [readyForMyLaunch, gameResult, currentRoute, endAddress, navigation, step]);

        // console.log('readyForMyLaunch', readyForMyLaunch)
        function exitGame() {
            if (invite) {
                const inviteField = invite.loserRef ? firestoreFields.WINNER_REF : firestoreFields.LOSER_REF;
                inviteRef.update(inviteField, userRef).then(() => {
                    const userField = invite.loserRef ? firestoreFields.WINS : firestoreFields.LOSES;
                    const prevCount = invite.userRef.id === userRef.id ? invite.user[userField] : invite.author[userField];
                    userRef.update({
                        [firestoreFields.I_AM_READY]: true,
                        [userField]: (prevCount ?? 0) + 1,
                    })
                        .then(() => {
                            navigation.navigate('HomeScreen');
                        });
                });
            } else {
                navigation.navigate('HomeScreen');
            }
        }

        const renderDialog = () => {
            return (<Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={Styles.centeredView}>
                    <View style={Styles.modalView}>
                        <Text
                            style={Styles.modalText}>{I18n.t(invite?.loserRef ? 'game.opponent_gave_up' : 'game.exit_game')}</Text>
                        <Pressable
                            style={[Styles.button, Styles.buttonOpen]}
                            onPress={() => exitGame()}>
                            <Text style={Styles.textStyle}>{I18n.t(invite?.loserRef ? 'i_see' : 'ok')}</Text>
                        </Pressable>
                        {(invite === undefined || invite?.loserRef === null) && <Pressable
                            style={[Styles.button, Styles.buttonClose]}
                            onPress={() => setModalVisible(false)}>
                            <Text style={Styles.textStyle}>{I18n.t('cancel')}</Text>
                        </Pressable>}
                    </View>
                </View>
            </Modal>);

        };
        // console.log('invite',invite)

        const renderLaunch = (address: string, movingLaunch: Launch) => {
            const letter = address.substring(0, 1);
            const nextLetter = movingLaunch?.points[0]?.substring(0, 1);
            const launchRadius = cellSize / (2 * launchCellRatio);
            const launchProgress = movingLaunch.timer / moveSteps;
            let topOffset = movingLaunch.directionToTop ? (cellSize * launchProgress - launchRadius) : (cellSize * (1 - launchProgress) - launchRadius);
            const leftDirectionOffset = cellSize * launchProgress - launchRadius;
            const rightDirectionOffset = cellSize * (1 - launchProgress) - launchRadius;
            let leftOffset = letter === nextLetter ? (cellSize / 2 - launchRadius) : letter === 'a' && movingLaunch.timer < moveSteps / 2 || letter === 'f' && movingLaunch.timer > moveSteps / 2 ? rightDirectionOffset : (letter === 'a' && movingLaunch.timer > moveSteps / 2 || letter === 'f' && movingLaunch.timer < moveSteps / 2 ? leftDirectionOffset : (address > nextLetter ? leftDirectionOffset : rightDirectionOffset));
            return <View
                style={{
                    borderRadius: cellSize / launchCellRatio,
                    width: cellSize / launchCellRatio,
                    height: cellSize / launchCellRatio,
                    backgroundColor: movingLaunch.directionToTop ? baseColor.sky : baseColor.pink,
                    position: 'absolute',
                    left: leftOffset,
                    top: topOffset,
                }}

            />;
        };

        const renderLaunches = (address: string) => {
            const towers = launches.filter((item) => (item.currentAddress === address && item.points.length === 0));
            const totalHealth = towers.reduce((a, b) => a + b.health, 0);
            const movingLaunches = launches.filter((item) => (item.currentAddress === address && item.points.length > 0));
            checkNewExplosion(address);
            if (movingLaunches !== undefined || towers.length > 0) {
                return <View
                    style={{
                        width: cellSize,
                        height: cellSize,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                    }}>
                    {totalHealth > 0 &&
                        <Tower fill={towers.find((item) => item.directionToTop) ? baseColor.sky : baseColor.pink}/>
                    }
                    {totalHealth > 0 && <Text> {totalHealth}</Text>}
                    {movingLaunches.map((item) => renderLaunch(address, item))}
                </View>;
            }
        };

        const renderPoint = (address: string, isStartAddress: boolean, color: ColorValue, showCounter: boolean) => {
            const cellSizeWithPadding = (isStartAddress ? cellSize : cellSize / 2) * 0.5;
            const capacity = capacities.find((item) => item.startAddress === address);
            return <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <View
                    style={{
                        borderRadius: cellSizeWithPadding,
                        width: cellSizeWithPadding,
                        height: cellSizeWithPadding,
                        backgroundColor: color,
                        position: 'absolute',
                        left: cellSize / 2 - (cellSizeWithPadding / 2),
                        top: cellSize / 2 - (cellSizeWithPadding / 2),
                    }}

                />
                {showCounter && !(capacity?.live ?? true) && <IconFire size={'80%'}/>}
                {showCounter && <Text style={Styles.counterText}>{capacity?.count ?? '-'}</Text>}
            </View>;

        };
// console.log(Platform.OS, capacities)
        const renderAvailableTower = () => {
            return <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Tower fill={invite === undefined || invite.authorRef.id === userRef.id ? baseColor.blue : baseColor.red}/>
            </View>;
        };

        const renderSwordman = (address: string) => {
            const capacity = capacities.find((item) => item.startAddress === address);
            return <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Swordman
                    fill={invite === undefined || invite.authorRef.id === userRef.id ? baseColor.blue : baseColor.red}/>
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
            const unselectedPointColor = color === baseColor.wood_25 ? baseColor.gray_30 : baseColor.gray_50;
            const selectedPointColor = invite === undefined || invite?.authorRef.id === userRef.id ? baseColor.sky : baseColor.pink;
            const pointColor = isSelectedCell ? selectedPointColor : row === 11 && !isAvailableCell ? baseColor.sky_50 : row === 0 && !isAvailableCell ? baseColor.pink_50 : unselectedPointColor;
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
                {((row === 0 || row === 11) && address === endAddress && renderSwordman(address))}
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
