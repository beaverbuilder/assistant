import { useSystemState, getSystemActions, getSystemSelectors } from 'assistant/data'

const defaults = { maxCount: null }

const useAppOrder = ( config = defaults ) => {
	const { selectAppOrder } = getSystemSelectors()
	const { maxCount } = config
	useSystemState('appOrder')
	const { resetAppOrder } = getSystemActions()

	return [
		selectAppOrder( maxCount ),
		resetAppOrder
	]
}
export default useAppOrder
