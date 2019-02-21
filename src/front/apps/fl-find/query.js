import { useAppState } from 'store'

export const getQuery = () => {
	const [ filter ] = useAppState( 'filter' )
	const { type, subType, date, status } = filter
	const query = {}

	switch ( type ) {
	case 'posts':
		query.post_type = subType
		query.posts_per_page = 20
		query.orderby = 'title'
		query.order = 'ASC'
		query.s = ''
		query.post_status = 'attachment' === subType ? 'any' : status
		switch ( date ) {
		case 'today':
			query.year = now.getFullYear()
			query.month = now.getMonth() + 1
			query.day = now.getDate()
			break
		case 'week':
			query.year = now.getFullYear()
			query.w = getWeek( now )
			break
		case 'month':
			query.year = now.getFullYear()
			query.month = now.getMonth() + 1
			break
		case 'year':
			query.year = now.getFullYear()
			break
		}
		break
	case 'terms':
		query.taxonomy = subType
		query.hide_empty = 0
		break
	}
	return query
}
