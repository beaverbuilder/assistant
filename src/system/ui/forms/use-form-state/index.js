import { useReducer } from 'react'

export const useFormState = ( initial = {}, onChange = () => {} ) => {

	const reducer = ( state, action ) => {
		const newState = { ...state }

		switch ( action.type ) {
		case 'SET_VALUE':
			newState[action.key] = action.value
			return newState
		default:
			return state
		}
	}
	const [ state, dispatch ] = useReducer( reducer, initial )

	const setValue = ( key, value ) => dispatch( {
		type: 'SET_VALUE',
		key,
		value,
	} )

	onChange( state )

	return [ state, setValue ]
}
