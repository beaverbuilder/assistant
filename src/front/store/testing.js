import { registerStore } from 'utils/store'

registerStore( {
	key: 'fl-assistant/testing',
	state: {
		foo: true,
		fooVar: true,
		bar: true,
		barVar: true,
	},
	actions: {
		// ...
	},
	reducers: {
		// ...
	},
	effects: {
		// ...
	},
	storage: {
		foo: 'local',
		fooVar: 'local',
		bar: 'user',
		barVar: 'user',
	}
} )
