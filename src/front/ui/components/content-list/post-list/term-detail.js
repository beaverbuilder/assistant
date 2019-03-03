import React, { Fragment, useContext, useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getTerms, updateTerm } from 'utils/wordpress'
import { getSystemActions } from 'store'
import {
	Button,
	CopyButton,
	ContentListDetail,
	ScreenHeader,
	SettingsItem,
	SettingsGroup,
	TagGroup,
	Tag,
	StackContext,
	ViewContext,
} from 'components'
import './style.scss'

export const TermListDetail = () => {
	const { decrementCount } = getSystemActions()
	const { popView } = useContext( StackContext )
	const viewContext = useContext( ViewContext )
	const [ term, setTerm ] = useState( viewContext )
	const [ terms, setTerms ] = useState( null )
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
	} = term

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
			popView()
		}
	}

	const onChange = e => {
		const { name, value } = e.target
		setTerm( { ...term, [ name ]: value } )
	}

	return (
		<ContentListDetail>

			<ScreenHeader title={ title }>
				<TagGroup appearance='muted' className='fl-asst-post-actions'>
					<Tag href={ url }>View</Tag>
					<Tag href={ editUrl }>Edit</Tag>
					<Tag onClick={ trashClicked } appearance='warning'>Delete</Tag>
				</TagGroup>
			</ScreenHeader>

			<SettingsGroup>
				<SettingsItem label='Name' labelPosition='above'>
					<input type='text' name='title' value={ title } onChange={ onChange } />
				</SettingsItem>
				<SettingsItem label='Slug' labelPosition='above'>
					<input type='text' name='slug' value={ slug } onChange={ onChange } />
					<CopyButton label='Copy URL' text={ url } />
				</SettingsItem>
				{ isHierarchical &&
					<SettingsItem label='Parent' labelPosition='above'>
						<select name='parent' value={ parent } onChange={ onChange }>
							{ renderParentOptions() }
						</select>
					</SettingsItem>
				}
				<SettingsItem label='Description' labelPosition='above'>
					<textarea name='description' value={ description } onChange={ onChange } />
				</SettingsItem>
				<SettingsItem>
					<Button>Publish Changes</Button>
				</SettingsItem>
			</SettingsGroup>

		</ContentListDetail>
	)
}
