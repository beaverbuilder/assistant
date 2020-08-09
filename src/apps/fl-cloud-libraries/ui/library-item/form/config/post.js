import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'
import { createSlug } from 'assistant/utils/url'
import { getWpRest } from 'assistant/utils/wordpress'
import ItemContext from '../../context'

export const getSections = ( item, sections ) => {
	sections.general.fields.thumb = {
		label: __( 'Featured Image' ),
		component: 'file',
	}
	return {
		...sections,
		info: {
			label: __( 'Info' ),
			fields: {
				postType: {
					label: __( 'Type' ),
					labelPlacement: 'beside',
					component: 'plain-text',
				},
			},
		}
	}
}

export const getActions = ( item ) => {
	const { createNotice } = ItemContext.use()
	const [ importing, setImporting ] = useState( false )
	const [ previewing, setPreviewing ] = useState( false )
	const history = useHistory()
	const postsApi = getWpRest().posts()

	const importPost = () => {
		setImporting( true )
		postsApi.importFromLibrary( item.id ).then( response => {
			setImporting( false )
			if ( response.data.error ) {
				createNotice( {
					status: 'error',
					content: __( 'Error importing content.' )
				} )
			} else {
				createNotice( {
					status: 'success',
					content: (
						<>
							{ __( 'Content imported!' ) }
							<a
								style={ {
									textDecoration: 'underline',
									marginLeft: 'var(--fluid-sm-space)'
								} }
								onClick={ () => {
									history.push( `/fl-content/post/${ response.data.id }`, {
										item: response.data
									} )
								} }
							>
								{ __( 'View content.' ) }
							</a>
						</>
					)
				} )
			}
		} )
	}

	const previewPost = () => {
		setPreviewing( true )
		postsApi.previewLibraryPost( item.id ).then( response => {
			setPreviewing( false )
			window.open( response.data.url )
		} )
	}

	return [
		{
			label: __( 'Import' ),
			onClick: importPost,
			disabled: importing,
		},
		{
			label: __( 'Preview' ),
			onClick: previewPost,
			disabled: previewing,
		}
	]
}

export const getDefaults = ( { data, media }, defaults ) => {
	const { post } = data
	const { contentTypes } = getSystemConfig()
	let postType = post.post_type
	let thumb = null

	if ( contentTypes[ postType ] ) {
		postType = contentTypes[ postType ].labels.singular
	}

	if ( media.thumb ) {
		thumb = media.thumb.sizes.thumb.url
	}

	return {
		...defaults,
		postType,
		thumb
	}
}

export const getData = ( item, values, data ) => {
	const { thumb } = values
	if ( thumb && thumb instanceof File ) {
		data.append( 'media[thumb]', thumb )
	} else if ( ! thumb ) {
		data.append( 'media[thumb]', null )
	}
	item.data.post.post_title = values.name
	item.data.post.post_name = createSlug( values.name )
	data.append( 'data', JSON.stringify( item.data ) )
	return data
}
