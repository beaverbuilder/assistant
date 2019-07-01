import React, { Fragment, useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getHierarchicalTerms } from 'shared-utils/wordpress'

export const TermParentSelect = props => {
	const { taxonomy, exclude = 0, name, id, value, onChange } = props
	const [ terms, setTerms ] = useState( null )

	useEffect( () => {
		const request = getHierarchicalTerms( {
			hide_empty: 0,
			exclude,
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
				<option value={ value }>{ __( 'Loading...' ) }</option>
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
