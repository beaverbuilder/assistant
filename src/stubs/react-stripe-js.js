// Plugin build aliases this so it can import Stripe components without loading Stripe.
import React from 'react'

export function Elements( { children } ) {
	return children ? <>{ children }</> : null
}

export function PaymentElement() {
	return null
}

export function CardElement() {
	return null
}

export function useStripe() {
	return null
}

export function useElements() {
	return null
}
