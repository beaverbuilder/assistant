import { createApiResource } from '../http'

export default ( http ) => {
	return createApiResource( '/admin/users', http )
}
