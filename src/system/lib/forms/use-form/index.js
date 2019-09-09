import { useContext, useReducer } from 'fl-react'
import { Form } from '../'

const hook = () => {
	const { fields } = useContext( Form.Context )
	return fields
}

// Default sanitizer
const sanitize = v => v

const init = ( { config, initialValues } ) => {

	let obj = {}
	const defaultProperty = {
		value: undefined,
		lastCommittedValue: undefined,
		label: null,
		id: null,
		disabled: false,
		required: false,
		sanitize,
		onChange: () => {},
	}

	for ( let name in config ) {
		obj[name] = {
			...defaultProperty,
			id: name,
			...config[name]
		}

		// Initialize Last Committed Value
		if ( 'undefined' !== typeof obj[name].value ) {
			obj[name].lastCommittedValue = obj[name].value
		}

		if ( 'undefined' !== typeof initialValues[name] ) {
			const value = obj[name].sanitize( initialValues[name] )
			obj[name].value = value
			obj[name].lastCommittedValue = value
		}
	}

	return obj
}

const defaultOptions = {
	onSubmit: () => {},
	onChange: () => {},
	onReset: () => {},
}

export const useForm = (
	config = {},
	givenOptions = {},
	initialValues = {}
) => {

	const options = { ...defaultOptions, ...givenOptions }

	const [ state, dispatch ] = useReducer( ( state, action ) => {

		const obj = { ...state }

		switch ( action.type ) {
		case 'SET_VALUE':

			if ( state[action.key].value === action.value ) {
				return state
			}
			return {
				...state,
				[action.key]: {
					...state[action.key],
					value: state[action.key].sanitize( action.value ),
				}
			}

		case 'COMMIT_VALUE':
			return {
				...state,
				[action.key]: {
					...state[action.key],
					lastCommittedValue: state[action.key].value
				}
			}

		case 'COMMIT_ALL':

			for ( let key in state ) {
				obj[key].lastCommittedValue = obj[key].value
			}
			return obj

		case 'REVERT_VALUE':
			return {
				...state,
				[action.key]: {
					...state[action.key],
					value: state[action.key].lastCommittedValue
				}
			}

		case 'REVERT_ALL':

			for ( let key in state ) {
				obj[key].value = obj[key].lastCommittedValue
			}
			return obj

		default:
			return state
		}

	}, { config, initialValues }, init )

	/**
	 * Set a single field to a new value.
	 * Optionally set its last committed value also.
	 */
	const setValue = ( key, value, shouldCommit = false ) => {
		dispatch( {
			type: 'SET_VALUE',
			key,
			value,
		} )
		if ( shouldCommit ) {
			dispatch( {
				type: 'COMMIT_VALUE',
				key,
			} )
		}
	}

	// Has a single field's value changed since last commit (or initialize)
	const valueHasChanged = field => field.value !== field.lastCommittedValue

	// Values Selector - reduces state to just key/value pairs
	const selectValues = state => {
		let obj = {}
		for ( let key in state ) {
			obj[key] = state[key].value
		}
		return obj
	}

	const selectChanged = state => {
		let obj = {}
		for ( let key in state ) {
			if ( state[key].value !== state[key].lastCommittedValue ) {
				obj[key] = state[key].value
			}
		}
		return obj
	}

	// Field Config Selector
	const selectFields = state => {
		let obj = {}

		for ( let key in state ) {

			const field = state[key]
			obj[key] = {
				...field,
				hasChanges: valueHasChanged( field ),
				onChange: v => {
					setValue( key, v )

					// call onChange from field config
					if ( 'function' === typeof field.onChange ) {
						field.onChange( v )
					}

					// call options onChange handler
					options.onChange( key, v )
				}
			}

			// Remove properties that should not be on DOM elements
			delete obj[key].sanitize
			delete obj[key].lastCommittedValue
		}
		return obj
	}

	const values = selectValues( state )
	const fields = selectFields( state )
	const changed = selectChanged( state )
	const hasChanges = 0 < Object.keys( changed ).length
	const context = { values, fields }

	const resetForm = () => {
		dispatch( {
			type: 'REVERT_ALL'
		} )
		options.onReset( changed, values )
	}

	const submitForm = () => {
		dispatch( {
			type: 'COMMIT_ALL'
		} )
		options.onSubmit( changed, values )
	}

	const result = {
		values,
		changed,
		form: {
			onSubmit: e => e.preventDefault(),
			context,
		},
		fields,
		useFormContext: hook,
		hasChanges,
		resetForm,
		submitForm,
	}
	return result
}
