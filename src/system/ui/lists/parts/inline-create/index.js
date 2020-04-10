import React, { useState, useReducer, useEffect } from 'react'
import { Layout, Form, Icon, Button } from 'ui'
import { getSystemConfig } from 'data'
import { getWpRest } from 'utils/wordpress'
import { sprintf } from '@wordpress/i18n'
import { ENTER } from '@wordpress/keycodes'
import './style.scss'

const InlineCreate = ( {
	postType = 'post',
	onPostCreated = () => {},
} ) => {
	const { contentTypes } = getSystemConfig()
	const wpRest = getWpRest()
	const [ items, dispatch ] = useReducer( ( state = [], action ) => {

		switch ( action.type ) {
		case 'CREATE_ITEM':
			return [ ...state, {
				title: action.title,
				status: 'pending',
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

		const handleError = error => {

			// Should do something meaninful here
			console.error( error ) // eslint-disable-line no-console
		}

		return wpRest.posts().create( post ).then( response => {
			const { data } = response
			if ( data.error ) {
				handleError()
			}
			onPostCreated( data )

		} ).catch( error => {
			handleError( error )
		} )
	}

	return (
		<>
			<CreateItem
				typeLabel={ contentTypes[postType].labels.singular }
				onCreate={ onCreate }
			/>
			{ items.map( ( item, i ) => {
				const { title, status } = item
				return (
					<Layout.Box key={ i } className="fl-asst-inline-item">
						<Layout.Row className="fl-asst-list-item-default-content-row" gap="var(--fluid-med-space)">
							<div className="fl-asst-list-item-thumbnail fl-asst-thumbnail-size-med" />
							<div className="fl-asst-list-item-subject">
								<div className="fl-asst-list-item-title">{title}</div>
								<div className="fl-asst-list-item-description">{status}</div></div>
						</Layout.Row>
					</Layout.Box>
				)
			} )}
		</>
	)
}

const CreateItem = ( { onCreate = () => {}, typeLabel } ) => {
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
		<Layout.Box className="fl-asst-inline-item fl-asst-inline-create-item">
			<Layout.Row className="fl-asst-list-item-default-content-row" gap="var(--fluid-med-space)">
				<div className="fl-asst-list-item-thumbnail fl-asst-thumbnail-size-med">
					<Icon.Plus />
				</div>
				<div className="fl-asst-list-item-subject">
					<Form.Input
						id="fl-asst-inline-create-item"
						appearance="transparent"
						placeholder={ sprintf( 'Create New %s', typeLabel ) }
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
