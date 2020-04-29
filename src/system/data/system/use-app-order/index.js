import { useSystemState, getSystemActions } from '../'

const defaults = {
	maxCount: null,
}
const useAppOrder = ( config = defaults ) => {
	const { maxCount } = config
	const { appOrder, apps } = useSystemState()
	const { resetAppOrder } = getSystemActions()

	return [
		appOrder.filter( ( key, i ) => (

			// Make sure there's a registered app
			Object.keys( apps ).includes( key ) &&

			// Make sure the app isn't hidden from lists
            false !== apps[key].shouldShowInAppList &&

			// If there's a max count, limit the total
            ( maxCount && i + 1 <= maxCount )
		) ),
		resetAppOrder
	]
}
export default useAppOrder
