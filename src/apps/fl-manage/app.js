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
import {
	useSystemState,
	getSystemActions,
	getSystemSelectors,
	getSystemConfig
} from 'assistant/data'
import AppIcon from './icon'
import { DragHandleBox, AppList, LabelsScreen } from './ui'
import './style.scss'

export default props => (
	<App.Config
		pages={ {
			default: MainScreen,
			'labels': LabelsScreen
		} }
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
				<DefaultsSection />
				<LabelsSection />
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

const DefaultsSection = () => {
	const { application } = Env.use()
	const { frameDefaults } = getSystemConfig()
	const { window, appearance } = useSystemState()
	const { setWindow, setBrightness } = getSystemActions()
	const onChangeOrigin = origin => setWindow( { ...window, origin } )
	const resetFrame = () => setWindow( { ...window, width: frameDefaults.defaultWidth } )

	return (
		<Form.Section label={ __( 'UI Appearance' ) }>
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
			<Form.Item label={ __( 'Display Panel On' ) } labelPlacement="beside">
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
				<Button onClick={ resetFrame } >{ __( 'Reset To Default' ) }</Button>
			</Form.Item>
		</Form.Section>
	)
}

const LabelsSection = () => {
	return (
		<Form.Section label={ __( 'Manage Labels' ) }>
			<LabelsScreen />
		</Form.Section>
	)
}
