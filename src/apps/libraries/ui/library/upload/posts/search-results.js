import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Icon, Layout, Text } from 'assistant/ui'

export default ( { results } ) => {

	if ( ! results ) {
		return null
	}

	if ( results && ! results.length ) {
		return (
			<Layout.Box padY={ false } style={ { textAlign: 'center' } }>
				{ __( 'No results found' ) }
			</Layout.Box>
		)
	}

	return results.map( ( result, key ) => {
		const { label, items } = result
		return (
			<Layout.Box
				key={ key }
				className='fl-asst-library-add-post-results'
				padX={ false }
				padY={ false }
			>
				<Text.Title>
					{ label }
				</Text.Title>
				<ul>
					{ items.map( ( item, key ) =>
						<PostItem key={ key } post={ item } />
					) }
				</ul>
			</Layout.Box>
		)
	} )
}

const PostItem = ( { post } ) => {
	const { uploader } = Libraries.LibraryContext.use()
	const [ adding, setAdding ] = useState( false )

	const addPost = () => {
		setAdding( true )
		uploader.addFile( {
			id: post.id,
			name: post.title,
			type: 'post',
			tempUrl: post.thumbnail,
			thumbnail: post.thumbnail,
			url: post.url,
			onComplete: () => setAdding( false )
		} )
	}

	return (
		<li onClick={ addPost }>
			<div>
				{ post.title }
			</div>
			{ adding &&
				<a><Icon.Loading /></a>
			}
			{ ! adding &&
				<a>{ __( 'Add' ) }</a>
			}
		</li>
	)
}
