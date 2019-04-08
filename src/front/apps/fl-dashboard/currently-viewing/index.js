import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import {
	ActionGroup,
	VerticalGroup,
	PageViewContext,
	Padding,
	Button,
	Icon,
	Widget,
	StackContext,
	PostListDetail,
} from 'components'
import Truncate from 'react-truncate'
import { useSystemState } from 'store'
import './style.scss'

export const CurrentlyViewing = () => {
	const { intro, name, actions } = useContext( PageViewContext )
	return (
		<div className="fl-asst-currently-viewing">
			<Padding top={20} bottom={20}>
				<VerticalGroup>
					<div className="fl-asst-pretitle">{intro}</div>
					<div className="fl-asst-title">
						<Truncate lines={2}>{name}</Truncate>
					</div>
					<div style={{ marginTop: 10 }}>
						{ actions && <ActionGroup actions={actions} appearance="muted" /> }
					</div>
				</VerticalGroup>
			</Padding>
		</div>
	)
}

export const TilesWidget = () => {
	const {
		intro,
		name,
		actions
	} = useContext( PageViewContext )
	const { present } = useContext( StackContext )
	const { counts } = useSystemState()
	const {
		'content/post': postCount = 0,
		'content/page': pageCount = 0,
		'role/total': userCount = 0,
	} = counts

	const presentCurrentItem = () => {
		present( {
			label: __( 'Edit Post' ),
			content: <PostListDetail />,
			appearance: 'form',
			shouldShowTitle: false,
			context: {},
		} )
	}

	return (
		<Widget className="fl-asst-tiles-widget">
			<ul className="fl-asst-tile-list">
				<li className="fl-asst-viewing-tile">
					<div className="fl-asst-viewing-info">
						<div className="fl-asst-viewing-text">
							<div className="fl-asst-pretitle">{intro}</div>
							<div className="fl-asst-title">
								<Truncate lines={2}>{name}</Truncate>
							</div>
						</div>
						<div className="fl-asst-viewing-action">
							<Button
								appearance="transparent"
								onClick={presentCurrentItem}
							>
								<Icon name="forward-arrow" />
							</Button>
						</div>
					</div>
					<div className="fl-asst-tile-toolbar">
						{ actions.map( ( item, i ) => {
							const { label, href } = item
							return (
								<Button
									key={i}
									href={href}
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
