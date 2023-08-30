import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  globalMargin: {
    marginHorizontal: 20,
  },
  settings: {
    flex: 1,
    backgroundColor: '#f7ede2',
  },
  title: {
    fontSize: 30,
    marginVertical: 10,
  },
  personButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  personButton: {
    width: 100,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personButtonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 'bold',
  },
  personImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginVertical: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  menuContainer: {
    marginVertical: 30,
    marginHorizontal: 15,
  },
  menuButton: {
    marginVertical: 5,
  },
  menuItemText: {
    fontSize: 18,
  },
});
