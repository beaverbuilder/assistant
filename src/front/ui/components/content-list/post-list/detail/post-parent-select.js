import React, { Fragment, useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getHierarchicalPosts } from 'utils/wordpress'

export const PostParentSelect = ( { type, name, id, value, onChange } ) => {
	const [ posts, setPosts ] = useState( null )

	useEffect( () => {
		const request = getHierarchicalPosts( {
			hide_empty: 0,
			post_type: type,
		}, response => {
			setPosts( response )
		} )
		return () => request.cancel()
	}, [] )

	const renderPosts = ( posts, depth = 0 ) => {
		const prefix = depth ? '-'.repeat( depth ) + ' ' : ''
		return posts.map( ( post, i ) => {
			return (
				<Fragment key={ `${ depth }-${ i }-fragment` }>
					<option key={ `${ depth }-${ i }` } value={ post.id }>{ prefix + post.title }</option>
					{ renderPosts( post.children, depth + 1 ) }
				</Fragment>
			)
		} )
	}

	return (
		<select name={ name } id={ id } value={ value } onChange={ onChange }>
			{ ! posts &&
				<option value={ value }>{ __( 'Loading...' ) }</option>
			}
			{ posts &&
				<Fragment>
					<option value='0'>{ __( 'None' ) }</option>
					{ renderPosts( posts )  }
				</Fragment>
			}
		</select>
	)
}
