export const getHeightForRatio = ( ratio, width, height ) => {

	if ( true === ratio ) {
		return '100%'
	}

	if ( width && height ) {
		return ( height / width ) * 100 + '%'
	}

	switch ( ratio ) {
	case 'square':
	case '1:1':
		return '100%'
	case 'video':
	case '16:9':
		return '56.25%'
	case 'poster':
	case '3:4':
		return '133.3%'
	default:
		const parts = ratio.split( ':' )
		return ( 100 / parts[0] ) * parts[1] + '%'
	}
}
