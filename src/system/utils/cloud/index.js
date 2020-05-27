import * as auth from './auth/auth'
import * as session from './auth/session'
import user from './api/user'
import teams from './api/teams'
import sites from './api/sites'
import libraries from './api/libraries'

auth.checkAccess()

export default {
	auth,
	session,
	user,
	teams,
	sites,
	libraries
}
