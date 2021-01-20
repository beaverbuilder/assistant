import React from 'react'
import { Button, Icon } from 'assistant/ui'
import { useAppList } from 'assistant/data'

const AppList = () => {
	const apps = useAppList()
	return (
		<div
			style={ {
				padding: '0 10px 20px',
				display: 'grid',
				gridTemplateColumns: 'repeat( 2, 1fr )',
				gridGap: 5
			} }
		>
			{ apps.map( app => {
				const { label, icon, handle } = app
				return (
					<div key={ handle } style={ { display: 'flex', flexDirection: 'row' } } >
						<Button appearance="transparent" to={ `/${handle}` } style={ { flex: '1 1 auto' } } className="fl-asst-apps-widget-item">
							<span style={ { marginRight: 15 } }>
								<Icon.Safely icon={ icon } context="widget" />
							</span>
							{label}
						</Button>
					</div>
				)
			} ) }
		</div>
	)
}

export default AppList
