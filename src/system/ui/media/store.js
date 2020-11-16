import { registerStore } from 'data/registry'

const key = 'fl-media/uploader'

registerStore( key, {
	state: {
		current: 0,
		items: [],
	}
} )
