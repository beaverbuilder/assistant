import React, { useState } from 'react'
import { Redirect, Switch, Route, useHistory } from 'react-router-dom'
import { Selection } from '@beaverbuilder/fluid'
import { useSystemState } from 'assistant/data'
import { __ } from '@wordpress/i18n'
import { Page, Layout } from 'assistant/ui'
import { Library, Libraries } from '../libraries/ui'
import { CommunityApp } from '@beaverbuilder/cloud-ui'

export default ( { baseURL } ) => {
	const history = useHistory()
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )

	// console.log("isCloudConnected",isCloudConnected)

	if ( ! isCloudConnected ) {
		history.replace( '/fl-cloud-connect' )
		return null
	}

	return (
		<Selection.Provider>
			<Main />
		</Selection.Provider>
	)
}

const Main = () => {

	const [ activeTab, setActiveTab ] = useState( 'fl_library' )

	const tabs = [
		{
			handle: 'fl_library',
			path: '/bbapp/tab/fl_library',
			label: 'Libraries',
			component: <Libraries />,
		},
		{
			handle: 'fl_community',
			path: '/bbapp/tab/fl_community',
			label: 'Community',
			component: () => <CommunityApp />,
		}
	]

	const Header = () => (
		<Layout.Tabs
			tabs={ tabs.map(tab => ({
				...tab,
				onClick: () => setActiveTab(tab.handle),
				isActive: activeTab === tab.handle,
			})) }
			shouldHandleOverflow={ true }
		/>
	)

	return (
		<Page
			id="fl-asst-bb-integration"
			title={ __( 'Template Cloud' ) }
			padY={ false }
			header={ <Header /> }
			topContentStyle={ { border: 'none' } }
			shouldScroll={ false }
			shouldShowBackButton={ false }
			showAsRoot={ true }
		>
			{ tabs.find( tab => tab.handle === activeTab )?.component }
		</Page>
	)
}
