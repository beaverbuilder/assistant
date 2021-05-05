import './store'
import React from 'react'
import { FileDropListener } from './drop-listener'
import useMediaUploads from './use-media-uploads'
import './style.scss'

export const Uploader = ( { children, ...rest } ) => {
	const { uploadFiles } = useMediaUploads()

	return (
		<FileDropListener onDrop={ uploadFiles } { ...rest }>
			{children}
		</FileDropListener>
	)
}

const Media = {
	useMediaUploads,
	Uploader
}

export default Media
