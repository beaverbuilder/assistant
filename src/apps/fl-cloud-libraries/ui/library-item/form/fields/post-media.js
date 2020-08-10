import React from 'react'
import { __ } from '@wordpress/i18n'
import { Collection, Layout } from 'assistant/ui'

export default ( { item } ) => {
	const { attachments } = item.media
	if ( ! attachments || ! attachments.length ) {
		return (
			<Layout.Box
				style={ {
					padding: 'var(--fluid-lg-space)',
					margin: 'var(--fluid-lg-space) 0',
					textAlign: 'center'
				} }
			>
				{ __( 'This content has no media.' ) }
			</Layout.Box>
		)
	}
	return (
		<>
			<Layout.Box padX={ false }>
				{ __( 'Media contained in this content...' ) }
			</Layout.Box>
			<Layout.Box padX={ false } padY={ false }>
				<Collection maxItems={ 20 }>
					{ attachments.map( ( { id, sizes } ) =>
						<Collection.Item
							key={ id }
							thumbnail={ true }
							thumbnailProps={ {
								ratio: '4:3',
								style: {
									backgroundImage: `url(${ sizes.thumb.url })`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									borderRadius: 'var(--fluid-radius)',
								}
							} }
						>
						</Collection.Item>
					) }
				</Collection>
			</Layout.Box>
		</>
	)
}
