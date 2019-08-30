import React from 'fl-react'
import { Form, List } from 'assistant/lib'
import { __ } from '@wordpress/i18n'

//import { getWpRest } from 'assistant/utils/wordpress'

export const PostsTab = ( props ) => {

	const { user } = props

	// const [posts, setPosts] = useState([])

	// const wordpress = getWpRest()
	//
	// useEffect(() => {
	//     wordpress.posts().findWhere({author: user.id})
	//         .then(response => {
	//             setPosts(response.data)
	//         })
	// }, [posts])

	return (
		<Form>
			<Form.Section label={ __( 'Posts by ' ) + user.displayName }>
				<Form.Item>
					<List.Posts query={ { author: user.id } }></List.Posts>
				</Form.Item>
			</Form.Section>
		</Form>
	)
}
