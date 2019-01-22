export function addApp( key, config ) {
	return {
		type: 'ADD_APP',
		key,
		config,
	}
}
