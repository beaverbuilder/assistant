// Plugin build aliases this instead of real @stripe/stripe-js.
export function loadStripe() {
	return Promise.resolve( null )
}
