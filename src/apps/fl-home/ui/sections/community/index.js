import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'
import { Button } from 'assistant/ui'
import Section from '../generic'
import './style.scss'

export default ( { ...rest } ) => {
	const { pluginURL } = getSystemConfig()
	const url = `${pluginURL}/img/apps/fl-home/asst-pro-community-hero.jpg`
	const buttons = {
		community: __( 'Search Community' ),
		libraries: __( 'My Libraries' )
	}
	return (
		<Section
				className="home-pro-community-section"
				padContent={ false }
				canCollapse={ false }
				showHeader={ false }
				{ ...rest }
			>
			<div
				style={ {
					display: 'flex',
					flexDirection: 'column',
					height: 276,
					backgroundColor: '#E7F9F9',
					backgroundImage: `url(${url})`,
					backgroundSize: '436px',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
				} }
			>
				<p>{ __('Discover templates and assets to make your website great with Assistant Pro Community!') }</p>
			</div>
			<Button.Group
				appearance="buttons"
				style={{
					margin: 10,
					justifyContent: 'center',
					gap: 5
				}}
			>
				{ Object.entries( buttons ).map( ( [ handle, label ] ) => (
					<Button
						to={ `/${ handle }` }
						appearance="pillbox"
					>
						{label}
					</Button>
				) ) }
			</Button.Group>
		</Section>
	)
}
