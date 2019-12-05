import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Form, Icon } from 'ui'
import { Page, Button } from 'fluid/ui'
import { getSystemConfig } from 'data'

export const Comment = ( { location } ) => {
	const { pluginURL } = getSystemConfig()

	const defaultItem = {
		approved: null,
		author: null,
		authorEmail: null,
		authorIP: null,
		content: null,
		date: null,
		editUrl: null,
		id: null,
		meta: null,
		postId: null,
		postTitle: null,
		spam: false,
		thumbnail: null,
		time: null,
		title: null,
		trash: false,
		url: null,
	}

	const item = 'undefined' !== typeof location.state.item ? { ...defaultItem, ...location.state.item } : defaultItem
	const { author, date, authorEmail, authorIP } = item
	const hero = `${pluginURL}img/comment-hero-a.jpg`

	const { renderForm } = Form.useForm( {
		sections: {
			details: {
				label: __( 'Details' ),
				fields: {
					email: {
						label: __( 'Email Address' ),
						labelPlacement: 'beside',
						type: 'text',
						value: authorEmail,
						component: 'plain-text',
					},
					IPAddress: {
						label: __( 'IP Address' ),
						labelPlacement: 'beside',
						type: 'text',
						value: authorIP,
						component: 'plain-text',
					},
					date: {
						label: __( 'Submitted On' ),
						labelPlacement: 'beside',
						type: 'text',
						value: date,
						component: 'plain-text',
					}
				},
			},
			actions: {
				label: __( 'Actions' ),
				fields: {
					actions: {
						component: 'actions',
						options: [
							{ label: 'Test' },
							{ label: 'Test Again' }
						]
					}
				},
			},
		},
		defaults: item,
	} )

	return (
		<Page title={ __( 'Edit Comment' ) } hero={ hero }>

			<Page.Headline>{author}</Page.Headline>
			<div>{sprintf( 'commented on %s', date )}</div>

			<div style={ { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30, marginBottom: 20 } }>
				<Button appearance="elevator">
					<Icon.Trash />
				</Button>
				<Button appearance="elevator" status="primary">
					<Icon.Trash />
				</Button>
				<Button appearance="elevator" status="alert">
					<Icon.Trash />
				</Button>
				<Button appearance="elevator" status="destructive">
					<Icon.Trash />
				</Button>
			</div>

			{renderForm()}
		</Page>
	)
}
