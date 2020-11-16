import React from 'react'
import { Icon } from 'assistant/ui'
import './style.scss'

const FileList = ( { files = [], current } ) => {

	/*
	if ( file.type.startsWith( 'image/' )  ) {
		file.thumbnail = URL.createObjectURL( file )
	}
	*/

	console.log( 'files', files.length, current )

	if ( current > files.length ) {
		return null
	}

	return (
		<>
			<ul className="fl-asst-file-list">
				{ files.map( ( file, i ) => {

					// Remove items that have already been uploaded
					if ( i + 1 < current ) {
						return null
					}

					return (
						<li key={ file.name }>
							<img
								style={ {
									width: 36,
									height: 36,
									marginRight: 10
								} }
								src={ URL.createObjectURL( file ) }
							/>
							{ file.name }
							<Icon.Loading style={ { marginLeft: 'auto' } } />
						</li>
					)
				} ) }
			</ul>
		</>
	)
}

export default FileList
