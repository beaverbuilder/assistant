import { getQueryArgs } from 'assistant/utils/url'
import { getAppActions, getSystemActions } from 'assistant/data'
import cloud from 'assistant/cloud'

export default () => {
	const { setIsValidating } = getAppActions( 'fl-cloud-connect' )
	const { setCloudUser } = getSystemActions()
	const { href } = window.location
	const { token } = getQueryArgs( href )

	if ( token ) {
		setIsValidating( true )
		cloud.session.setToken( token )
		cloud.auth.refresh().then( response => {
			cloud.session.create( response.token, response.user, true )
			setCloudUser( response.user )
		} ).catch( () => {
			cloud.session.destroy()
		} ).finally( () => {
			setIsValidating( false )
		} )
	}
}
