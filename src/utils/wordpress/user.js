import store from 'store'

export const currentUserCan = ( cap ) => {
	const { capabilities } = store.getState().currentUser
	return capabilities[ cap ] ? true : false
}
