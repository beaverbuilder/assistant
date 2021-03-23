import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon } from 'assistant/ui'
import './style.scss'

const UploadCard = ( {
	onInput = () => {},
	onDismiss = () => {},
	...rest
} ) => {
	return (
		<div className="fl-asst-upload-card" { ...rest }>
			<span className="close-action">
				<Button
					icon={ <Icon.CloseCompact /> }
					appearance="transparent"
					shape="round"
					onClick={ onDismiss }
				/>
			</span>
			<p style= { { textAlign: 'center', marginTop: 0 } } >{ __( 'Drop or Select files to upload to the media library.' ) }</p>
			<label htmlFor="media-upload">
				<input
					type="file"
					name="media-upload"
					id="media-upload"
					multiple
					accept="image/jpg,image/gif,image/png,image/svg+xml"
					onInput={ e => onInput( e.target.files ) }
				/>
				<Icon.PlusSmall style={ { marginLeft: 10 } } />
				{ __( 'Choose Files' ) }
			</label>
		</div>
	)
}

export default UploadCard
