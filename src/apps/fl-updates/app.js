import React, { useContext, useEffect, useState } from 'fl-react'
import { getWpRest } from 'assistant/utils/wordpress'
import { __ } from 'assistant/i18n'
import { App, Page, Button, List, Nav } from 'assistant/ui'
import {
	useSystemState,
	useAppState,
	getAppActions,
	getUpdaterStore,
	getUpdaterActions,
	getUpdaterSelectors
} from 'assistant/data'

export const UpdatesApp = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}/` } component={ UpdatesMain }/>
		<Nav.Route path={ `${match.url}/update/:key` } component={ Page.Update }/>
	</Nav.Switch>
)

const UpdatesMain = () => {
	const updater = getUpdaterStore()
	const { setUpdateQueueItems } = getUpdaterActions()
	const { counts } = useSystemState()
	const { updatingAll } = useAppState( 'fl-updates' )
	const { setUpdatingAll } = getAppActions( 'fl-updates' )
	const { handle } = useContext( App.Context )
	const { getContent } = getWpRest()

	useEffect( () => {
		const unsubscribe = updater.subscribe( () => {
			const { updateQueue } = updater.getState()
			if ( ! Object.values( updateQueue ).length ) {
				setUpdatingAll( false )
			}
		} )
		return () => unsubscribe()
	}, [] )

	const updateAll = () => {
		setUpdatingAll( true )
		getContent( 'updates' ).then( response => {
			const { items } = response.data
			//setUpdateQueue( items )
			const test = [ items[0], items[1], items[2] ]
			setUpdateQueueItems( test )
		} ).catch( error => {
			console.log( error )
			setUpdatingAll( false )
			alert( __( 'Something went wrong. Please try again.' ) )
		} )
	}

	const HeaderActions = () => {
		if ( updatingAll ) {
			return (
				<Button.Loading>
					{ __( 'Updating' ) }
				</Button.Loading>
			)
		}
		return (
			<Button onClick={ updateAll }>
				{ __( 'Update All' ) }
			</Button>
		)
	}

	return (
		<Page shouldPadSides={ false } headerActions={ <HeaderActions /> }>
		<Page.Toolbar>
			<Button.Group>
				<Button>{ counts['update/plugins'] } { __( 'Plugins' ) }</Button>
				<Button>{ counts['update/themes'] } { __( 'Themes' ) }</Button>
			</Button.Group>
		</Page.Toolbar>
			<List.Updates
				getItemProps={ ( item, defaultProps ) => ( {
					...defaultProps,
					to: {
						pathname: `/${handle}/update/${item.key}`,
						state: { item }
					},
				} ) }
			/>
		</Page>
	)
}

UpdatesApp.Icon = ( { windowSize, context } ) => {
	let size = 32
	if ( 'app-list' === context ) {
		size = 'mini' === windowSize ? 40 : 48
	}
	return (
		<svg width={ size } viewBox="0 0 42 36" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<g transform="translate(-4.000000, -7.000000)" fill="currentColor" fillRule="nonzero">
				<path d="M25.0090332,7.32324219 C34.2770996,7.32324219 42.0095215,14.6040039 42.6237793,23.7998047 L44.8278809,23.7998047 C45.8757324,23.7998047 46.255127,24.8476562 45.6589355,25.6245117 L42.4069824,29.7436523 C41.6843262,30.6469727 40.7810059,30.6469727 40.076416,29.7436523 L36.8244629,25.6245117 C36.2102051,24.8476562 36.607666,23.7998047 37.6374512,23.7998047 L40.2570801,23.7998047 C39.6608887,15.8686523 33.0847168,9.671875 25.0090332,9.671875 C20.5827637,9.671875 16.5178223,11.496582 13.8259277,14.5498047 C13.3381348,15.0556641 12.6335449,15.1459961 12.145752,14.7124023 C11.6398926,14.2788086 11.5856934,13.5380859 12.145752,12.9599609 C15.3977051,9.54541016 19.9504395,7.32324219 25.0090332,7.32324219 Z M5.17211914,26.1665039 C4.14233398,26.1665039 3.74487305,25.1005859 4.35913086,24.3237305 L7.59301758,20.2226562 C8.31567383,19.3193359 9.21899414,19.3193359 9.94165039,20.2226562 L13.1755371,24.3237305 C13.7897949,25.1005859 13.4104004,26.1665039 12.3625488,26.1665039 L9.74291992,26.1665039 C10.3391113,34.0795898 16.9333496,40.2763672 25.0090332,40.2763672 C29.4353027,40.2763672 33.4460449,38.4155273 36.1921387,35.4165039 C36.6618652,34.9106445 37.3664551,34.8022461 37.8723145,35.2358398 C38.3781738,35.6875 38.4143066,36.4282227 37.8723145,36.9882812 C34.6564941,40.4570312 30.0495605,42.6430664 25.0090332,42.6430664 C15.7229004,42.6430664 7.99047852,35.3442383 7.3762207,26.1665039 L5.17211914,26.1665039 Z" id="update"></path>
			</g>
		</svg>
	)
}
