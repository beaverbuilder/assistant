import { createMockupApi } from 'utils/mockup'

const db = {
	...FL_ASSISTANT_CONFIG.mockup,
	teams: [],
	sites: [
		{
			id: 1,
			url: 'https://www.test.com',
		}
	],
}

export default createMockupApi( db, {
	cacheKey: 'fl-assistant/cloud-mockup',
	delayResponse: 500,
	debug: false
} )
