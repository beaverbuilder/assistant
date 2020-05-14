import { useEffect, useReducer, useRef, useState } from 'react'
import classname from 'classnames'

const initReducer = ( { fields, defaults } ) => {
	const state = {}

	Object.entries( fields ).map( ( [ key, field ] ) => {
		const { sanitize } = field
		const value = sanitize( defaults[ key ] )
		state[ key ] = {
			value,
			lastCommittedValue: value,
			errors: []
		}
	} )

	return state
}

export const useFormData = ( {
	fields = {},
	defaults = {},
	shouldHighlightChanges = true,
	onSubmit = () => {},
	onChange = () => {},
	onReset = () => {},
} ) => {
	const [ isSubmitting, setIsSubmitting ] = useState( false )
	const isMounted = useRef( false )

	useEffect( () => {
		isMounted.current = true
		return () => isMounted.current = false
	}, [] )

	Object.entries( fields ).map( ( [ key, field ] ) => {
		fields[ key ] = {
			alwaysCommit: false,
			disabled: false,
			id: null,
			isRequired: false,
			isVisible: true,
			label: null,
			onChange: () => {},
			sanitize: v => v,
			validate: () => {},
			...field,
		}
	} )

	const [ state, dispatch ] = useReducer( ( state, action ) => {
		switch ( action.type ) {
		case 'SET_VALUE':
			if ( state[ action.key ].value === action.value ) {
				return state
			}
			let value = fields[ action.key ].sanitize( action.value )
			let alwaysCommit = fields[ action.key ].alwaysCommit
			return {
				...state,
				[ action.key ]: {
					value: value,
					lastCommittedValue: alwaysCommit ? value : state[ action.key ].lastCommittedValue,
					errors: []
				}
			}

		case 'SET_VALUES':
			for ( let key in action.values ) {
				if ( undefined !== state[ key ] ) {
					state[ key ].value = action.values[ key ]
					if ( action.shouldCommit ) {
						state[ key ].lastCommittedValue = action.values[ key ]
					}
				}
			}
			return { ...state }

		case 'COMMIT_VALUE':
			return {
				...state,
				[ action.key ]: {
					...state[ action.key ],
					lastCommittedValue: state[ action.key ].value
				}
			}

		case 'COMMIT_ALL':
			for ( let key in state ) {
				state[ key ].lastCommittedValue = state[ key ].value
			}
			return { ...state }

		case 'REVERT_VALUE':
			return {
				...state,
				[ action.key ]: {
					...state[ action.key ],
					value: state[ action.key ].lastCommittedValue
				}
			}

		case 'REVERT_ALL':
			for ( let key in state ) {
				state[ key ].value = state[ key ].lastCommittedValue
			}
			return { ...state }

		case 'SET_ERRORS':
			for ( let key in action.errors ) {
				if ( 'string' === typeof action.errors[ key ] ) {
					state[ key ].errors = [ action.errors[ key ] ]
				} else {
					state[ key ].errors = action.errors[ key ]
				}
			}
			return { ...state }

		default:
			return state
		}
	}, { fields, defaults }, initReducer )

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

	const setValues = ( values = {}, shouldCommit = true ) => {
		dispatch( {
			type: 'SET_VALUES',
			values,
			shouldCommit,
		} )
	}

	const valueHasChanged = ( fieldState ) => {
		let value = fieldState.value
		let lastValue = fieldState.lastCommittedValue
		if ( 'number' === typeof value ) {
			value = String( value )
		}
		if ( 'object' === typeof value ) {
			value = JSON.stringify( value )
		}
		if ( 'number' === typeof lastValue ) {
			lastValue = String( lastValue )
		}
		if ( 'object' === typeof lastValue ) {
			lastValue = JSON.stringify( lastValue )
		}
		return value !== lastValue
	}

	const selectValues = () => {
		const values = {}
		for ( let key in state ) {
			values[ key ] = state[ key ].value
		}
		return values
	}

	const selectChangedValues = () => {
		const changed = {}
		for ( let key in state ) {
			if ( valueHasChanged( state[ key ] ) ) {
				changed[ key ] = state[ key ].value
			}
		}
		return changed
	}

	const setErrors = ( errors = {} ) => {
		dispatch( {
			type: 'SET_ERRORS',
			errors
		} )
	}

	const selectErrors = () => {
		const errors = {}
		for ( let key in state ) {
			if ( state[ key ].errors.length ) {
				errors[ key ] = state[ key ].errors
			}
		}
		return errors
	}

	const getFieldIDs = () => {
		const ids = {}
		for ( let key in fields ) {
			ids[ key ] = fields[ key ].id ? fields[ key ].id : key
		}
		return ids
	}

	const getFieldConfig = () => {
		const values = selectValues()
		const config = {}

		Object.entries( fields ).map( ( [ key, field ] ) => {
			config[ key ] = {
				...field,
				hasChanges: valueHasChanged( state[ key ] ),
				value: state[ key ].value,
				errors: state[ key ].errors,
				onChange: value => {
					const args = {
						key,
						value,
						values,
						setValue,
					}
					setValue( key, value )
					field.onChange( args )
					onChange( args )
				}
			}

			if ( undefined !== field.options ) {
				const options = field.options
				config[ key ] = Object.defineProperty( config[ key ], 'options', {
					get() {
						if ( 'function' === typeof options ) {
							return options( {
								key,
								values,
								setValue,
							} )
						}
						return options
					}
				} )
			}

			delete config[ key ].lastCommittedValue
			delete config[ key ].alwaysCommit
			delete config[ key ].sanitize
			delete config[ key ].validate
		} )

		return config
	}

	const values = selectValues()
	const changed = selectChangedValues()
	const fieldConfig = getFieldConfig()

	const callbackArgs = {
		ids: getFieldIDs(),
		changed,
		values,
		setValue,
		setValues,
		setErrors,
		state,
	}

	const resetForm = () => {
		dispatch( {
			type: 'REVERT_ALL'
		} )
		onReset( callbackArgs )
	}

	const submitForm = () => {
		let hasErrors = false

		Object.keys( values ).map( key => {
			const errors = []
			fields[ key ].validate( values[ key ], errors )
			if ( errors.length ) {
				setErrors( { [ key ]: errors } )
				hasErrors = true
			}
		} )

		if ( hasErrors ) {
			return
		}

		setIsSubmitting( true )
		dispatch( { type: 'COMMIT_ALL' } )

		const response = onSubmit( callbackArgs )

		if ( 'object' === typeof response ) {
			response.finally( () => {
				if ( isMounted.current ) {
					setIsSubmitting( false )
				}
			} )
		} else {
			setIsSubmitting( false )
		}
	}

	return {
		form: {
			onSubmit: e => e.preventDefault(),
			additionalClasses: classname( {
				'fl-asst-highlight-changes': shouldHighlightChanges
			} ),
			context: {
				values,
				fields: fieldConfig
			},
		},
		fields: fieldConfig,
		hasChanges: 0 < Object.keys( changed ).length,
		values,
		changed,
		resetForm,
		submitForm,
		isSubmitting,
		setValues,
		setErrors
	}
}
