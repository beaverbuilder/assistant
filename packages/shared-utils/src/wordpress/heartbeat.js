import { useEffect } from 'react'
import { addLeadingSlash } from 'shared-utils/url'

/**
 * Adds a new REST route to be batched via the heartbeat API.
 */
export const createHeartbeat = ( route, onTick ) => {
	const doc = jQuery( document )
	const key = `fl-assistant-${ new Date().getTime() }`
	const sendEvent = `heartbeat-send.${ key }`
	const tickEvent = `heartbeat-tick.${ key }`
	return {
		start: () => {
			doc.on( sendEvent, ( e, data ) => data[ key ] = addLeadingSlash( route ) )
			doc.on( tickEvent, ( e, data ) => data[ key ] ? onTick( data[ key ] ) : null )
		},
		stop: () => {
			doc.off( `${ sendEvent } ${ tickEvent }` )
		},
	}
}

/**
 * Starts a heartbeat when a component mounts and stops
 * when the component unmounts.
 */
export const useHeartbeat = ( route, onTick ) => {
	useEffect( () => {
		const heartbeat = createHeartbeat( route, onTick )
		heartbeat.start()
		return () => heartbeat.stop()
	} )
}
