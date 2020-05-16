import { useSystemState, getSystemActions } from '../'
import { Icon } from 'ui'

const defaults = {
	maxCount: null,
}

const useAppList = ( config = defaults ) => {
	const { maxCount } = config
	const { apps, appOrder } = useSystemState()
	const { setAppPosition } = getSystemActions()
	let output = []
	let count = 'function' === typeof maxCount ? maxCount() : maxCount

	appOrder.map( ( handle, i ) => {
		const app = apps[handle]

		if ( 'undefined' === typeof app || ! app.shouldShowInAppList ) {
			return
		}

		if ( count && output.length >= count ) {
			return
		}

		output.push( {
			...app,
			handle: app.app,
			icon: app.icon ? app.icon : Icon.Placeholder,
			position: i,
			isFirst: false,
			isLast: false,
			moveUp: () => setAppPosition( handle, i - 1 ),
			moveDown: () => setAppPosition( handle, i + 1 )
		} )
	} )

	if ( 0 < output.length ) {
		output[0].isFirst = true
		output[ output.length - 1 ].isLast = true
	}

	return output
}

export default useAppList
