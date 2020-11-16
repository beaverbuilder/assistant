import React from 'react'
import './style.scss'

const FileList = ( { files = [] } ) => {

	/*
	if ( file.type.startsWith( 'image/' )  ) {
		file.thumbnail = URL.createObjectURL( file )
	}
	*/

	return (
		<ul className="fl-asst-file-list">
			{ files.map( file => {
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
					</li>
				)
			} ) }
		</ul>
	)
}

export default FileList
