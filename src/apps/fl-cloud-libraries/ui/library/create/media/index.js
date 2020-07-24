import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Layout } from 'assistant/ui'

export default () => {

	return (
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
			<Layout.Box
				style={ {
					border: '2px dashed var(--fluid-line-color)',
					textAlign: 'center',
					justifyContent: 'center',
					height: '100%'
				} }
			>
				<div
					style={ {
						paddingBottom: 'var(--fluid-lg-space)'
					} }
				>
					{ __( 'Drop to upload or select files' ) }
				</div>
				<Button>
					{ __( 'Select Files' ) }
				</Button>
			</Layout.Box>
		</Layout.Box>
	)
}
