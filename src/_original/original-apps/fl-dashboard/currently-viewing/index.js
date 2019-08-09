import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import {
	PageViewContext,
	Button,
	Widget,
} from 'components'
import Truncate from 'react-truncate'
import { useSystemState } from 'store'
import './style.scss'

export const TilesWidget = () => {
	const {
		intro,
		name,
		actions
	} = useContext( PageViewContext )
	const { counts } = useSystemState()
	const {
		'content/post': postCount = 0,
		'content/page': pageCount = 0,
		'role/total': userCount = 0,
	} = counts

	return (
		<Widget className="fl-asst-tiles-widget">
			<ul className="fl-asst-tile-list">
				<li className="fl-asst-viewing-tile">
					<div className="fl-asst-viewing-info">
						<div className="fl-asst-viewing-text">
							<div className="fl-asst-pretitle">{intro}</div>
							<div className="fl-asst-title">
								<Truncate lines={ 2 }>{name}</Truncate>
							</div>
						</div>
					</div>
					<div className="fl-asst-tile-toolbar">
						{ actions.map( ( item, i ) => {
							const { label, href } = item
							return (
								<Button
									key={ i }
									href={ href }
									appearance="transparent"
								>{label}</Button>
							)
						} )}
					</div>
				</li>
				<li className="fl-asst-stat-tile">
					<span className="fl-asst-stat-count">{postCount}</span>
					<span className="fl-asst-stat-label">{__( 'Posts' )}</span>
				</li>
				<li className="fl-asst-stat-tile">
					<span className="fl-asst-stat-count">{pageCount}</span>
					<span className="fl-asst-stat-label">{__( 'Pages' )}</span>
				</li>
				<li className="fl-asst-stat-tile">
					<span className="fl-asst-stat-count">{userCount}</span>
					<span className="fl-asst-stat-label">{__( 'Users' )}</span>
				</li>
			</ul>
		</Widget>
	)
}
