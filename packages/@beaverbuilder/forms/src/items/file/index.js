import React, { useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button } from '@beaverbuilder/fluid'
import './style.scss'

export const FileItem = ( {
	id,
	onChange = () => {},
	accept = '*',
	value
} ) => {
	const ref = useRef()

	const getFilename = () => {
		let filename = ''
		if ( value ) {
			if ( value instanceof File ) {
				filename = value.name
			} else {
				filename = value.split( '/' ).pop()
			}
		}
		return filename.length <= 25 ? filename : filename.substring( 0, 24 ) + '...'
	}

	return (
		<div className='fl-asst-file-item'>
			{ ! value &&
				<div className='fl-asst-file-item-empty'>
					<Button onClick={ () => ref.current.click() }>
						{ __( 'Choose File' ) }
					</Button>
					<div>
						{ __( 'No file selected.' ) }
					</div>
				</div>
			}
			{ value &&
				<div className='fl-asst-file-item-selected'>
					<div className='fl-asst-file-item-thumb'>
						<FileThumb value={ value } />
					</div>
					<div className='fl-asst-file-item-details'>
						<div className='fl-asst-file-item-name'>
							{ getFilename() }
						</div>
						<div className='fl-asst-file-item-actions'>
							<Button onClick={ () => ref.current.click() }>
								{ __( 'Replace' ) }
							</Button>
							<Button onClick={ () => onChange( null ) }>
								{ __( 'Remove' ) }
							</Button>
						</div>
					</div>
				</div>
			}
			<input
				ref={ ref }
				key={ id }
				id={ id }
				type='file'
				accept={ accept }
				onChange={ () => onChange( ref.current.files[0] ) }
				style={ { display: 'none' } }
			/>
		</div>
	)
}

const FileThumb = ( { value } ) => {
	let src = null
	if ( value ) {
		if ( value instanceof File && value.type.startsWith( 'image/' ) ) {
			src = URL.createObjectURL( value )
		} else if ( value.match(/\.(jpeg|jpg|gif|png)$/) != null ) {
			src = value
		}
	}
	return ( src &&
		<img src={ src } />
	)
}
