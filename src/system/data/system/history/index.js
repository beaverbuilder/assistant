import { createMemoryHistory } from 'history'

const { history: savedHistory } = FL_ASSISTANT_INITIAL_STATE
const initialHistory = {
	initialIndex: savedHistory.index, // Do NOT include default value
}
if ( savedHistory.entries && savedHistory.entries.length ) {
	initialHistory.initialEntries = savedHistory.entries
}
const history = createMemoryHistory( initialHistory )

const getSystemHistory = () => history

export default getSystemHistory
