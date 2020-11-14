import { __ } from '@wordpress/i18n'
import { useStore, getStore, getDispatch } from 'assistant/data'
import { getWpRest } from 'assistant/utils/wordpress'

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

		setCurrent( current + 1 )

		data.append( 'file', file, file.name || file.type.replace( '/', '.' ) )

		wpRest.attachments()
			.create( data )
			.then( onSuccess )
			.catch( onError )
	}

	const onSuccess = () => {
		const { items } = getStore( key ).getState()
		uploadNext()

		if ( current === items.length ) {
			alert( __( 'Media upload complete!' ) )
		}
	}

	const onError = err => {
		console.error( err )
		uploadNext()
	}

	return {
		files: items,
		uploadFiles
	}
}

export default useMediaUploads
