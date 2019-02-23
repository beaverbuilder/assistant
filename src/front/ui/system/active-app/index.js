import { useSystemState, getSystemActions, } from 'store'

export const useActiveApp = () => {
	const { apps, activeApp: name } = useSystemState()
	const { setActiveApp } = getSystemActions()

	const get = name => apps[ name ]

	return {
		key: name,
		app: get( name ),
		setActiveApp,

		activeAppName: name,
		activeApp: get( name ),
	}
}
