import React, { memo } from 'react'
import { __ } from '@wordpress/i18n'
import { useHistory } from 'react-router-dom'
import {
	App,
	Page,
	Icon,
	Button,
	Form,
	Layout,
	Env,
} from 'assistant/ui'
import { useSystemState, getSystemActions, getSystemSelectors } from 'assistant/data'
import AppIcon from './icon'
import { DragHandleBox, AppList } from './ui'
import './style.scss'

export default props => (
	<App.Config
		pages={ { default: MainScreen } }
		{ ...props }
	/>
)

const MainScreen = () => {
	const { application } = Env.use()
	const isBeaverBuilder = 'beaver-builder' === application
	return (
		<Page
			title={ __( 'Apps & Settings' ) }
			shouldShowBackButton={ false }
			icon={ <AppIcon context="sidebar" /> }
		>
			<Form>
				<Page.Section contentStyle={ { paddingTop: 0 } }>
					<p style={ { marginTop: 0 } }>{__( 'You can reorder the apps below. The top 5 will appear in the sidebar for quick access.' )}</p>
					<AppList before={ <Home /> } />
				</Page.Section>
				{ ! isBeaverBuilder && <UIColorPreferences /> }
			</Form>
		</Page>
	)
}

const Home = memo( () => {
	const history = useHistory()
	const goToRoot = () => history.go( -history.length )
	const { selectHomeApp } = getSystemSelectors()
	const home = selectHomeApp()

	return (
		<li>
			<DragHandleBox />
			<Button
				onClick={ goToRoot }
				appearance="transparent"
				style={ {
					flex: '1 1 auto',
					marginRight: 'auto',
					justifyContent: 'flex-start',
				} }
			>
				<span className="fl-asst-item-icon">
					<Icon.Safely icon={ home.icon } context="sidebar" />
				</span>

				{home.label}
			</Button>
		</li>
	)
} )

const UIColorPreferences = () => {
	const { application } = Env.use()
	const { appearance, window } = useSystemState()
	const { setBrightness, setWindow } = getSystemActions()
	const { origin } = window

	const onChangeOrigin = origin => setWindow( { ...window, origin } )

	return (
		<Form.Section label={ __( 'Preferences' ) }>
			{ 'beaver-builder' !== application && (
				<Form.Item label={ __( 'UI Brightness' ) } labelPlacement="beside">

					<Layout.Row gap={ 5 }>
						<Button
							isSelected={ 'light' === appearance.brightness }
							onClick={ () => setBrightness( 'light' ) }
						>
							<Icon.Sun />&nbsp;&nbsp;{__( 'Light' )}
						</Button>

						<Button
							isSelected={ 'dark' === appearance.brightness }
							onClick={ () => setBrightness( 'dark' ) }
						>
							<Icon.Moon />&nbsp;&nbsp;{__( 'Dark' )}
						</Button>
					</Layout.Row>
				</Form.Item>
			)}

			<Form.Item label={ __( 'Attach To' ) } labelPlacement="beside">
				<Layout.Row gap={ 5 }>
					<Button
						isSelected={ ! origin[0] }
						onClick={ () => onChangeOrigin( [ 0, 0 ] ) }
					>
						{ __( 'Left Edge' ) }
					</Button>

					<Button
						isSelected={ origin[0] }
						onClick={ () => onChangeOrigin( [ 1, 0 ] ) }
					>
						{ __( 'Right Edge' ) }
					</Button>
				</Layout.Row>
			</Form.Item>
		</Form.Section>
	)
}
