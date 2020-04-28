import * as mockup from './mockup'
import { createMockupApi } from 'utils/mockup'

export default createMockupApi( mockup, {
	cacheKey: 'fl-assistant/cloud-mockup'
} )
