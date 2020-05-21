import React from 'react'
import { Layout, Icon } from 'assistant/ui'
import AppsWidget from './apps'
import RecentContentWidget from './recent-content'
import CurrentlyViewingWidget from './currently-viewing'
import SubscribeWidget from './subscribe'
import './style.scss'

const Cap = () => {
	return (
		<Layout.Row padY={ true }>
			<Icon.Pencil />
		</Layout.Row>
	)
}

const Widgets = () => {
	return (
		<ul className="fl-asst-widget-list">
			<li>
				<Layout.Box style={ { paddingTop: 0 } }>
					<CurrentlyViewingWidget />
				</Layout.Box>
			</li>
			<li>
				<Layout.Box style={ { paddingTop: 0 } }>
					<RecentContentWidget />
				</Layout.Box>
			</li>
			<li>
				<Layout.Box style={ { paddingTop: 0 } }>
					<AppsWidget />
				</Layout.Box>
			</li>
			<li>
				<Layout.Box style={ { paddingTop: 0 } }>
					<SubscribeWidget />
				</Layout.Box>
			</li>
			<li>
				<Cap />
			</li>
		</ul>
	)
}

export default Widgets
