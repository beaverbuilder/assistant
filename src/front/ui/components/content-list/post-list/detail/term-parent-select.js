import React, { Fragment, useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getHierarchicalTerms } from 'utils/wordpress'

export const TermParentSelect = ( { taxonomy, name, id, value, onChange } ) => {
	const [ terms, setTerms ] = useState( null )

	useEffect( () => {
		const request = getHierarchicalTerms( {
			hide_empty: 0,
			taxonomy,
		}, response => {
			setTerms( response )
		} )
		return () => request.cancel()
	}, [] )

	const renderTerms = ( terms, depth = 0 ) => {
		const prefix = depth ? '-'.repeat( depth ) + ' ' : ''
		return terms.map( ( term, i ) => {
			return (
				<Fragment key={ `${ depth }-${ i }-fragment` }>
					<option key={ `${ depth }-${ i }` } value={ term.id }>{ prefix + term.title }</option>
					{ renderTerms( term.children, depth + 1 ) }
				</Fragment>
			)
		} )
	}

	return (
		<select name={ name } id={ id } value={ value } onChange={ onChange }>
			{ ! terms &&
				<option value={ parent }>{ __( 'Loading...' ) }</option>
			}
			{ terms &&
				<Fragment>
					<option value='0'>{ __( 'None' ) }</option>
					{ renderTerms( terms )  }
				</Fragment>
			}
		</select>
	)
}
