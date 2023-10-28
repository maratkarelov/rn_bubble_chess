import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, Modal, Platform, Pressable, Text, TouchableOpacity, View} from 'react-native';
import Styles from '../home/styles';
import I18n from '../../locales/i18n';
import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {baseColor} from '../../theme/appTheme';
import crashlytics from '@react-native-firebase/crashlytics';

interface Props extends StackScreenProps<any, any> {
}

const invite = 'invite';
const waiting = 'waiting';
const waitingAuthor = 'waitingAuthor';
const waitingUser = 'waitingUser';

export const HomeScreen = ({navigation}: Props) => {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [iAmReady, setIAmReady] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]); // Initial empty array of users
    const [meInviteUsers, setMeInviteUsers] = useState<any[] | undefined>(undefined); // Initial empty array of users
    const [iInviteUsers, setIInviteUsers] = useState<any[] | undefined>(undefined); // Initial empty array of users
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | undefined>(undefined);
    const [inviteRef, setInviteRef] = useState<FirebaseFirestoreTypes.DocumentReference | undefined>(undefined);
    const [user, setUser] = useState<any | undefined>(undefined);
    const uid = auth().currentUser?.uid;
    const userRef = firestore().collection('users').doc(uid);

    async function readDbUser() {
        const userDocumentSnapshot = await userRef.get();
        setUser(userDocumentSnapshot.data());
    }

    const toggleSwitch = () => {
        if (uid !== undefined) {
            userRef.update('iAmReady', !iAmReady).then(() => {
                setIAmReady(previousState => !previousState);
            });
        }
    };
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);
    useEffect(() => {
        const excludeUsers = [userRef.id];
        iInviteUsers?.map((item) => {
            excludeUsers.push(item.data.userRef.id);
        });
        meInviteUsers?.map((item) => {
            excludeUsers.push(item.data.authorRef.id);
        });
        const uniqueExcludeUsers = Array.from(new Set(excludeUsers));
        const onlineUsersSubscriber = firestore()
            .collection('users')
            .where('iAmReady', '==', true)
            // .where('user.name', '==', 'Marat')
            .where(firestore.FieldPath.documentId(), 'not-in', uniqueExcludeUsers)
            .onSnapshot({
                error: (e) => console.log('*****************', e),
                next: (querySnapshot) => {
                    const items: any[] = [];
                    querySnapshot?.forEach(documentSnapshot => {
                        items.push({
                            data: documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    });

                    setOnlineUsers(items);
                    setLoading(false);
                },
            });
        return () => {
            onlineUsersSubscriber();
        };
    }, [meInviteUsers, iInviteUsers]);

    useEffect(() => {
        readDbUser().then(() => {
        });

        const meInvitedSubscriber = firestore()
            .collection('invites')
            .where('userRef', '==', userRef)
            .onSnapshot(querySnapshot => {
                const items: any[] = [];
                querySnapshot.forEach(documentSnapshot => {
                    items.push({
                        data: documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setMeInviteUsers(items);
            });
        const iInvitedSubscriber = firestore()
            .collection('invites')
            .where('authorRef', '==', userRef)
            .onSnapshot(querySnapshot => {
                const items: any[] = [];
                querySnapshot.forEach(documentSnapshot => {
                    items.push({
                        data: documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                const cuUser = firestore().collection('Users').doc('ABC').get();
                cuUser.then();
                setIInviteUsers(items);
            });

        // Unsubscribe from events when no longer in use
        return () => {
            meInvitedSubscriber();
            iInvitedSubscriber();
        };
    }, []);

    function listenInvite(clickInviteRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>) {
        clickInviteRef
            .onSnapshot(querySnapshot => {
                const waitingInvite = querySnapshot.data();
                if (waitingInvite?.waitingAuthor + waitingInvite?.waitingUser === 2) {
                    setModalVisible(false);
                    navigation.navigate('GameScreen');
                }
                console.log('waitingInvite', Platform.OS, waitingInvite?.waitingAuthor, waitingInvite?.waitingUser);
            });
    }

    const handleItemClick = (item: { key: string, data: any }) => {
            setSelectedItem(item);
            if (item.data.authorRef) {
                const clickInviteRef = firestore().collection('invites').doc(item.key);
                if (clickInviteRef !== undefined) {
                    listenInvite(clickInviteRef);
                    const waitingField = item?.data?.authorRef?.id === userRef?.id ? waitingAuthor : waitingUser;
                    clickInviteRef.update(waitingField, 1).then(() => {
                    });
                }
                setInviteRef(clickInviteRef);
            }
            setModalVisible(true);
        }
    ;

    const renderItem = ({item: {key, data}}: any) => {
        let backgroundColor = baseColor.gray_30;
        if ((data?.authorRef?.id === userRef.id && data?.waitingUser === 1) || (data?.userRef?.id === userRef.id && data?.waitingAuthor === 1)) {
            backgroundColor = baseColor.pink_50;
        }
        return (
            <TouchableOpacity style={[Styles.invite_item, {backgroundColor: backgroundColor}]}
                              onPress={() => handleItemClick({key, data})}>
                <Text>{data?.name}{data?.authorRef?.id === userRef.id ? data?.user?.name : data?.author?.name}</Text>
            </TouchableOpacity>);

    };

    const inviteUser = () => {
        const addInviteRef = firestore().collection('invites').doc();
        addInviteRef.set({
            waitingAuthor: 1,
            waitingUser: 0,
            authorRef: userRef,
            author: user,
            user: selectedItem?.data,
            userRef: firestore().collection('users').doc(selectedItem.key),
        }).then(() => {
            setInviteRef(addInviteRef);
            listenInvite(addInviteRef);
        });
    };

    function cancelWaiting() {
        if (inviteRef !== undefined) {
            const waitingField = selectedItem?.data?.authorRef?.id === userRef?.id ? waitingAuthor : waitingUser;
            inviteRef.update(waitingField, 0).then(() => {
                setInviteRef(undefined);
                setModalVisible(false);
                console.log('cancelWaiting');
            });
        }
    }

    const renderDialog = () => {
        const action = selectedItem?.data?.author ? waiting : invite;
        return (<Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
            <View style={Styles.centeredView}>
                <View style={Styles.modalView}>
                    <Text style={Styles.modalText}>{I18n.t('game.' + action)}</Text>
                    {action === invite && (<Pressable
                        style={[Styles.button, Styles.buttonClose]}
                        onPress={inviteUser}>
                        <Text style={Styles.textStyle}>{I18n.t('ok')}</Text>
                    </Pressable>)}
                    <Pressable
                        style={[Styles.button, Styles.buttonClose]}
                        onPress={cancelWaiting}>
                        <Text style={Styles.textStyle}>{I18n.t('cancel')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>);

    };

    return (
        <View style={Styles.container}>
            {renderDialog()}
            <View style={Styles.tabs}>
                <Text style={Styles.online}>{I18n.t('home.online')}</Text>
                <Text style={Styles.me_invited_text}>{I18n.t('home.me_invited')}</Text>
            </View>
            <View style={Styles.users}>
                <FlatList style={Styles.listOnline}
                          data={onlineUsers}
                          renderItem={renderItem}
                />
                <View style={Styles.listInvitesContainer}>
                    <FlatList style={Styles.listInvites}
                              data={meInviteUsers}
                              renderItem={renderItem}
                    />
                    <Text style={Styles.i_invited_text}>{I18n.t('home.i_invite')}</Text>
                    <FlatList style={Styles.listInvites}
                              data={iInviteUsers}
                              renderItem={renderItem}
                    />
                </View>
            </View>
        </View>
    );
};
