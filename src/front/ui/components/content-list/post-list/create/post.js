import React, { Fragment, useContext, useState } from 'react'
import slug from 'slug'
import { __, _x, sprintf } from '@wordpress/i18n'
import { createPost } from 'utils/wordpress'
import { Button, Form, Icon, UIContext, StackContext, ViewContext } from 'components'
import { PostListDetail } from '../detail'

export const CreatePost = () => {
	const { presentNotification } = useContext( UIContext )
	const { dismissAll, present } = useContext( StackContext )
	const { type, labels, supports, refreshList } = useContext( ViewContext )
	const [ creating, setCreating ] = useState( false )
	const [ post, setPost ] = useState( {
		post_type: type,
		post_title: '',
		post_name: '',
		post_excerpt: '',
	} )

	const onChange = e => {
		const { name, value } = e.currentTarget
		post[ name ] = value

		if ( 'post_title' === name ) {
			post.post_name = slug( value ).toLowerCase()
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
				dismissAll()
				refreshList()
				if ( 'create-edit' === name ) {
					window.open( response.editUrl )
				} else {
					present( {
						label: __( 'Edit Post' ),
						content: <PostListDetail />,
						appearance: 'form',
						shouldShowTitle: false,
						context: response,
					} )
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

			<Form.Item>
				{ creating &&
					<Button style={{ marginLeft: 'auto' }}>{ __( 'Creating Draft' ) } &nbsp;<Icon name='small-spinner' /></Button>
				}
				{ ! creating &&
					<Fragment>
						<Button name="create" style={{ marginLeft: 'auto' }} onClick={ createClicked }>{ __( 'Create Draft' ) }</Button>
						<Button name="create-edit" onClick={ createClicked }>{ __( 'Create & Edit' ) }</Button>
					</Fragment>
				}
			</Form.Item>
		</form>
	)
}