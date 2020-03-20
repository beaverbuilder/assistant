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

	appOrder.map( ( handle, i ) => {
		const app = apps[handle]

		if ( 'Undefined' === typeof app || ! app.shouldShowInAppList ) return

		if ( maxCount && output.length >= maxCount ) return

		output.push({
			...app,
			handle: app.app,
            icon: app.icon ? app.icon : Icon.DefaultApp,
            position: i,
            isFirst: false,
            isLast: false,
            moveUp: () => setAppPosition( handle, i - 1 ),
            moveDown: () => setAppPosition( handle, i + 1 )
		})
	})

    if ( output.length > 0 ) {
        output[0].isFirst = true
        output[ output.length - 1 ].isLast = true
    }

	return output
}

export default useAppList
