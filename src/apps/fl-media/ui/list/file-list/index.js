import React from 'react'
import { UploadingItem } from '../items'

const FileList = ( { files = [], current } ) => {
	if ( current > files.length ) {
		return null
	}
	return files.map( ( file, i ) => {

		// Remove items that have already been uploaded
		if ( i + 1 < current ) {
			return null
		}

		const src = URL.createObjectURL( file )

		return (
			<li key={ file.name }>
				<UploadingItem src={ src } />
			</li>
		)
	} )
}

export default FileList
