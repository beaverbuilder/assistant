import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, List, Page } from 'assistant/ui'

export const TeamInvite = () => {
	const items = [
		{ label: 'Billy Young', description: 'billy@young.com' },
		{ label: 'Robby McCullough', description: 'robby@mccullough.com' },
		{ label: 'Justin Busa', description: 'justin@busa.com' }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			description: item.description,
			shouldAlwaysShowThumbnail: true,
			thumbnailSize: 'sm',
		}
	}

	return (
		<>
			<Layout.Box
				style={ {
					display: 'flex',
					flexDirection: 'row',
					paddingBottom: '0'
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
			<Layout.Box>
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
