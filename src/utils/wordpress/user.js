import { useConfig } from 'store'

export const currentUserCan = ( cap ) => {
	const { currentUser } = useConfig()
	return currentUser.capabilities[ cap ] ? true : false
}
