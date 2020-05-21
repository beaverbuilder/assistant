import { createMockupApi } from 'utils/mockup'

const db = {
	...FL_ASSISTANT_CONFIG.mockup,
	teams: [],
}

export default createMockupApi( db, {
	cacheKey: 'fl-assistant/cloud-mockup',
	delayResponse: 500,
	debug: false
} )
