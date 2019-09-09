import { useState, useContext, useReducer } from 'fl-react'
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
		previousValue: undefined,
		label: null,
		id: null,
		disabled: false,
		required: false,
		sanitize,
		hasChanged: false,
	}

	for ( let name in config ) {
		obj[name] = {
			...defaultProperty,
			id: name,
			...config[name]
		}

		if ( 'undefined' !== typeof initialValues[name] ) {
			const value = obj[name].sanitize( initialValues[name] )
			obj[name].value = value
			obj[name].previousValue = value
		}
	}

	return obj
}

const defaultOptions = {
	onSubmit: () => {},
	autocomplete: 'randomkey',
}

export const useForm = ( config = {}, _options = {}, initialValues = {} ) => {

	const options = { ...defaultOptions, ..._options }

	const [ hasChanges, setHasChanges ] = useState( false )

	const [ state, dispatch ] = useReducer( ( state, action ) => {

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
					previousValue: state[action.key].value,
					hasChanged: true,
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

	const selectChanged = state => {
		let obj = {}
		for ( let key in state ) {
			if ( state[key].hasChanged ) {
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
				onChange: v => {
					setValue( key, v )
					if ( ! hasChanges ) {
						setHasChanges( true )
					}
				}
			}

			// Filter properties that should not be on dom elements
			delete obj[key].sanitize
			delete obj[key].hasChanged
			delete obj[key].previousValue
		}
		return obj
	}

	const values = selectValues( state )
	const fields = selectFields( state )
	const changed = selectChanged( state )

	const context = { values, fields }

	const resetForm = () => {
		setHasChanges( false )
	}

	const submitForm = () => {
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
