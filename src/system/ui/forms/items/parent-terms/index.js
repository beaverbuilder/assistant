import React, { useEffect, useState } from 'react'
import { isCancel, CancelToken } from 'axios'
import { getWpRest } from 'utils/wordpress'
import './style.scss'

export const ParentTermItems = ( {
	id,
	value,
	termId,
	taxonomy,
	onChange = () => { },
	...rest
} ) => {

	const [ data, setData ] = useState( {
		terms: [],
		idsBySlug: {},
		slugsById: {}
	} )

	const wpRest = getWpRest()
	const source = CancelToken.source()

	useEffect( () => {
		wpRest.terms().getParentTerms( {
			taxonomy,
			hide_empty: 0,
			orderby: 'id',
			order: 'ASC',
			current: termId
		}, {
			cancelToken: source.token,
		} ).then( response => {
			data.terms = response.data
			flattenResponseData( response.data, data )
			setData( { ...data } )
		} ).catch( ( error ) => {
			if ( ! isCancel( error ) ) {
				console.log( error ) // eslint-disable-line no-console
			}
		} )
		return () => source.cancel()
	}, [] )

	const flattenResponseData = ( data, flattened ) => {
		data.map( term => {
			flattened.slugsById[term.id] = term.slug
			flattened.idsBySlug[term.slug] = term.id
			if ( term.children.length ) {
				flattened = flattenResponseData( term.children, flattened )
			}
		} )
		return flattened
	}

	const setParentChildOptions = ( options, children, depth = 1 ) => {
	children.map( child => {
			if ( child.id !== termId ) {
				options[' ' + child.id] = '-' + child.title
				setParentChildOptions( options, child.children, depth + 1 )
			}
		} )
	}

	const getHierarchicalOptions = ( terms = data.terms, options = [], depth = 0 ) => {

		options['0'] = depth ? '-'.repeat( depth ) + ' ' + 'None' : 'None'
		terms.map( term => {

			if ( term.id !== termId ) {
				options[' ' + term.id] = term.title

				if ( 0 < term.children.length ) {
					setParentChildOptions( options, term.children )
				}

			}
		} )


		return (
			<select
				id={ id }
				value={ value }
				onChange={ e => {
					onChange( e.target.value, e )
				} }
				{ ...rest }
			>

				{Object.entries( options ).map( ( [ value, label ] ) => (
					<option value={ value.replace( ' ', '' ) }>{label}</option>
				) )}
			</select>
		)

	}
	return getHierarchicalOptions()
}
