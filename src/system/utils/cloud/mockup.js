import { createMockupApi } from 'utils/mockup'

const db = {
	teams: []
}

export default createMockupApi( db, {
	cacheKey: 'fl-assistant/cloud-mockup',
	delayResponse: 1000
} )
