import React, { useReducer } from 'react'
import Notice from '../notice'

const defaultNotice = {
	id: null,
	isDismissible: true,
	content: '',
	spokenMessage: null,
	status: 'info',
	actions: [],
}

const reducer = ( state = [], action ) => {
	switch ( action.type ) {
	case 'CREATE_NOTICE':
		const item = {
			...action.config,
			id: action.config.id ? action.config.id : Date.now()
		}
		return [ ...state, item ]
	case 'REMOVE_NOTICE':
		return state.filter( notice => notice.id !== action.id )
	default:
		return state
	}
}

const useNotices = ( initial = [] ) => {
	const [ state, dispatch ] = useReducer( reducer, initial )

	const createNotice = ( args = {} ) => dispatch( {
		type: 'CREATE_NOTICE',
		config: {
			...defaultNotice,
			...args
		}
	} )

	const removeNotice = id => dispatch( {
		type: 'REMOVE_NOTICE',
		id,
	} )

	const renderNotices = () => {
		return state.map( ( notice, i ) => {

			if ( i !== state.length - 1 ) {
				return null
			}

			const { id, content, ...rest } = notice
			return (
				<Notice
					key={ i }
					{ ...rest }
					onRemove={ () => removeNotice( id ) }
				>{content}</Notice>
			)
		} )
	}

	return {
		renderNotices,
		notices: state,
		createNotice,
		removeNotice,
	}
}

export default useNotices
