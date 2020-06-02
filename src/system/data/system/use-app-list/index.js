import { useSystemState, getSystemActions } from '../'
import { Icon } from 'ui'

const defaults = {
	maxCount: null,
}

const move = function( arr, from, to ) {
	arr.splice( to, 0, arr.splice( from, 1 )[0] )
	return arr
}

const useAppList = ( config = defaults ) => {
	const { maxCount } = config
	const { apps, appOrder } = useSystemState()
	const { resetAppOrder } = getSystemActions()
	let output = []
	let count = 'function' === typeof maxCount ? maxCount() : maxCount

	const setPosition = ( handle, to ) => {
		const from = appOrder.indexOf( handle )
		resetAppOrder( move( appOrder, from, to ) )
	}

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
			moveUp: () => setPosition( handle, i - 1 ),
			moveDown: () => setPosition( handle, i + 1 )
		} )
	} )

	if ( 0 < output.length ) {
		output[0].isFirst = true
		output[ output.length - 1 ].isLast = true
	}

	return output
}

export default useAppList
