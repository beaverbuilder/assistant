import { useSystemState, getSystemActions, getSystemSelectors } from 'assistant/data'

const defaults = { maxCount: null }

const useAppOrder = ( config = defaults ) => {
	useSystemState( 'appOrder' )
	const { selectAppOrder } = getSystemSelectors()
	const { maxCount } = config
	const { resetAppOrder } = getSystemActions()

	return [
		selectAppOrder( maxCount ),
		resetAppOrder
	]
}
export default useAppOrder
