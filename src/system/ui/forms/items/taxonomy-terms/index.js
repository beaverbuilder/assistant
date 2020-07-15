import React, { useEffect, useState } from 'react'
import { CancelToken, isCancel } from 'axios'
import { __, sprintf } from '@wordpress/i18n'
import { getWpRest } from 'utils/wordpress'
import { createSlug } from 'utils/url'
import { getSystemConfig } from 'data'
import { Button, Form } from 'ui'
import { CheckboxControl } from '@wordpress/components'
import './style.scss'

export const TaxonomyTermsItem = ( { taxonomy, value, onChange } ) => {
	const [ data, setData ] = useState( {
		terms: [],
		idsBySlug: {},
		slugsById: {}
	} )
	const { taxonomies } = getSystemConfig()
	const wpRest = getWpRest()
	const source = CancelToken.source()
	useEffect( () => {
		wpRest
			.terms()
			.hierarchical(
				{
					taxonomy,
					hide_empty: 0,
					orderby: 'name',
					order: 'ASC'
				},
				{
					cancelToken: source.token
				}
			)
			.then( response => {
				data.terms = response.data
				flattenResponseData( response.data, data )
				setData( { ...data } )
			} )
			.catch( error => {
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

	const getHierarchicalOptions = (
		terms = data.terms,
		options = [],
		depth = 0
	) => {
		terms.map( term => {
			options[term.slug] = depth ?
				'-'.repeat( depth ) + ' ' + term.title :
				term.title
			if ( term.children.length ) {
				options = getHierarchicalOptions( term.children, options, depth + 1 )
			}
		} )
		return options
	}

	const getHierarchicalChekboxOptions = ( terms = data.terms, options = [] ) => {
		terms.map( term => {
			if ( 0 == term.parent && 'post_tag' !== term.taxonomy ) {
				options[term.slug] = term
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
			const id = data.idsBySlug[slug]
			if ( ! value.includes( id ) ) {
				value.push( id )
				onChange( value )
			}
			return
		}

		const key = data.terms.length
		data.terms.push( { title, slug, id: slug, children: [] } )
		data.idsBySlug[slug] = slug
		data.slugsById[slug] = slug
		value.push( slug )
		onChange( value )

		wpRest
			.terms()
			.create( {
				taxonomy,
				name: title,
				slug: usingTempSlug ? '' : slug,
				parent: parent ? data.idsBySlug[parent] : '0',
				description: ''
			} )
			.then( response => {
				delete data.idsBySlug[slug]
				delete data.slugsById[slug]
				data.terms[key] = response.data
				data.idsBySlug[response.data.slug] = response.data.id
				data.slugsById[response.data.id] = response.data.slug
				if ( value.includes( slug ) ) {
					value.splice( value.indexOf( slug ), 1, response.data.id )
					onChange( value )
				}
			} )
	}

	const tax = taxonomies[taxonomy]
	const options = getHierarchicalOptions()
	const checkboxTerms = getHierarchicalChekboxOptions()

	const values = value.map( id => data.slugsById[id] )
	const [ addingNew, setAddingNew ] = useState( false )
	const [ newTerm, setNewTerm ] = useState( '' )
	const [ newTermParent, setNewTermParent ] = useState( '' )
	const checkedItems = []

	value.map( id => checkedItems.push( id ) )

	const handleChange = ( e, id ) => {
		if ( true === e ) {
			checkedItems.push( id )
			const uniqueNames = checkedItems.filter( ( val, id, array ) => {
				return array.indexOf( val ) == id
			} )
			onChange( uniqueNames )
		} else {
			const uniqueNames = checkedItems.filter( ( val, id, array ) => {
				return array.indexOf( val ) == id
			} )

			let index = uniqueNames.indexOf( id )
			uniqueNames.splice( index, 1 )

			onChange( uniqueNames )
		}
	}

	const renderTerms = renderedTerms => {
		return Object.keys( renderedTerms ).map( function( key ) {
			return (
				<div
					key={ renderedTerms[key].id }
					className='editor-post-taxonomies__hierarchical-terms-choice'
				>
					<CheckboxControl
						label={ renderedTerms[key].title }
						checked={ checkedItems.includes( renderedTerms[key].id ) }
						onChange={ e => {
							handleChange( e, renderedTerms[key].id )
						} }
						value={ renderedTerms[key].id }
					/>

					{!! renderedTerms[key].children.length && (
						<div className='editor-post-taxonomies__hierarchical-terms-subchoices'>
							{renderTerms( renderedTerms[key].children )}
						</div>
					)}
				</div>
			)
		} )
	}

	if ( tax.isHierarchical ) {
		return (
			<>
				<div className='fl-asst-hierarchical-terms-list'>
					{renderTerms( checkboxTerms )}
				</div>
				<div className='fl-asst-new-term-form'>
					{addingNew && (
						<>
							<label>{ sprintf( 'New %s Name', tax.labels.singular ) }</label>
							<Form.TextItem
								value={ newTerm }
								onChange={ name => setNewTerm( name ) }
							/>
							<label>{ sprintf( 'New %s Parent', tax.labels.singular ) }</label>
							<Form.SelectItem
								options={ {
									'': __( 'None' ),
									...getHierarchicalOptions()
								} }
								value={ newTermParent }
								onChange={ v => setNewTermParent( v ) }
							/>
							<Button
								appearance="normal"
								onClick={ () => {
									setAddingNew( false )
									addNewTerm( newTerm, newTermParent )
								} }
							>
								{tax.labels.addNewItem}
							</Button>
						</>
					)}
					{! addingNew && (
						<Button
							appearance="normal"
							onClick={ () => {
								setNewTerm( '' )
								setNewTermParent( '' )
								setAddingNew( true )
							} }
						>
							{tax.labels.newItem}
						</Button>
					)}
				</div>
			</>
		)
	}

	return (
		<Form.SuggestItem
			placeholder={ tax.labels.newItem }
			id={ `taxonomy-${taxonomy}` }
			options={ options }
			value={ values }
			onRemove={ v => {
				const i = values.indexOf( v )
				value.splice( i, 1 )
				onChange( value )
			} }
			onAdd={ title => addNewTerm( title ) }
		/>
	)
}
