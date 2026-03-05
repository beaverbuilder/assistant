import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Layout, Modal } from 'assistant/ui'
import cloud from 'assistant/cloud'

const POLL_INTERVAL_MS = 2000

const triggerBlobDownload = ( blob, filename ) => {
	const url = URL.createObjectURL( blob )
	const a = document.createElement( 'a' )
	a.href = url
	a.download = filename || 'library.zip'
	document.body.appendChild( a )
	a.click()
	document.body.removeChild( a )
	URL.revokeObjectURL( url )
}

export default () => {
	const { library } = Libraries.LibraryContext.use()
	const [ showDownloadModal, setShowDownloadModal ] = useState( false )
	const [ downloadModalError, setDownloadModalError ] = useState( null )
	const [ disabled, setDisabled ] = useState( false )

	const startAsyncDownload = async ( downloadToken ) => {
		setShowDownloadModal( true )
		setDownloadModalError( null )

		const poll = async () => {
			try {
				const data = await cloud.libraries.getDownloadStatus( downloadToken )
				if ( data.status === 'ready' ) {
					const blobRes = await cloud.libraries.getDownloadBlob( downloadToken )
					triggerBlobDownload( blobRes.data, data.filename )
					setShowDownloadModal( false )
					setDisabled( false )
					Libraries.loadAppState()
					return
				}
				if ( data.status === 'expired' ) {
					setDownloadModalError( data.message || __( 'Download link expired. Please try again.' ) )
					setDisabled( false )
					return
				}
				setTimeout( poll, POLL_INTERVAL_MS )
			} catch ( err ) {
				const msg = err?.response?.data?.message
				const status = err?.response?.data?.status
				const isExpired = err?.response?.status === 404 && status === 'expired'
				setDownloadModalError( isExpired
					? ( err?.response?.data?.message || __( 'Download link expired. Please try again.' ) )
					: ( msg && typeof msg === 'string' ? msg : __( 'Something went wrong. Please try again.' ) )
				)
				setDisabled( false )
			}
		}

		poll()
	}

	const handleDownload = async () => {
		setDisabled( true )

		try {
			const res = await cloud.libraries.requestDownload( library.id )

			if ( res.status === 202 ) {
				const text = await res.data.text()
				const data = JSON.parse( text )
				if ( data.download_token ) {
					await startAsyncDownload( data.download_token )
					return
				}
			}

			if ( res.status === 200 ) {
				const filename = res.headers[ 'content-disposition' ]
					? ( /filename="?([^";\n]+)"?/.exec( res.headers[ 'content-disposition' ] ) || [] )[ 1 ]
					: null
				triggerBlobDownload( res.data, filename || `${ library.name || 'library' }.zip` )
			}
		} catch ( err ) {
			setShowDownloadModal( true )
			setDownloadModalError( __( 'Download failed. Please try again.' ) )
		}

		setDisabled( false )
	}

	return (
		<>
			<Modal.Dialog
				isShowing={ showDownloadModal }
				setIsShowing={ setShowDownloadModal }
				className="fl-asst-download-preparing-dialog"
				message={ (
					<>
						<Layout.Headline style={ { marginBottom: 'var(--fluid-lg-space)' } }>
							{ downloadModalError ? __( 'Download issue' ) : __( 'Preparing your download...' ) }
						</Layout.Headline>
						{ downloadModalError ? (
							<p>{ downloadModalError }</p>
						) : (
							<>
								<p style={ { marginBottom: 'var(--fluid-lg-space)' } }>
									{ __( 'Do not navigate away from this page. Your library will automatically be downloaded when ready.' ) }
								</p>
								<Layout.Loading style={ { justifyContent: 'center' } } />
							</>
						) }
					</>
				) }
				buttons={ downloadModalError ? [
					{
						label: __( 'Close' ),
						onClick: ( { closeDialog } ) => {
							setDownloadModalError( null )
							closeDialog()
						},
					},
				] : [] }
			/>
			<Button
				title={ __( 'Download a ZIP file of all items in this library.' ) }
				disabled={ disabled }
				onClick={ handleDownload }
			>
				{ __( 'Download ZIP' ) }
			</Button>
		</>
	)
}
