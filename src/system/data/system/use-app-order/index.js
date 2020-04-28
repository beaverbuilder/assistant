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
            Object.keys( apps ).includes( key ) &&
            false !== apps[key].shouldShowInAppList &&
            ( maxCount && i + 1 <= maxCount )
        )),
        resetAppOrder
    ]
}
export default useAppOrder
