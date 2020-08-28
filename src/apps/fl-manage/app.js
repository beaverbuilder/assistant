import React, { memo, useState, useEffect } from 'react'
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
	List,
} from 'assistant/ui'
import { useSystemState, getSystemActions, getSystemSelectors, useAppList } from 'assistant/data'
import AppIcon from './icon'
import useAppOrder from './use-app-order'
import { DragHandleBox, TestList } from './ui'
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


					<TestList />
				</Page.Section>

				<UIColorPreferences />
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

const AppList = memo( () => {
	const { apps: initialApps } = useSystemState()
	//const initialApps = useAppList()
	//const { resetAppOrder } = getSystemActions()
	const { apps, setApps } = useAppOrder()

	const move = ( arr, from, to ) => arr.splice( to, 0, arr.splice( from, 1 )[0] )

	const moveItem = ( handle, to ) => {
		//const from = appOrder.findIndex( app => handle === app.handle )
		//setApps( move( apps, from, to ) )
	}

	return (
		<List.Sortable
			className='fl-asst-manage-app-order-list'
			items={ apps }
			setItems={ apps => setApps( apps ) }
			onSortEnd={ apps => {
				console.log('end', apps )
				//resetAppOrder( order )
			} }
			before={ <Home /> }
		>
			{ ( app, i ) => {
				const {
					handle,
					label,
					icon,
					isFirst = false,
					isLast = false,
				} = app

				const location = {
					pathname: `/${handle}`
				}
				const moveUp = () => moveItem( handle, i - 1 )
				const moveDown = () => moveItem( handle, i + 1 )

				return (
					<>
						<DragHandleBox>
							<Icon.DragHandle />
						</DragHandleBox>
						<Button
							to={ location }
							appearance="transparent"
							style={ {
								flex: '1 1 auto',
								marginRight: 'auto',
								justifyContent: 'flex-start',
							} }
							onDragStart={ e => e.preventDefault() }
						>
							<span className="fl-asst-item-icon">
								<Icon.Safely icon={ icon } context="manage" isSelected={ false } />
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
										<Icon.CaretUp />
									</Button>
								) }
							</span>
							<span className="fl-asst-button-space">
								{ ! isLast && (
									<Button
										onClick={ moveDown }
										appearance="transparent"
										title={ __( 'Move Down' ) }
									>
										<Icon.CaretDown />
									</Button>
								) }
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

			<Form.Item label={ __( 'Anchor Pane To' ) } labelPlacement="beside">
				<Form.SelectItem value={ origin.join( '-' ) } options={ origins } onChange={ onChangeOrigin } />
			</Form.Item>
		</Form.Section>
	)
}
