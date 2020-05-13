import * as auth from './auth/auth'
import * as session from './auth/session'
import user from './api/user'
import teams from './api/teams'
import mockup from './mockup'

export default {
	...mockup,
	auth,
	session,
	user,
	teams
}
