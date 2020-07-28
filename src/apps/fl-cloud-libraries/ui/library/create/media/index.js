import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Text } from 'fluid'
import { Layout, Uploader } from 'assistant/ui'

export default () => {
	const { id } = useParams()
	const {
		queuedFiles,
		finishedFiles,
		handleDrop,
		handleSelect
	} = Uploader.useLibrary( id )

	return (
		<Layout.DropArea onDrop={ handleDrop }>
			<Layout.Box
				style={ {
					height: '100%'
				} }
			>
				<Layout.Headline
					style={ {
						paddingBottom: 'var(--fluid-med-space)'
					} }
				>
					{ __( 'Add Media' ) }
				</Layout.Headline>

				<Uploader.SelectBox onSelect={ handleSelect } />

				{ !! queuedFiles.length &&
					<Layout.Box padX={ false }>
						<Uploader.FileList files={ queuedFiles } />
					</Layout.Box>
				}

				{ !! finishedFiles.length &&
					<Layout.Box padX={ false }>
						<Text.Title>
							{ __( 'Finished Files' ) }
						</Text.Title>
						<Uploader.FileList files={ finishedFiles } />
					</Layout.Box>
				}
			</Layout.Box>
		</Layout.DropArea>
	)
}
