import { createCloudClient, useApiRequest, appendFormDataObject } from '@beaverbuilder/cloud'
import { getSystemActions } from '../data/system'

const cloud = createCloudClient( FL_ASSISTANT_CONFIG.cloudConfig )

cloud.session.subscribe( data => {
	const { setIsCloudConnected } = getSystemActions()
	setIsCloudConnected( !! data.token )
} )

cloud.useApiRequest = useApiRequest
cloud.appendFormDataObject = appendFormDataObject

export default cloud
