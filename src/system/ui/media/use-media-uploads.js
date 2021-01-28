import { __ } from '@wordpress/i18n'
import { useStore, getStore, getDispatch } from 'data'
import { getWpRest } from 'utils/wordpress'

const key = 'fl-media/uploader'

const wpRest = getWpRest()

const useMediaUploads = () => {
	const { current, items } = useStore( key )
	const { setCurrent, setItems } = getDispatch( key )

	const uploadFiles = files => {
		setItems( [ ...items, ...files ] )

		if ( ! current ) {
			uploadNext()
		}
	}

	const uploadNext = () => {
		const { current, items } = getStore( key ).getState()
		const file = items[current]
		const data = new FormData()

		if ( ! file ) {
			setItems( [] )
			setCurrent( 0 )
			return
		}

		data.append( 'file', file, file.name || file.type.replace( '/', '.' ) )

		wpRest.attachments()
			.create( data )
			.catch( () => {
				alert( __( 'Error uploading media file.' ), { appearance: 'error' } )
			} )
			.finally( () => {
				setCurrent( current + 1 )
				uploadNext()
			} )
	}

	return {
		files: items,
		current,
		uploadFiles
	}
}

export default useMediaUploads
