import React, { useEffect, useState } from 'fl-react'
import { __, sprintf } from '@wordpress/i18n'
import { getWpRest } from 'shared-utils/wordpress'
import { createSlug } from 'shared-utils/url'
import { getSystemConfig } from 'store'
import { Button, Form } from 'lib'

export const TaxonomyTermsItem = ( {
	taxonomy,
	value,
	onChange,
} ) => {
	const [ data, setData ] = useState( {
		terms: [],
		idsBySlug: {},
		slugsById: {}
	} )
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

	const getHierarchicalOptions = ( terms = data.terms, options = [], depth = 0 ) => {
		terms.map( term => {
			options[ term.slug ] = depth ? '-'.repeat( depth ) + ' ' + term.title : term.title
			if ( term.children.length ) {
				options = getHierarchicalOptions( term.children, options, depth + 1 )
			}
		} )
		return options
	}

	const addNewTerm = ( title = '', parent = '' ) => {
		if ( ! title ) {
			return
		}

		let slug = createSlug( title )
		let usingTempSlug = false

		if ( ! slug ) {
			slug = new Date().getTime()
			usingTempSlug = true
		}

		if ( slug in data.idsBySlug ) {
			const id = data.idsBySlug[ slug ]
			if ( ! value.includes( id ) ) {
				value.push( id )
				onChange( value )
			}
			return
		}

		const key = data.terms.length
		data.terms.push( { title, slug, id: slug, children: [] } )
		data.idsBySlug[ slug ] = slug
		data.slugsById[ slug ] = slug
		value.push( slug )
		onChange( value )

		wpRest.terms().create( {
			taxonomy,
			name: title,
			slug: usingTempSlug ? '' : slug,
			parent: parent ? data.idsBySlug[ parent ] : '0',
			description: '',
		} ).then( response => {
			delete data.idsBySlug[ slug ]
			delete data.slugsById[ slug ]
			data.terms[ key ] = response.data
			data.idsBySlug[ response.data.slug ] = response.data.id
			data.slugsById[ response.data.id ] = response.data.slug
			if ( value.includes( slug ) ) {
				value.splice( value.indexOf( slug ), 1, response.data.id )
				onChange( value )
			}
		} )
	}

	const tax = taxonomies[ taxonomy ]
	const options = getHierarchicalOptions()
	const values = value.map( id => data.slugsById[ id ] )
	const [ addingNew, setAddingNew ] = useState( false )
	const [ newTerm, setNewTerm ] = useState( '' )
	const [ newTermParent, setNewTermParent ] = useState( '' )

	if ( tax.isHierarchical ) {
		return (
			<>
				<Form.SelectItem
					label={ tax.labels.plural }
					selectMultiple={ true }
					options={ options }
					value={ values }
					onChange={ slugs => {
						onChange( slugs.map( slug => data.idsBySlug[ slug ] ) )
					} }
				/>
				{ addingNew &&
					<>
						<Form.TextItem
							label={ sprintf( __( 'New %s Name' ), tax.labels.singular ) }
							value={ newTerm }
							onChange={ name => setNewTerm( name ) }
						/>
						<Form.SelectItem
							label={ sprintf( __( 'New %s Parent' ), tax.labels.singular ) }
							options={ {
								'': __( 'None' ),
								...getHierarchicalOptions(),
							} }
							value={ newTermParent }
							onChange={ v => setNewTermParent( v ) }
						/>
						<Button
							onClick={ () => {
								setAddingNew( false )
								addNewTerm( newTerm, newTermParent )
							} }
						>
							{ tax.labels.addNewItem }
						</Button>
					</>
				}
				{ ! addingNew &&
					<Button
						onClick={ () => {
							setNewTerm( '' )
							setNewTermParent( '' )
							setAddingNew( true )
						} }
					>
						{ tax.labels.newItem }
					</Button>
				}
			</>
		)
	}

	return (
		<Form.SuggestItem
			label={ tax.labels.plural }
			placeholder={ tax.labels.newItem }
			id={ `taxonomy-${ taxonomy }` }
			options={ options }
			value={ values }
			onRemove={ ( v ) => {
				const i = values.indexOf( v )
				value.splice( i, 1 )
				onChange( value )
			} }
			onAdd={ title => addNewTerm( title ) }
		/>
	)
}
