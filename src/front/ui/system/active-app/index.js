import { useStore, useDispatch, } from 'store'

export const useActiveApp = () => {
	const { apps, activeApp: name } = useStore()
	const { setActiveApp, setAppFrameSize } = useDispatch()

	const get = name => apps[ name ]

	const set = name => {
		const app = get( name )
		setActiveApp( name )
		setAppFrameSize( app.size )
		return app
	}

	return {
		key: name,
		app: get( name ),
		setActiveApp: set,

		activeAppName: name,
		activeApp: get( name ),
	}
}
