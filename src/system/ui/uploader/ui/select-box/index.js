import React, { useRef } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Layout } from 'ui'

export const SelectBox = ( { onSelect } ) => {
	const inputRef = useRef()

	return (
		<Layout.Box
			style={ {
				border: '2px dashed var(--fluid-line-color)',
				textAlign: 'center',
				justifyContent: 'center',
			} }
		>
			<div
				style={ {
					paddingBottom: 'var(--fluid-lg-space)'
				} }
			>
				{ __( 'Drop to upload or select files' ) }
			</div>
			<input
				type='file'
				onChange={ onSelect }
				ref={ inputRef }
				multiple={ true }
				accept='image/*,.svg'
				style={ {
					display: 'none'
				} }
			/>
			<Button onClick={ () => inputRef.current.click() }>
				{ __( 'Select Files' ) }
			</Button>
		</Layout.Box>
	)
}
