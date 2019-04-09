import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getTerms, updateTerm } from 'utils/wordpress'
import { getSystemActions } from 'store'
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
	const [ terms, setTerms ] = useState( null )
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
	} = term

	useEffect( () => {
		mounted.current = true
		return () => mounted.current = false
	} )

	useEffect( () => {
		if ( isHierarchical ) {
			const request = getTerms( {
				hide_empty: 0,
				taxonomy,
			}, response => {
				setTerms( response )
			} )
			return () => request.cancel()
		}
	}, [] )

	const renderParentOptions = () => {
		if ( ! terms ) {
			return <option value={ parent }>{ __( 'Loading...' ) }</option>
		}
		return (
			<Fragment>
				<option value='0'>{ __( 'None' ) }</option>
				{ Object.entries( terms ).map( ( [ key, value ] ) => {
					if ( value.id === id ) {
						return null
					}
					return <option key={ key } value={ value.id }>{ value.title }</option>
				} ) }
			</Fragment>
		)
	}

	const trashClicked = () => {
		const message = __( 'Do you really want to delete this item?' )
		if ( confirm( message ) ) {
			updateTerm( id, 'trash' )
			decrementCount( `taxonomy/${ taxonomy }` )
			removeItem()
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
			updateItem( { description, parent, slug, title } )
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
						<select name='parent' id="fl-asst-term-parent" value={ parent } onChange={ onChange }>
							{ renderParentOptions() }
						</select>
					</Form.Item>
				}
				<Form.Item label={__( 'Description' )} labelFor="fl-asst-term-description">
					<textarea name='description' id="fl-asst-term-description" value={ description } onChange={ onChange } rows={6} />
				</Form.Item>

				<Form.Item>
					{ publishing &&
						<Button style={{ marginLeft: 'auto' }}>{ __( 'Publishing' ) } &nbsp;<Icon name='small-spinner' /></Button>
					}
					{ ! publishing &&
						<Button onClick={ publishClicked } style={{ marginLeft: 'auto' }}>{ __( 'Publish Changes' ) }</Button>
					}
				</Form.Item>
			</form>

		</ContentListDetail>
	)
}
