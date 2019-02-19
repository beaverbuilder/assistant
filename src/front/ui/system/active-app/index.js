import { useStore, useDispatch, } from 'store'

export const useActiveApp = () => {
	const { apps, activeApp: name } = useStore()
	const { setActiveApp } = useDispatch()

	const get = name => apps[ name ]

	return {
		key: name,
		app: get( name ),
		setActiveApp,

		activeAppName: name,
		activeApp: get( name ),
	}
}
