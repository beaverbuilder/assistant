import { useContext, useReducer, useState } from 'fl-react'
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
		alwaysCommit: false,
		label: null,
		id: null,
		disabled: false,
		required: false,
		isVisible: true,
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

	// Import read-only values from initialValues
	for ( let name in initialValues ) {
		if ( 'undefined' === typeof obj[name] ) {
			obj[name] = {
				...defaultProperty,
				id: name,
				value: initialValues[name],
				lastCommittedValue: initialValues[name],
				disabled: true,
				alwaysCommit: true,
			}
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

			let value = state[action.key].sanitize( action.value ) // eslint-disable-line
			let alwaysCommit = true === state[action.key].alwaysCommit // eslint-disable-line

			return {
				...state,
				[action.key]: {
					...state[action.key],
					value: value,
					lastCommittedValue: alwaysCommit ? value : state[action.key].lastCommittedValue
				}
			}

		case 'SET_VALUES':
			for ( let key in action.values ) {
				if ( 'undefined' !== typeof obj[key] ) {
					let value = action.values[key]
					obj[key].value = value

					if ( action.shouldCommit ) {
						obj[key].lastCommittedValue = value
					}
				}
			}
			return obj

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

		case 'SET_OPTIONS':
			return {
				...state,
				[action.key]: {
					...state[action.key],
					options: action.options,
				}
			}

		case 'SET_IS_VISIBLE':
			return {
				...state,
				[action.key]: {
					...state[action.key],
					isVisible: action.isVisible ? true : false
				}
			}

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

	/**
	 * Set some or all values with a given object of key/val pairs
	 */
	const setValues = ( values = {}, shouldCommit = true ) => {
		dispatch( {
			type: 'SET_VALUES',
			values,
			shouldCommit,
		} )
	}

	const setOptions = ( key = '', options = {} ) => {
		dispatch( {
			type: 'SET_OPTIONS',
			key,
			options,
		} )
	}

	const setIsVisible = ( key = '', isVisible = true ) => {
		dispatch( {
			type: 'SET_IS_VISIBLE',
			key,
			isVisible
		} )
	}

	// Has a single field's value changed since last commit (or initialize)
	const valueHasChanged = field => field.value !== field.lastCommittedValue

	// Values Selector - reduces state to just key/value pairs
	const selectValues = state => {
		let obj = {}
		let staticValues = {}

		for ( let key in state ) {
			if ( 'function' !== typeof state[key].value ) {
				staticValues[key] = state[key].value
			}
		}

		for ( let key in state ) {
			const value = state[key].value

			if ( 'function' === typeof value ) {
				obj[key] = value( { key, staticValues, setValue } )
			} else {
				obj[key] = staticValues[key]
			}
		}

		return obj
	}

	const selectIDs = state => {
		let obj = {}

		for ( let key in state ) {
			obj[key] = state[key].id ? state[key].id : key
		}

		return obj
	}

	const selectChanged = state => {
		let obj = {}
		for ( let key in state ) {

			// Ignore derived values
			if ( 'function' === typeof state[key].value ) {
				continue
			}

			if ( state[key].value !== state[key].lastCommittedValue ) {
				obj[key] = state[key].value
			}
		}
		return obj
	}

	// Field Config Selector
	const selectFields = ( state, values ) => {
		let obj = {}

		for ( let key in state ) {

			const field = state[key]
			obj[key] = {
				...field,
				hasChanges: valueHasChanged( field ),

				value: values[key],

				onChange: v => {
					setValue( key, v )

					const args = {
						key,
						value: v,
						setValue,
						setOptions,
						setIsVisible,
						state
					}

					// call onChange from field config
					if ( 'function' === typeof field.onChange ) {
						field.onChange( args )
					}

					// call options onChange handler
					options.onChange( args )
				}
			}

			// Setup 'options' key config
			if ( 'undefined' !== typeof obj[key].options ) {
				const value = obj[key].options

				const args = {
					key,
					state,
					setOptions,
					values,
				}

				obj[key] = Object.defineProperty( obj[key], 'options', {
					get() {
						if ( 'function' === typeof value ) {
							return value( args )
						}
						return value
					}
				} )
			}

			// Remove properties that should not be on DOM elements
			delete obj[key].sanitize
			delete obj[key].lastCommittedValue
			delete obj[key].alwaysCommit
		}
		return obj
	}

	const values = selectValues( state )

	const changed = selectChanged( state )
	const fields = selectFields( state, values )
	const ids = selectIDs( state )

	const hasChanges = 0 < Object.keys( changed ).length

	const context = { values, fields }

	const [ isSubmitting, setIsSubmitting ] = useState( false )

	const args = {
		state,
		changed,
		ids,
		values,
		setValue,
		setValues,
	}

	const resetForm = () => {
		dispatch( {
			type: 'REVERT_ALL'
		} )
		if ( 'function' === typeof options.onReset ) {
			options.onReset( changed, ids, values )
		}
	}

	const submitForm = () => {
		if ( isSubmitting ) {
			return
		}
		setIsSubmitting( true )
		dispatch( {
			type: 'COMMIT_ALL'
		} )
		if ( 'function' === typeof options.onSubmit ) {
			options.onSubmit( args )
		}
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
		isSubmitting,
		setIsSubmitting,
		setValues,
	}
	return result
}
