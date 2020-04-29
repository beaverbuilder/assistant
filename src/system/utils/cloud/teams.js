import { createSlug } from 'utils/url'
import mockup from './mockup'

export default {
	...mockup.teams,
	nameExists: ( name ) => {
		return mockup.teams.getAll( { name } ).then( response => {
			return !! response.data.teams.length
		} )
	}
}
