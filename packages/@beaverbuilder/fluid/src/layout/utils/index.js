
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
