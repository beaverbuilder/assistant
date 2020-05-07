import { getSystemConfig } from 'data'

export const currentUserCan = ( cap ) => {
	const { currentUser } = getSystemConfig()
	return currentUser.capabilities[ cap ] ? true : false
}

