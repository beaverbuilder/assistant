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
				<UIColorPreferences />
				<DefaultsSection />
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
	const { appearance } = useSystemState()
	const { setBrightness } = getSystemActions()

	return (
		<Form.Section label={ __( 'Appearance' ) }>
			{ 'beaver-builder' !== application && (
				<Form.Item label={ __( 'Color Scheme' ) } labelPlacement="beside">
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
			) }
		</Form.Section>
	)
}

const DefaultsSection = () => {
	const { window } = useSystemState()
	const { setWindow } = getSystemActions()
	const onChangeOrigin = origin => setWindow( { ...window, origin } )
	const resetFrame = () => setWindow( { ...window, width: 560 } )

	return (
		<Form.Section label={ __( 'Panel' ) }>
			<Form.Item label={ __( 'Display On' ) } labelPlacement="beside">
				<Layout.Row gap={ 5 }>
					<Button
						isSelected={ ! window.origin[0] }
						onClick={ () => onChangeOrigin( [ 0, 0 ] ) }
					>
						{ __( 'Left Edge' ) }
					</Button>

					<Button
						isSelected={ window.origin[0] }
						onClick={ () => onChangeOrigin( [ 1, 0 ] ) }
					>
						{ __( 'Right Edge' ) }
					</Button>
				</Layout.Row>
			</Form.Item>
			<Form.Item label={ __( 'Panel Width' ) } labelPlacement="beside">
				<Button onClick={ resetFrame } >{ __( 'Reset' ) }</Button>
			</Form.Item>
		</Form.Section>
	)
}
