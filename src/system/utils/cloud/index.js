import * as auth from './auth'
import * as session from './session'
import user from './user'
import teams from './teams'
import mockup from './mockup'

export default {
	...mockup,
	auth,
	session,
	user,
	teams
}
