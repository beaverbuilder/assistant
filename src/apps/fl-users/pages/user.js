import React, { useEffect, useState, useMemo } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig, useSystemState, getSystemActions } from 'assistant/data'
import { Page, Form, Button, Nav } from 'assistant/ui'
import { getWpRest } from 'assistant/utils/wordpress'
import { CancelToken } from 'axios'

import { Summary } from '../components/user/summary'

// Original Tabs
//import { GeneralTab } from '../components/user/general'
//import { PreferencesTab } from '../components/user/preferences'
import { PostsTab } from '../components/user/posts'

export const User = ( { location, match, history } ) => {
	const { window } = useSystemState()
	const { setWindow } = getSystemActions()

	const defaultUser = {
		id: null,
		showAdminBar: true,
		showInAdmin: true,
		showWhenHidden: 'undefined' !== typeof window.hiddenAppearance ? window.hiddenAppearance : '',

		content: '',
		date: new Date(),
		displayName: '',
		editUrl: '',
		email: '',
		firstName: '',
		lastName: '',
		nicename: '',
		nickname: '',
		thumbnail: '',
		title: '',
		url: '',
		username: '',
		website: '',

		// Should probably rename these
		pages: 0,
		posts: 0,
	}
	const item = 'undefined' !== typeof location.state && 'undefined' !== typeof location.state.item ?
		{ ...defaultUser, ...location.state.item } :
		defaultUser

	const { currentUser } = getSystemConfig()

	const [ loading, setLoading ] = useState( false )
	const [ user, setUser ] = useState( item )

	const isYou = currentUser.id === user.id


	const { form, useFormContext, setValues } = Form.useForm( {
		firstName: {
			label: __( 'First Name' ),
			labelPlacement: 'beside',
		},
		lastName: {
			label: __( 'Last Name' ),
			labelPlacement: 'beside',
		},
		email: {
			label: __( 'Email' ),
			labelPlacement: 'beside',
		},
		displayName: {
			label: __( 'Display Name' ),
			labelPlacement: 'beside',
			disabled: true,
		},
		showAdminBar: {
			label: __( 'Admin Bar' ),
			labelPlacement: 'beside',
			content: __( 'Show Admin Bar?' ),
		},
		showInAdmin: {
			label: __( 'Show in Admin' ),
			content: __( 'Show Assistant UI in the WordPress Admin?' )
		},
		showWhenHidden: {
			label: __( 'Show when hidden' ),
			labelPlacement: 'beside',
			options: {
				'': __( 'Button (Default)' ),
				'admin_bar': __( 'Admin Bar Item' )
			},
			onChange: value => {
				if ( value !== window.hiddenAppearance ) {
					setWindow( { ...window, hiddenAppearance: value } )
				}
			}
		}
	},
	{}, user )


	const source = CancelToken.source()

	/**
	 * TODO: Revisit this when we look at dynamically loading detail data.
	 */
	// const loadUser = async() => {
	// 	setLoading( true )
	// 	const config = { cancelToken: source.token }
	// 	const response = await getWpRest().users().findById( match.params.id, config )
	// 	setUser( response.data )
	//
	// 	// Update form handler
	// 	setValues( response.data )
	//
	// 	setLoading( false )
	// }
	//
	// // Load user when component first mounts
	// useEffect( () => {
	// 	loadUser()
	// 	return () => source.cancel()
	// }, [] )


	// Screen Tabs
	const setTab = path => history.replace( path, location.state )

	const tabProps = {
		user,
		location,
		match,
		history,
	}

	const sectionProps = {
		user,
		isYou,
		useForm: useFormContext,
	}

	const tabs = [
		{
			path: match.url,
			label: __( 'General' ),
			exact: true,
			component: () => (
				<Page.RegisteredSections
					location={ { type: 'user', tab: '' } }
					data={ sectionProps }
				/>
			),
		},
		{
			path: match.url + '/preferences',
			label: __( 'Preferences' ),
			component: () => (
				<Page.RegisteredSections
					location={ { type: 'user', tab: 'preferences' } }
					data={ sectionProps }
				/>
			),
			shouldInclude: isYou,
		},
		{
			path: match.url + '/posts',
			label: __( 'Posts' ),
			component: () => ( <PostsTab { ...tabProps } /> ),
			shouldInclude: 0 < user.posts
		}
	].filter( tab => false !== tab.shouldInclude )

	// Don't show tab buttons for only 1 tab
	const TabButtons = () => useMemo( () =>  1 < tabs.length && (
		<Page.Pad style={ { display: 'flex', justifyContent: 'center' } } bottom={ false }>
			<Button.Group>
				{tabs.map( ( { label, path, shouldInclude = true }, i ) => shouldInclude && (
					<Button key={ i }
						onClick={ () => setTab( path ) }
						isSelected={ path === location.pathname }
					>{label}</Button>
				) )}
			</Button.Group>
		</Page.Pad>
	), [] )

	return (
		<Page shouldPadSides={ false }
			title={ isYou ? __( 'Your Profile' ) : __( 'Edit User' ) }>

			{ loading && <p>{__( 'Loading...' )}</p> }

			<Summary user={ user }/>

			<TabButtons />

			<Form { ...form }>
				{ useMemo( () => (
					<Nav.Switch>
						{tabs.map( ( tab, i ) => <Nav.Route key={ i } { ...tab } /> )}
					</Nav.Switch>
				), [] )}
			</Form>

		</Page>
	)
}
