import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout  } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import cloud from 'assistant/cloud'

export default ( { teamId, showLogout = true } ) => {
	if ( teamId ) {
		return <TeamLinks teamId={ teamId } />
	}
	return <UserLinks showLogout={ showLogout } />
}

const TeamLinks = ( { teamId } ) => {
	const { cloudConfig } = getSystemConfig()
	const [ team ] = cloud.teams.useOne( teamId )
	if ( ! team ) {
		return null
	}
	return (
		<Layout.Row>
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

const UserLinks = ( { showLogout } ) => {
	const { cloudConfig } = getSystemConfig()
	const cloudUser = cloud.session.getUser()
	return (
		<>
			{ showLogout &&
				<Button
					title={ __( 'Logout' ) }
					onClick={ cloud.auth.logout }
					appearance='transparent'
					size='sm'
					style={ {
						height: '25px',
						width: '25px',
						marginRight: 'var(--fluid-med-space)',
						borderRadius: '100%',
						minHeight: '0',
						minWidth: '0'
					} }
				>
					<span
						className="dashicons dashicons-lock"
					></span>
				</Button>
			}
			<Button
				className='fl-asst-cloud-gravatar-link'
				href={ cloudConfig.appUrl }
				target='_blank'
				appearance='elevator'
				size='sm'
				style={ {
					backgroundImage: `url(${ cloudUser.gravatar.sm })`,
					backgroundSize: 'contain',
					height: '25px',
					width: '25px',
					minHeight: '0',
					minWidth: '0'
				} }
			/>
		</>
	)
}
