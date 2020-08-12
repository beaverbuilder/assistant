import React from 'react'
import { Libraries, Uploader } from '@beaverbuilder/cloud-ui'

export default () => {
	const { uploader } = Libraries.LibraryContext.use()
	const { queuedFiles, errorFiles, handleSelect } = uploader

	return (
		<div style={ { marginTop: 'var(--fluid-lg-space)' } }>
			<Uploader.SelectBox onSelect={ handleSelect } />
			<Uploader.FileList files={ queuedFiles } />
			<Uploader.FileList files={ errorFiles } />
		</div>
	)
}
