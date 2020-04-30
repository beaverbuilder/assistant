import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, List, Page } from 'assistant/ui'
import { MembersListAccessory } from './components/members-list-accessory'

export const TeamInvite = () => {
	const items = [
		{ label: 'Billy Young', description: 'billy@young.com', invite: true },
		{ label: 'Robby McCullough', description: 'robby@mccullough.com', invite: true },
		{ label: 'Justin Busa', description: 'justin@busa.com', invite: true }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			description: item.description,
			shouldAlwaysShowThumbnail: true,
			thumbnailSize: 'sm',
			accessory: () => <MembersListAccessory item={ item } />
		}
	}

	return (
		<>
			<Layout.Box padY={ false }>
				<Page.Section
					label={ __( 'Invite' ) }
					padX={ false }
				>
					<Layout.Box
					 	padY={ false }
						style={ {
							display: 'flex',
							flexDirection: 'row',
						} }
					>
						<Form.TextItem
							placeholder="Email Address"
							style={ {
								width: '50%',
								margin: '0 5px 0 0'
							} }
						></Form.TextItem>
						<Button>{ __( 'Invite' ) }</Button>
					</Layout.Box>
				</Page.Section>
			</Layout.Box>
			<Layout.Box padY={ false }>
				<Page.Section label={ __( 'Pending Invites' ) } padX={ false }>
					<List
						items={ items }
						getItemProps={ getItemProps }
					/>
				</Page.Section>
			</Layout.Box>
		</>
	)
}
