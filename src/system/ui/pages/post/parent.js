import { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'utils/wordpress'

export const useParentOptions = ( type ) => {
	const wpRest = getWpRest()
	const [ options, setOptions ] = useState( {} )

	useEffect( () => {
		setOptions( {} )
		wpRest.posts().hierarchical( {
			hide_empty: 0,
			post_type: type,
			posts_per_page: -1,
		} ).then( response => {
			if ( undefined !== response.data && Array.isArray( response.data ) ) {
				const options = {}
				response.data.map( post => {
					options[ 'parent:' + post.id ] = post.title
					setParentChildOptions( options, post.children )
				} )
				setOptions( {
					0: __( 'None' ),
					...options
				} )
			}
		} )
	}, [ type ] )

	return options
}

const setParentChildOptions = ( options, children, depth = 1 ) => {
	const prefix = '-'.repeat( depth ) + ' '
	children.map( child => {
		options[ 'parent:' + child.id ] = prefix + child.title
		setParentChildOptions( options, child.children, depth + 1 )
	} )
}
