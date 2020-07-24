import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Text } from 'fluid'
import { Icon, Layout } from 'assistant/ui'
import { getWpRest } from 'assistant/utils/wordpress'
import cloud from 'assistant/cloud'

export default ( { results } ) => {

	if ( ! results ) {
		return null
	}

	return results.map( ( result, key ) => {
		const { label, items } = result
		return (
			<Layout.Box
				key={ key }
				className='fl-asst-library-add-post-results'
			>
				<Text.Title>
					{ label }
				</Text.Title>
				<ul>
					{ items.map( ( item, key ) =>
						<li key={ key }>
							<div>
								{ item.title }
							</div>
							<AddPostLink post={ item } />
						</li>
					) }
				</ul>
			</Layout.Box>
		)
	} )
}

const AddPostLink = ( { post } ) => {
	const { id } = useParams()
	const [ adding, setAdding ] = useState( false )
	const [ added, setAdded ] = useState( false )

	const addPost = ( post ) => {
		const api = getWpRest().posts()
		setAdding( true )
		api.saveToLibrary( post.id, id ).then( response => {
			setAdded( true )
		} ).finally( () => {
			setAdding( false )
		} )
	}

	return (
		<>
			{ adding &&
				<a><Icon.Loading /></a>
			}
			{ added &&
				<a>{ __( 'Added!' ) }</a>
			}
			{ ! adding && ! added &&
				<a onClick={ () => addPost( post ) }>{ __( 'Add' ) }</a>
			}
		</>
	)
}
