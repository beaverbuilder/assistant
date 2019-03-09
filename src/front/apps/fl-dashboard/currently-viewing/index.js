import React, { useContext } from 'react'
import {
	ActionGroup,
	VerticalGroup,
	HorizontalGroup,
	ExpandedContents,
	PageViewContext,
	Padding,
} from 'components'
import Truncate from 'react-truncate'
import './style.scss'

export const CurrentlyViewing = () => {
	const { intro, name, theme, actions } = useContext( PageViewContext )
	return (
		<div className="fl-asst-currently-viewing">
			<Padding>
				<VerticalGroup>
					<div className="fl-asst-pretitle">{intro}</div>
					<div className="fl-asst-title">
						<Truncate lines={2}>{name}</Truncate>
					</div>
					{ actions && <ActionGroup actions={actions} appearance="muted" /> }
				</VerticalGroup>
			</Padding>
		</div>
	)
}

const ThemeItem = ( { name, screenshot, version, team } ) => {
	return (
		<HorizontalGroup className="fl-asst-theme-item">
			<VerticalGroup className="fl-asst-theme-item-details">
				<div className="fl-asst-pretitle fl-asst-current-theme-pretitle">Current Theme</div>
				<div className="fl-asst-title">{name} {version && <span className="fl-asst-theme-item-version">v{version}</span>}</div>
				{ team && <div className="fl-asst-pretitle">By {team}</div> }
			</VerticalGroup>
			<VerticalGroup className="fl-asst-theme-item-screenshot">
				<img src={screenshot} />
			</VerticalGroup>
		</HorizontalGroup>
	)
}
