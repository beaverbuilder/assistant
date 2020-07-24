import React from 'react'
import { __ } from '@wordpress/i18n'
import { Layout  } from 'assistant/ui'
import cloud from 'assistant/cloud'

export default ( { teamId } ) => {
	const [ team ] = cloud.teams.useOne( teamId )
	if ( ! team ) {
		return null
	}
	return (
		<Layout.Row style={ { padding: '0 0 var(--fluid-lg-space) 0' } }>
			{ team.users.map( ( member, i ) =>
				<img
					key={ i }
					src={ member.gravatar.sm }
					style={ {
						width: '25px',
						marginRight: 'var(--fluid-sm-space)',
						borderRadius: '100%',
						marginRight: '-5px'
					} }
				/>
			) }
		</Layout.Row>
	)
}
