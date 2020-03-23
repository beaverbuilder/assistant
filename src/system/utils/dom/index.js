
export const getFirstFocusableChild = parent => {
	if ( parent ) {
		const focusable = parent.querySelectorAll( 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])' )

		return focusable[0]
	}
	return false
}
