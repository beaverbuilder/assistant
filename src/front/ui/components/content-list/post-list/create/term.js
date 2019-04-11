import React, { Fragment, useContext, useState } from 'react'
import slug from 'slug'
import { __, _x, sprintf } from '@wordpress/i18n'
import { createTerm } from 'utils/wordpress'
import { getSystemConfig } from 'store'
import { Button, Form, Icon, UIContext, StackContext, ViewContext } from 'components'
import { TermListDetail, TermParentSelect } from '../detail'

export const CreateTerm = () => {
	const { taxonomies } = getSystemConfig()
	const { presentNotification } = useContext( UIContext )
	const { dismissAll, present } = useContext( StackContext )
	const { type, labels, isHierarchical, refreshList } = useContext( ViewContext )
	const [ creating, setCreating ] = useState( false )
	const [ term, setTerm ] = useState( {
		taxonomy: type,
		name: '',
		slug: '',
		parent: '0',
		description: '',
	} )

	const onChange = e => {
		const { name, value } = e.currentTarget
		term[ name ] = value

		if ( 'name' === name ) {
			term.slug = slug( value ).toLowerCase()
		}

		setTerm( { ...term } )
	}

	const createClicked = () => {
		setCreating( true )
		createTerm( term, response => {
			setCreating( false )
			if ( response.error ) {
				createError( response )
			} else {
				presentNotification( sprintf( _x( '%s Created!', 'Singular term label.' ), labels.singular ) )
				dismissAll()
				refreshList()
				present( {
					label: taxonomies[ type ].labels.editItem,
					content: <TermListDetail />,
					appearance: 'form',
					context: {
						refreshList,
						...response,
					},
				} )
			}
		}, createError )
	}

	const createError = response => {
		setCreating( false )
		if ( 'exists' === response.error ) {
			presentNotification(
				sprintf( _x( 'Error! %s already exists.', 'Singular term label.' ), labels.singular ),
				{ appearance: 'error' }
			)
		} else {
			presentNotification(
				sprintf( _x( 'Error! %s not created.', 'Singular term label.' ), labels.singular ),
				{ appearance: 'error' }
			)
		}
	}

	return (
		<form>
			<Form.Item label={__( 'Name' )} labelFor="fl-asst-term-name" isRequired={true}>
				<input
					id="fl-asst-term-name"
					name="name"
					type="text"
					placeholder={__( 'My Great Name!' )}
					value={term.name}
					onChange={onChange}
				/>
			</Form.Item>

			<Form.Item label={__( 'Slug' )} labelFor="fl-asst-term-slug">
				<input
					id="fl-asst-term-slug"
					name="slug"
					type="text"
					placeholder={__( 'my-great-slug' )}
					value={term.slug}
					onChange={onChange}
				/>
			</Form.Item>

			{ isHierarchical &&
				<Form.Item label={__( 'Parent' )} labelFor="fl-asst-term-parent">
					<TermParentSelect
						taxonomy={ type }
						name='parent'
						id='fl-asst-term-parent'
						value={ term.parent }
						onChange={ onChange }
					/>
				</Form.Item>
			}

			<Form.Item label={__( 'Description' )} labelFor="fl-asst-term-description">
				<textarea
					name='description'
					id="fl-asst-term-description"
					rows={6}
					value={term.description}
					onChange={onChange}
				/>
			</Form.Item>

			<Form.Footer>
				{ creating &&
					<Button>{ __( 'Creating Term' ) } &nbsp;<Icon name='small-spinner' /></Button>
				}
				{ ! creating &&
					<Fragment>
						<Button onClick={createClicked}>{ labels.addNewItem }</Button>
					</Fragment>
				}
			</Form.Footer>
		</form>
	)
}
