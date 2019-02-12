import { useEffect } from 'react'
import { request } from 'utils/request'
import { addLeadingSlash } from 'utils/url'

export const useHeartbeat = ( route, onTick ) => {

	// Initial request on mount
	useEffect( () => {
		const req = request( {
			route,
			method: 'GET',
			onSuccess: onTick,
		} )
		return () => req.cancel()
	}, [] )

	// Heartbeat requests
	useEffect( () => {
		const doc = jQuery( document )
		const key = `fl-assistant-${ new Date().getTime() }`
		const sendEvent = `heartbeat-send.${ key }`
		const tickEvent = `heartbeat-tick.${ key }`

		doc.on( sendEvent, ( e, data ) => data[ key ] = addLeadingSlash( route ) )
		doc.on( tickEvent, ( e, data ) => data[ key ] ? onTick( data[ key ] ) : null )

		return () => doc.off( `${ sendEvent } ${ tickEvent }` )
	}, [ route ] )
}
