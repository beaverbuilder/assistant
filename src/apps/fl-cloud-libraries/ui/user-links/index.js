import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout  } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import cloud from 'assistant/cloud'

export default ( { teamId } ) => {
	if ( teamId ) {
		return <TeamLinks teamId={ teamId } />
	}
	return <UserLinks />
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
			{ team.user_permissions.update &&
				<Button
					href={ `${ cloudConfig.appUrl }/teams/${ team.id }/invites` }
					target='_blank'
					size='sm'
					style={ {
						borderRadius: '100%',
						marginLeft: 'var(--fluid-med-space)',
						height: '25px',
						width: '25px',
						minHeight: '0',
						minWidth: '0'
					} }
				>
					<Icon.Plus />
				</Button>
			}
		</Layout.Row>
	)
}

const UserLinks = () => {
	const { cloudConfig } = getSystemConfig()
	const cloudUser = cloud.session.getUser()
	return (
		<>
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
