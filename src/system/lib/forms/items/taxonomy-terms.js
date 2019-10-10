import React, { useEffect, useState } from 'fl-react'
import { getWpRest } from 'shared-utils/wordpress'
import { createSlug } from 'shared-utils/url'
import { getSystemConfig } from 'store'
import { Form, Control } from 'lib'

export const TaxonomyTermsItem = ( {
	taxonomy,
	value,
	onChange,
} ) => {
	const [ data, setData ] = useState( { terms: [], idsBySlug: {}, slugsById: {} } )
	const { taxonomies } = getSystemConfig()
	const wpRest = getWpRest()

	useEffect( () => {
		wpRest.terms().hierarchical( {
			taxonomy,
			hide_empty: 0,
			orderby: 'name',
			order: 'ASC',
		} ).then( response => {
			data.terms = response.data
			flattenResponseData( response.data, data )
			setData( { ...data } )
		} )
	}, [] )

	const flattenResponseData = ( data, flattened ) => {
		data.map( term => {
			flattened.slugsById[ term.id ] = term.slug
			flattened.idsBySlug[ term.slug ] = term.id
			if ( term.children.length ) {
				flattened = flattenResponseData( term.children, flattened )
			}
		} )
		return flattened
	}

	const getHierarchicalOptions = ( terms, options = [], depth = 0 ) => {
		terms.map( term => {
			options[ term.slug ] = depth ? '-'.repeat( depth ) + ' ' + term.title : term.title
			if ( term.children.length ) {
				options = getHierarchicalOptions( term.children, options, depth + 1 )
			}
		} )
		return options
	}

	const tax = taxonomies[ taxonomy ]
	const options = getHierarchicalOptions( data.terms )
	const values = value.map( id => data.slugsById[ id ] )

	if ( tax.isHierarchical ) {
		return (
			<Form.SelectItem
				label={ tax.labels.plural }
				selectMultiple={ true }
				options={ options }
				value={ values }
				onChange={ slugs => {
					onChange( slugs.map( slug => data.idsBySlug[ slug ] ) )
				} }
			/>
		)
	}

	return (
		<Form.Item
			label={ tax.labels.plural }
			labelForm={ `taxonomy-${ taxonomy }` }
		>
			<Control.TagGroup
				options={ options }
				value={ values }
				onRemove={ ( v, i ) => {
					value.splice( i, 1 )
					onChange( value )
				} }
				onAdd={ title => {
					const slug = createSlug( title )
					const key = data.terms.length

					if ( slug in data.idsBySlug ) {
						const id = data.idsBySlug[ slug ]
						if ( ! value.includes( id ) ) {
							value.push( id )
							onChange( value )
						}
						return
					}

					data.terms.push( { title, slug, id: slug, children: [] } )
					data.idsBySlug[ slug ] = slug
					data.slugsById[ slug ] = slug
					value.push( slug )
					onChange( value )

					wpRest.terms().create( {
						taxonomy,
						slug,
						name: title,
						parent: '0',
						description: '',
					} ).then( response => {
						data.terms[ key ] = response.data
						data.idsBySlug[ slug ] = response.data.id
						data.slugsById[ response.data.id ] = slug
						delete data.slugsById[ slug ]
						if ( value.includes( slug ) ) {
							value.splice( value.indexOf( slug ), 1, response.data.id )
							onChange( value )
						}
					} )
				} }
			/>
		</Form.Item>
	)
}
