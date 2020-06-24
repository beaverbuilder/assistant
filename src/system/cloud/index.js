import { createCloudClient } from '@beaverbuilder/cloud'
import { getSystemActions } from '../data/system'

const cloud = createCloudClient( {
	apiUrl: `${ FL_ASSISTANT_CONFIG.cloudUrl }/api`
} )

cloud.session.subscribe( data => {
	const { setIsCloudConnected } = getSystemActions()
	setIsCloudConnected( !! data.token )
} )

export default cloud
