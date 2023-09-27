import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {ColorValue, Dimensions, Platform, Text, TouchableOpacity, View} from 'react-native';
import Styles from '../game/styles';
import {baseColor} from '../../theme/appTheme';

interface Props extends StackScreenProps<any, any> {
}

interface Route {
    key: string;
    startAddress: string;
    points: string[]
}

export const GameScreen = ({navigation}: Props) => {
        const [startAddress, setStartAddress] = useState<string | undefined>(undefined);
        const [endAddress, setEndAddress] = useState<string | undefined>(undefined);
        const [currentRoute, setCurrentRoute] = useState<Route | undefined>(undefined);
        const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
        useEffect(() => {
            navigation.setOptions({
                headerShown: true,
                headerBackTitle: '',
            });
        }, [navigation]);

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

        const routes = [
            {
                key: 'a1_f',
                startAddress: 'a1',
                points: ['a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12'],
            },
            {
                key: 'a1_r',
                startAddress: 'a1',
                points: ['b2', 'c3', 'd4', 'e5', 'f6', 'e7', 'd8', 'c9', 'b10', 'a11', 'b12'],
            },
            {
                key: 'b1_l',
                startAddress: 'b1',
                points: ['a2', 'b3', 'c4', 'd5', 'e6', 'f7', 'e8', 'd9', 'c10', 'b11', 'a12'],
            },
            {
                key: 'b1_f',
                startAddress: 'b1',
                points: ['b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12'],
            },
            {
                key: 'b1_r',
                startAddress: 'b1',
                points: ['c2', 'd3', 'e4', 'f5', 'e6', 'd7', 'c8', 'b9', 'a10', 'b11', 'c12'],
            },
            {
                key: 'c1_f',
                startAddress: 'c1',
                points: ['c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12'],
            },
            {
                key: 'c1_l',
                startAddress: 'c1',
                points: ['b2', 'a3', 'b4', 'c5', 'd6', 'e7', 'f8', 'e9', 'd10', 'c11', 'b12'],
            },
            {
                key: 'c1_r',
                startAddress: 'c1',
                points: ['d2', 'e3', 'f4', 'e5', 'd6', 'c7', 'b8', 'a9', 'b10', 'c11', 'd12'],
            },
            {
                key: 'd1_f',
                startAddress: 'd1',
                points: ['d2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12'],
            },
            {
                key: 'd1_l',
                startAddress: 'd1',
                points: ['c2', 'b3', 'a4', 'b5', 'c6', 'd7', 'e8', 'f9', 'e10', 'd11', 'c12'],
            },
            {
                key: 'd1_r',
                startAddress: 'd1',
                points: ['e2', 'f3', 'e4', 'd5', 'c6', 'b7', 'a8', 'b9', 'c10', 'd11', 'e12'],
            },
            {
                key: 'e1_f',
                startAddress: 'e1',
                points: ['e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12'],
            },
            {
                key: 'e1_l',
                startAddress: 'e1',
                points: ['d2', 'c3', 'b4', 'a5', 'b6', 'c7', 'd8', 'e9', 'f10', 'e11', 'd12'],
            },
            {
                key: 'e1_r',
                startAddress: 'e1',
                points: ['f2', 'e3', 'd4', 'c5', 'b6', 'a7', 'b8', 'c9', 'd10', 'e11', 'f12'],
            },
            {
                key: 'f1_f',
                startAddress: 'f1',
                points: ['f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'],
            },
            {
                key: 'f1_l',
                startAddress: 'f1',
                points: ['e2', 'd3', 'c4', 'b5', 'a6', 'b7', 'c8', 'd9', 'e10', 'f11', 'e12'],
            },
        ];


        function getItem(selectedAddress: string) {
            const isStartCell = routes.find((route: Route) => (route.startAddress === selectedAddress)) !== undefined;
            if (isStartCell) {
                //click start line point
                const newAvailableRoutes: Route[] = routes.filter((item) => {
                    return item.startAddress === selectedAddress;
                });
                setStartAddress(selectedAddress);
                setEndAddress(undefined);
                setCurrentRoute(undefined);
                setAvailableRoutes(newAvailableRoutes);
            } else {
                //click destination point
                const availableRoutesForEnd = availableRoutes.filter((route) => (route.points.find((point) => (point === selectedAddress)) !== undefined))
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
                        //нажали другой конечный адрес какого-либо маршрута
                        setEndAddress(selectedAddress);
                        //первый возможный выделим
                        setCurrentRoute(availableRoutesForEnd[0]);
                    }
                }
            }
        }

        const renderPoint = (isSelected: boolean, color: ColorValue, isEndAddress: boolean, showCounter: boolean) => {
            return <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <View
                    style={{
                        borderRadius: isEndAddress ? cellSize : cellSize / 2,
                        width: isEndAddress ? cellSize : cellSize / 2,
                        height: isEndAddress ? cellSize : cellSize / 2,
                        backgroundColor: color,
                        position: 'absolute',
                        left: cellSize / 2 - (isEndAddress ? cellSize / 2 : cellSize / 4),
                        top: cellSize / 2 - (isEndAddress ? cellSize / 2 : cellSize / 4),
                    }}

                />
                {showCounter && (<Text
                    style={{position: 'absolute', bottom: 0, right: 0, color: baseColor.black, fontSize: 20}}>6</Text>)}
            </View>;
        };

        const boardSquareCell = (row: number, address: string, color: ColorValue, left: number, top: number) => {
            const isAvailableCell = availableRoutes.find((item: Route) => (item.points.find((point: string) => (point === address)))) !== undefined;
            const indexAddr = currentRoute?.points.indexOf(address) ?? -1;
            const indexEnd = currentRoute?.points.indexOf(endAddress ?? '') ?? -1;
            const addressInCurrentRoute = indexAddr >= 0;
            const isSelectedCell = (currentRoute !== undefined && endAddress !== undefined && addressInCurrentRoute && indexAddr <= indexEnd) || address === startAddress;
            const pointColor = isSelectedCell ? baseColor.sky : row === 11 ? baseColor.sky_50 : row === 0 ? baseColor.pink : color === baseColor.wood ? baseColor.gray_30 : baseColor.gray_50
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
                {/*{balloon && renderColoredPoint(address === startAddress ? baseColor.sky : !isOpponent ? balloonColor : baseColor.gray_30)}*/}
                {(isAvailableCell || row === 0 || row === 11) &&
                    renderPoint(isSelectedCell, pointColor, address === endAddress, row === 0 || row === 11)}
            </TouchableOpacity>);
        };

        const rows = [];
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 6; col++) {
                rows.push(
                    boardSquareCell(
                        row,
                        String.fromCharCode(col + 97) + (12 - row).toString(),
                        (col + row) % 2 === 0 ? baseColor.white : baseColor.wood,
                        (width - boardWidth) / 2 + col * boardWidth / 6,
                        row * cellSize
                    )
                );
            }
        }

        return (
            <View style={Styles.container}>
                {rows}

            </View>
        );


    }
;
