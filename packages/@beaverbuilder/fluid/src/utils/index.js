
// Resolve a recognized size name with the corresponding space var while still supporting literal values
export const getSpacingValue = val => {

	if ( Number.isInteger( val ) && 0 !== val ) {
		return val + 'px'
	}
	if ( 'lg' === val || 'large' === val ) {
		return 'var(--fluid-lg-space)'
	}
	if ( 'med' === val || 'medium' === val ) {
		return 'var(--fluid-med-space)'
	}
	if ( 'sm' === val || 'small' === val ) {
		return 'var(--fluid-med-space)'
	}
	return val
}

// Calculate a height percentage for aspect ratio boxes
// This is typically applied with padding-top
export const getHeightForRatio = ( ratio, width, height ) => {

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
