import html2canvas from 'html2canvas'

export const screenshotPost = ( url ) => {
	return new Promise( ( resolve, reject ) => {
		const frame = document.createElement( 'iframe' )
		frame.src = url
		frame.style.width = '100%'

		frame.onload = () => {
			const frameWindow = frame.contentWindow || frame.contentDocument
			try {
				html2canvas( frameWindow.document.body, {
					width: 1000,
					height: 1000
				} ).then( canvas => {
					document.body.removeChild( frame )
					resolve( canvas.toDataURL( 'image/png' ) )
				} )
			} catch ( e ) {
				reject( e )
			}
		}

		document.body.appendChild( frame )
	} )
}
