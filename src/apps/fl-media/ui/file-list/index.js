import React from 'react'
import './style.scss'

const FileList = ( { files = [] } ) => {
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
						/>
						{ file.name }
					</li>
				)
			} ) }
		</ul>
	)
}

export default FileList
