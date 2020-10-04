import React, { memo } from 'react'
import { __ } from '@wordpress/i18n'
import { motion } from 'framer-motion'
import { Button, Icon } from 'assistant/ui'
import { useAppList } from 'assistant/data'
import { Card } from 'home/ui'
import './style.scss'

const AppsWidget = memo ( ( { ...rest } ) => {
	const apps = useAppList()

	const Actions = () => {
		return (
			<Button
				appearance="transparent"
				status="primary"
				to='/fl-manage'
			>{__( 'Manage' )}</Button>
		)
	}

	return (
		<Card
			title={ __( 'Apps' ) }
			contentProps={ {
				style: {
					padding: '0 10px 20px',
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					gridGap: 5
				}
			} }
			actions={ <Actions /> }
			{ ...rest }
		>
			{ apps.map( app => {
				const { label, icon, handle } = app
				return (
					<motion.div
						key={ handle }
						layout
						style={ {
							display: 'flex',
							flexDirection: 'row'
						} }
					>
						<Button appearance="transparent" to={ `/${handle}` } style={ { flex: '1 1 auto' } } className="fl-asst-apps-widget-item">
							<span style={ { marginRight: 15 } }>
								<Icon.Safely icon={ icon } context="widget" />
							</span>
							{label}
						</Button>
					</motion.div>
				)
			} ) }
		</Card>
	)
} )

export default AppsWidget
