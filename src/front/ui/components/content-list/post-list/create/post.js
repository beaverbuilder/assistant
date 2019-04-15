import React, { Fragment, useContext, useState } from 'react'
import { __, _x, sprintf } from '@wordpress/i18n'
import { createSlug } from 'utils/url'
import { createPost } from 'utils/wordpress'
import { getSystemConfig } from 'store'
import { Button, Form, Icon, UIContext, StackContext, ViewContext } from 'components'
import { PostListDetail, PostParentSelect } from '../detail'

export const CreatePost = () => {
	const { contentTypes } = getSystemConfig()
	const { presentNotification } = useContext( UIContext )
	const { index, replace } = useContext( StackContext )
	const { type, labels, supports, isHierarchical, refreshList } = useContext( ViewContext )
	const [ creating, setCreating ] = useState( false )
	const [ post, setPost ] = useState( {
		post_type: type,
		post_title: '',
		post_name: '',
		post_excerpt: '',
		post_parent: '0',
	} )

	const onChange = e => {
		const { name, value } = e.currentTarget
		post[ name ] = value

		if ( 'post_title' === name ) {
			post.post_name = createSlug( value )
		}

		setPost( { ...post } )
	}

	const createClicked = e => {
		const { name } = e.currentTarget
		setCreating( true )
		createPost( post, response => {
			setCreating( false )
			if ( response.error ) {
				createError()
			} else {
				presentNotification( sprintf( _x( '%s Created!', 'Singular post type label.' ), labels.singular ) )
				refreshList()
				if ( 'create-edit' === name ) {
					window.open( response.editUrl )
				} else {
					replace( {
						label: contentTypes[ type ].labels.editItem,
						content: <PostListDetail />,
						appearance: 'form',
						shouldShowTitle: false,
						context: {
							refreshList,
							...response,
						},
					}, index )
				}
			}
		}, createError )
	}

	const createError = () => {
		setCreating( false )
		presentNotification(
			sprintf( _x( 'Error! %s not created.', 'Singular post type label.' ), labels.singular ),
			{ appearance: 'error' }
		)
	}

	return (
		<form>
			<Form.Item label={__( 'Title' )} labelFor="fl-asst-post-title" isRequired={true}>
				<input
					id="fl-asst-post-title"
					name="post_title"
					type="text"
					placeholder={__( 'My Great Title!' )}
					value={ post.post_title }
					onChange={onChange}
				/>
			</Form.Item>

			<Form.Item label={__( 'Slug' )} labelFor="fl-asst-post-slug">
				<input
					id="fl-asst-post-slug"
					name="post_name"
					type="text"
					placeholder={__( 'my-great-slug' )}
					value={ post.post_name }
					onChange={onChange}
				/>
			</Form.Item>

			{ isHierarchical &&
				<Form.Item label={__( 'Parent' )} labelFor="fl-asst-post-parent">
					<PostParentSelect
						type={ type }
						name='post_parent'
						id='fl-asst-post-parent'
						value={ post.post_parent }
						onChange={ onChange }
					/>
				</Form.Item>
			}

			{ supports.excerpt &&
				<Form.Item label={__( 'Excerpt' )} labelFor="fl-asst-post-excerpt">
					<textarea
						name='post_excerpt'
						id="fl-asst-post-excerpt"
						rows={6}
						value={ post.post_excerpt }
						onChange={onChange}
					/>
				</Form.Item>
			}

			<Form.Footer>
				{ creating &&
					<Button>{ __( 'Creating Draft' ) } &nbsp;<Icon name='small-spinner' /></Button>
				}
				{ ! creating &&
					<Fragment>
						<Button name="create" onClick={ createClicked }>{ __( 'Create Draft' ) }</Button>
						<Button name="create-edit" onClick={ createClicked }>{ __( 'Create & Edit' ) }</Button>
					</Fragment>
				}
			</Form.Footer>
		</form>
	)
}
