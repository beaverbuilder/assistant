import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'
import ItemContext from '../context'

export const getSections = ( sections ) => {
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

export const getActions = () => {
	const { item, createNotice } = ItemContext.use()
	const [ importing, setImporting ] = useState( false )
	const history = useHistory()

	const importPost = () => {
		setImporting( true )
		getWpRest()
			.posts()
			.importFromLibrary( item.id )
			.then( response => {
				setImporting( false )
				if ( response.data.error ) {
					createNotice( {
						id: 'import-error',
						status: 'error',
						content: __( 'Error importing content.' )
					} )
				} else {
					createNotice( {
						id: 'import-success',
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

	return [
		{
			label: __( 'Import' ),
			onClick: importPost,
			disabled: importing
		}
	]
}

export const getDefaults = ( defaults ) => {
	const { item } = ItemContext.use()
	const { post } = item.data
	const { contentTypes } = getSystemConfig()
	let postType = post.post_type

	if ( contentTypes[ postType ] ) {
		postType = contentTypes[ postType ].labels.singular
	}

	return {
		...defaults,
		postType
	}
}

export const getData = ( values, data ) => {
	return data
}
