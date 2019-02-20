import { getConfig } from 'store'

export const currentUserCan = ( cap ) => {
	const { currentUser } = getConfig()
	return currentUser.capabilities[ cap ] ? true : false
}
