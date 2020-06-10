import { createCloudClient } from '@beaverbuilder/cloud'

export default createCloudClient( {
	apiUrl: `${ FL_ASSISTANT_CONFIG.cloudUrl }/api`
} )
