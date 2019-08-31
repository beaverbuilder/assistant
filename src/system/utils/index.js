import * as react from 'shared-utils/react'
import * as url from 'shared-utils/url'
import * as wordpress from 'shared-utils/wordpress'

import * as color from './color'
import * as gravatar from './gravatar'

// Anything from utils that needs to be exposed publicly can go here
export default {
	react,
	url,
	wordpress,
	color,
	gravatar,
}

export * from 'shared-utils/react'
export * from 'shared-utils/url'
export * from 'shared-utils/wordpress'
