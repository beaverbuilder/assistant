export const defaultState = {
	listStyle: 'grid',
	query: {
		post_mime_type: 'all',
		order: 'DESC',
		orderby: 'date',
		label: '0',
	},
	showUploader: true,
}

export const cache = [ 'listStyle', 'query', 'showUploader' ]
