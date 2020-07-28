import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Text } from 'fluid'
import { Button, Icon, Layout } from 'assistant/ui'

import MediaUpload from './media'
import PostsUpload from './posts'
import LibraryContext from '../context'

export default () => {
	const { uploader, setShowUpload, uploadTab, setUploadTab } = LibraryContext.use()
	const { queuedFiles, handleSelect } = uploader

	return (
		<Layout.Box
			style={ {
				backgroundColor: 'var(--fluid-opaque-13)',
				borderRadius: 'var(--fluid-radius)',
				margin: '0 var(--fluid-sm-space)'
			} }
		>
			<Layout.Row
				style={ {
					alignItems: 'center',
					justifyContent: 'left',
				} }
			>
				<Text.Title style={ { flexGrow: 1 } }>
					{ __( 'Add Items' ) }
				</Text.Title>
				<Button
					appearance='transparent'
					onClick={ () => setShowUpload( false ) }
				>
					<Icon.CloseCompact />
				</Button>
			</Layout.Row>

			<Layout.Box padX={ false }>
				{ __( 'Libraries can contain posts, saved templates, media, svg artwork and more...' ) }
			</Layout.Box>

			<Button.Group>
				<Button
					onClick={ () => setUploadTab( 'posts' ) }
					isSelected={ 'posts' === uploadTab }
				>
					{ __( 'Posts' ) }
				</Button>
				<Button
					onClick={ () => setUploadTab( 'media' ) }
					isSelected={ 'media' === uploadTab }
				>
					{ __( 'Media' ) }
				</Button>
			</Button.Group>

			{ 'posts' === uploadTab &&
				<PostsUpload />
			}

			{ 'media' === uploadTab &&
				<MediaUpload />
			}
		</Layout.Box>
	)
}
