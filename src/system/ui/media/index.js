import './store'
import React from 'react'
import { FileDropListener } from './drop-listener'
import useMediaUploads from './use-media-uploads'
import './style.scss'

const Media = {
	useMediaUploads
}

export const Uploader = ( { children } ) => {
	const { uploadFiles } = useMediaUploads()

	return (
		<FileDropListener onDrop={ uploadFiles }>
			{children}
		</FileDropListener>
	)
}

Media.Uploader = Uploader

export default Media
