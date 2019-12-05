import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Form, Icon } from 'ui'
import { Page, Button } from 'fluid/ui'
import { getSystemConfig } from 'data'

export const Comment = ( { location } ) => {
	const { item } = location.state
	const { author, date, authorEmail, authorIP, content } = item
	const { pluginURL } = getSystemConfig()
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

			<div className="fl-asst-content-area" dangerouslySetInnerHTML={{ __html: content }}/>

			<div style={ { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: '10px 0 20px' } }>
				<Button appearance="elevator" status="primary">
					<Icon.Approve />
				</Button>
				<Button appearance="elevator" status="alert">
					<Icon.Reject />
				</Button>
				<Button appearance="elevator">
					<Icon.Reply />
				</Button>
				<Button appearance="elevator">
					<Icon.Edit />
				</Button>
				<Button appearance="elevator" status="destructive">
					<Icon.Trash />
				</Button>
			</div>

			{renderForm()}
		</Page>
	)
}
