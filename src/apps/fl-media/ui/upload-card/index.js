import React from 'react'
import { __ } from '@wordpress/i18n'
import './style.scss'

const UploadCard = ( { files = [], onInput = () => {} } ) => {
	return (
		<div className="fl-asst-upload-card">
			<p style= { { textAlign: 'center' } } >{ __( 'Upload Media' ) }</p>
			<input
				type="file"
				multiple
				accept="image/jpg,image/gif,image/png,image/svg+xml"
				onInput={ e => onInput( e.target.files ) }
			/>
			<ul>
				{ files.map( ( file, i ) => {

					return (
						<li key={ i }>
							{file.name}
						</li>
					)
				} ) }
			</ul>
		</div>
	)
}

export default UploadCard
