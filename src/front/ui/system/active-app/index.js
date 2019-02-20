import { useStore, getDispatch, } from 'store'

export const useActiveApp = () => {
	const { apps, activeApp: name } = useStore()
	const { setActiveApp } = getDispatch()

	const get = name => apps[ name ]

	return {
		key: name,
		app: get( name ),
		setActiveApp,

		activeAppName: name,
		activeApp: get( name ),
	}
}
