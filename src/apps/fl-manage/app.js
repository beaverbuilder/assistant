import React, { memo } from 'react'
import { __ } from '@wordpress/i18n'
import {
	App,
	Page,
	Icon,
	Button,
	Form,
	Layout,
	Env,
	List,
} from 'assistant/ui'
import { useAppList, useSystemState, getSystemActions } from 'assistant/data'
import AppIcon from './icon'
import './style.scss'

export default props => (
	<App.Config
		pages={ { default: MainScreen } }
		{ ...props }
	/>
)

const MainScreen = () => {
	//const history = useHistory()
	//const goToRoot = () => history.go( -history.length )
	return (
		<Page
			title={ __( 'Apps & Settings' ) }
			shouldShowBackButton={ false }
			icon={ <AppIcon context="sidebar" /> }
		>
			<Form>
				<Page.Section>
					<p style={ { marginTop: 0 } }>{__( 'You can reorder the apps below. The top 5 will appear in the sidebar for quick access.' )}</p>

					<AppList />

				</Page.Section>

				<UIColorPreferences />
			</Form>

		</Page>
	)
}

const AppList = memo( () => {
	const apps = useAppList()
	const { resetAppOrder } = getSystemActions()

	return (
		<List.Sortable
			className="fl-asst-manage-app-order-list"
			items={ apps }
			setItems={ items => {
				const keys = items.map( item => item.handle )
				resetAppOrder( keys )
			} }
		>
			{ app => {
				const {
					handle,
					label,
					icon,
					isFirst,
					isLast,
					moveUp,
					moveDown,
				} = app
				const location = {
					pathname: `/${handle}`,
					state: app,
				}

				const Test = () => (
					<div>Problem!</div>
				)

				return (
				<>
					<Button
						to={ location }
						appearance="transparent"
						style={ {
							flex: '1 1 auto',
							marginRight: 'auto',
							justifyContent: 'flex-start',
						} }
						onDragStart={ e => {
							// prevent link dragging behavior
							e.preventDefault()
						} }
					>
						<span className="fl-asst-item-icon">
							<Icon.Safely icon={icon} context="sidebar" />
						</span>

						{label}
					</Button>

					<span className="fl-asst-item-reorder-buttons">
						<span className="fl-asst-button-space">
							{ ! isFirst && (
								<Button
									onClick={ moveUp }
									appearance="transparent"
									title={ __( 'Move Up' ) }
								>
									<Icon.UpCaret />
								</Button>
							)}
						</span>
						<span className="fl-asst-button-space">
							{ ! isLast && (
								<Button
									onClick={ moveDown }
									appearance="transparent"
									title={ __( 'Move Down' ) }
								>
									<Icon.DownCaret />
								</Button>
							)}
						</span>
					</span>
				</>
				)
			}}
		</List.Sortable>
	)
} )

const UIColorPreferences = () => {
	const { application } = Env.use()
	const { appearance, window } = useSystemState()
	const { setBrightness, setWindow } = getSystemActions()
	const { origin } = window

	const origins = {
		'0-0': __( 'Top Left' ),
		'0-1': __( 'Bottom Left' ),
		'1-0': __( 'Top Right' ),
		'1-1': __( 'Bottom Right' )
	}
	const onChangeOrigin = value => {
		const v = value.split( '-' )
		setWindow( {
			...window,
			origin: [ parseInt( v[0] ), parseInt( v[1] ) ]
		} )
	}
	return (
		<Form.Section label={ __( 'Preferences' ) }>
			{ 'beaver-builder' !== application && (
				<Form.Item label={ __( 'UI Brightness' ) } labelPlacement="beside">

					<Layout.Row gap={ 5 }>
						<Button
							isSelected={ 'light' === appearance.brightness }
							onClick={ () => setBrightness( 'light' ) }
						>
							<Icon.Brightness />&nbsp;&nbsp;{__( 'Light' )}
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

			<Form.Item label={ __( 'Anchor Pane To' ) } labelPlacement="beside">
				<Form.SelectItem value={ origin.join( '-' ) } options={ origins } onChange={ onChangeOrigin } />
			</Form.Item>
		</Form.Section>
	)
}
