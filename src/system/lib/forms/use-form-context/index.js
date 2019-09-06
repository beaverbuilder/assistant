import { useContext, useReducer } from 'fl-react'
import { Form } from '../'

const hook = () => {
	const { fields } = useContext( Form.Context )
	return fields
}

const init = ( { config, initialValues } ) => {

	let obj = {}
	const defaultProperty = {
		value: undefined,
		label: null,
		id: null,
	}

	for ( let name in config ) {
		obj[name] = { ...defaultProperty, ...config[name] }

		if ( 'undefined' !== typeof initialValues[name] ) {
			obj[name].value = initialValues[name]
		}
	}

	return obj
}

export const useFormContext = ( config, initialValues ) => {

	const [ state, dispatch ] = useReducer( ( state, action ) => {

		switch ( action.type ) {
		case 'SET_VALUE':
			return {
				...state,
				[action.key]: {
					...state[action.key],
					value: action.value,
				}
			}
		default:
			return state
		}

	}, { config, initialValues }, init )

	const setValue = ( key, value ) => {

		dispatch( {
			type: 'SET_VALUE',
			key,
			value,
		} )
	}

	// Values Selector - reduces state to just key/value pairs
	const selectValues = state => {
		let obj = {}

		for ( let key in state ) {
			obj[key] = state[key].value
		}
		return obj
	}

	const selectFields = state => {
		let obj = {}

		for ( let key in state ) {
			const field = state[key]
			obj[key] = {
				...field,
				onChange: e => setValue( key, e.target.value )
			}
		}
		return obj
	}

	const values = selectValues( state )
	const fields = selectFields( state )

	const context = { values, fields }

	return {
		values,
		formContext: context,
		useForm: hook,
	}
}
