import React, { useContext, useEffect, useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { updateTerm } from 'shared-utils/wordpress'
import { getSystemActions } from 'store'
import { TermParentSelect } from './term-parent-select'
import {
	Button,
	CopyButton,
	ContentListDetail,
	Icon,
	TagGroup,
	Tag,
	UIContext,
	StackContext,
	ViewContext,
	Form,
} from 'components'

export const TermListDetail = () => {
	const mounted = useRef( false )
	const { decrementCount } = getSystemActions()
	const { presentNotification } = useContext( UIContext )
	const { dismiss } = useContext( StackContext )
	const viewContext = useContext( ViewContext )
	const [ term, setTerm ] = useState( viewContext )
	const [ publishing, setPublishing ] = useState( false )
	const {
		description,
		editUrl,
		id,
		isHierarchical,
		parent,
		slug,
		taxonomy,
		title,
		url,
		removeItem,
		updateItem,
		refreshList,
	} = term

	useEffect( () => {
		mounted.current = true
		return () => mounted.current = false
	} )

	const trashClicked = () => {
		const message = __( 'Do you really want to delete this item?' )
		if ( confirm( message ) ) {
			updateTerm( id, 'trash' )
			decrementCount( `taxonomy/${ taxonomy }` )
			removeItem ? removeItem() : refreshList()
			dismiss()
		}
	}

	const publishClicked = () => {
		setPublishing( true )

		updateTerm( id, 'data', {
			name: title,
			description,
			parent,
			slug,
		}, () => {
			const newItem = { description, parent, slug, title }
			updateItem ? updateItem( newItem ) : refreshList()
			presentNotification( 'Changes published!' )
			if ( mounted.current ) {
				setPublishing( false )
			}
		}, () => {
			presentNotification( 'Error! Changes not published.', { appearance: 'error' } )
			if ( mounted.current ) {
				setPublishing( false )
			}
		} )
	}

	const onChange = e => {
		const { name, value } = e.target
		setTerm( { ...term, [ name ]: value } )
	}

	return (
		<ContentListDetail>
			<form>
				<Form.Item>
					<TagGroup appearance='muted' className='fl-asst-post-actions'>
						<Tag href={ url }>{__( 'View' )}</Tag>
						<Tag href={ editUrl }>{__( 'Edit' )}</Tag>
						<Tag onClick={ trashClicked } appearance='warning'>{__( 'Delete' )}</Tag>
					</TagGroup>
				</Form.Item>

				<Form.Item label={__( 'Name' )} labelFor="fl-asst-term-title">
					<input
						type='text'
						name='title'
						id='fl-asst-term-title'
						value={ title }
						onChange={ onChange }
					/>
				</Form.Item>

				<Form.Item label={__( 'Slug' )} labelFor="fl-asst-term-slug">
					<input type='text' name='slug' id='fl-asst-term-slug' value={ slug } onChange={ onChange } />
					<CopyButton label='Copy URL' text={ url } />
				</Form.Item>

				{ isHierarchical &&
					<Form.Item label={__( 'Parent' )} labelFor="fl-asst-term-parent">
						<TermParentSelect
							taxonomy={ taxonomy }
							exclude={ id }
							name='parent'
							id='fl-asst-term-parent'
							value={ parent }
							onChange={ onChange }
						/>
					</Form.Item>
				}

				<Form.Item label={__( 'Description' )} labelFor="fl-asst-term-description">
					<textarea name='description' id="fl-asst-term-description" value={ description } onChange={ onChange } rows={6} />
				</Form.Item>

				<Form.Footer>
					{ publishing &&
						<Button>{ __( 'Publishing' ) } &nbsp;<Icon name='small-spinner' /></Button>
					}
					{ ! publishing &&
						<Button onClick={ publishClicked }>{ __( 'Publish Changes' ) }</Button>
					}
				</Form.Footer>
			</form>

		</ContentListDetail>
	)
}
