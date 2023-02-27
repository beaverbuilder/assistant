import md5 from 'md5'
import { getQueryArgs } from 'assistant/utils/url'
import { getAppActions, getSystemActions, getSystemConfig } from 'assistant/data'
import cloud from 'assistant/cloud'

export default () => {
	const LAST_TOKEN_KEY = 'fl-assistant-last-cloud-token-'
	const { setIsValidating } = getAppActions( 'fl-cloud-connect' )
	const { setCloudUser } = getSystemActions()
	const { currentUser, homeUrl } = getSystemConfig()
	const lastToken = localStorage.getItem( LAST_TOKEN_KEY + md5( homeUrl ) )
	const { href } = window.location
	const { referrer } = window.document
	const { token } = ( 'undefined' === typeof window.ElementorInlineEditor ) ? getQueryArgs( href ) : getQueryArgs( referrer )

	if ( token && token !== lastToken ) {
		setIsValidating( true )
		localStorage.setItem( LAST_TOKEN_KEY + md5( homeUrl ), token )
		cloud.session.setToken( token )
		cloud.auth.refresh().then( response => {
			cloud.session.create( response.token, response.user, true )
			setCloudUser( {
				...response.user,
				wpId: currentUser.id
			} )
		} ).catch( () => {
			cloud.session.destroy()
		} ).finally( () => {
			setIsValidating( false )
		} )
	}
}
