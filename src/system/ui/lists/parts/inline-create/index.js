import React, { useState, useReducer, useEffect } from 'react'
import { Layout, Form, Icon, Button } from 'ui'
import { getSystemConfig } from 'data'
import { getWpRest } from 'utils/wordpress'
import { __, sprintf } from '@wordpress/i18n'
import { ENTER } from '@wordpress/keycodes'
import { useHistory } from 'react-router-dom'
import './style.scss'

const InlineCreate = ( {
	postType = 'post',
	codeType = null,
	onPostCreated = () => {},
	onError = () => {},
} ) => {
	const { contentTypes } = getSystemConfig()
	const wpRest = getWpRest()
	const history = useHistory()
	const [ items, dispatch ] = useReducer( ( state = [], action ) => {

		switch ( action.type ) {
		case 'CREATE_ITEM':
			return [ ...state, {
				title: action.title,
			} ]
		default:
			return state
		}
	}, [] )

	const onCreate = value => {
		dispatch( {
			type: 'CREATE_ITEM',
			title: value,
		} )

		const post = {
			post_title: value,
			post_type: postType,
		}

		if( 'fl_code' === postType ) {
			post.meta_input = {
				_fl_asst_code_type: codeType,
			}
			post.post_status = 'publish'
		}

		const handleError = error => {
			onError( error )
			console.error( error ) // eslint-disable-line no-console
		}

		return wpRest.posts().create( post ).then( response => {
			const { data } = response
			if ( data.error ) {
				handleError( data.error )
			}
			onPostCreated( data )

			if( 'fl_code' === postType ) {
				history.push( `/fl-code/fl_code/${data.id}`, { 'item': data } )
			}
		} ).catch( error => {
			handleError( error )
		} )
	}

	const typeLabel = 'fl_code' === postType ? codeType : contentTypes[postType].labels.singular

	return (
		<>
			<CreateItem
				typeLabel={ typeLabel }
				onCreate={ onCreate }
				type={ postType }
			/>
			{ items.map( ( item, i ) => {
				const { title } = item
				return (
					<Layout.Box key={ i } className="fl-asst-inline-item fl-asst-list-item-content-info" padX={ false } padY={ false }>
						<Layout.Row className="fl-asst-list-item-default-content-row" gap="var(--fluid-med-space)">
							<div className="fl-asst-list-item-thumbnail fl-asst-thumbnail-size-med" />
							<div className="fl-asst-list-item-subject">
								<div className="fl-asst-list-item-title">{title}</div>
								<div className="fl-asst-list-item-description">{__( 'Creating...' )}</div></div>
						</Layout.Row>
					</Layout.Box>
				)
			} )}
		</>
	)
}

const CreateItem = ( { onCreate = () => {}, typeLabel, type } ) => {
	const [ val, setVal ] = useState( '' )

	useEffect( () => {
		document.getElementById( 'fl-asst-inline-create-item' ).focus()
	}, [] )

	const keyPress = e => {
		if ( e.which === ENTER ) {
			if ( ! val ) {
				return
			}

			onCreate( val )
			setVal( '' )
			e.target.value = ''
		}
	}
	const onClick = () => {
		if ( ! val ) {
			return
		}
		onCreate( val )
		setVal( '' )
	}

	return (
		<Layout.Box className="fl-asst-inline-item fl-asst-list-inline-create-item fl-asst-list-item-content-info" padX={ false } padY={ false }>
			<Layout.Row className="fl-asst-list-item-default-content-row" gap="var(--fluid-med-space)">
				<div className="fl-asst-list-item-thumbnail fl-asst-thumbnail-size-med">
					<Icon.Plus />
				</div>
				<div className="fl-asst-list-item-subject">
					<Form.Input
						id="fl-asst-inline-create-item"
						appearance="transparent"
						placeholder={ 'fl_code' === type ? sprintf( 'Create New %s File', typeLabel ) : sprintf( 'Create New %s', typeLabel ) }
						onKeyPress={ keyPress }
						onInput={ e => setVal( e.target.value ) }
						after={
							val &&
							<Button
								status="primary"
								onClick={ onClick }
							>
								<Icon.Return />
							</Button>
						}
					/>
				</div>
			</Layout.Row>
		</Layout.Box>
	)
}

export default InlineCreate
