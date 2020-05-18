import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Form, Layout, Page } from 'assistant/ui'
import NewPost from './new-post'
import NewImage from './new-image'

export default () => {
	const history = useHistory()
	const { id } = useParams()
	const [ type, setType ] = useState( 'choose' )

	const onCreate = () => {
		history.goBack()
	}

	return (
		<Page
			title={ __( 'Add Item' ) }
			shouldShowBackButton={ true }
		>
			<Layout.Headline>
				{ __( 'Add Library Item' ) }
			</Layout.Headline>
			<Layout.Box padX={ false }>
				<Form.Item
					label={ __( 'Item Type' ) }
				>
					<Form.SelectItem
						options={ {
							choose: __( 'Choose...' ),
							post: __( 'Post, Page or Custom Post Type' ),
							image: __( 'Image' ),
							svg: __( 'SVG' ),
						} }
						value={ type }
						onChange={ value => setType( value ) }
					></Form.SelectItem>
				</Form.Item>
				{ 'post' === type && <NewPost libraryId={ id } onCreate={ onCreate } /> }
				{ 'image' === type && <NewImage libraryId={ id } onCreate={ onCreate } /> }
			</Layout.Box>
		</Page>
	)
}
