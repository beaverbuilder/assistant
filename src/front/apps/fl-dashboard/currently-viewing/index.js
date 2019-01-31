import React, { useContext } from 'react'
import {
	ActionGroup,
	VerticalGroup,
	HorizontalGroup,
	ExpandedContents,
	PageViewContext
} from 'components'

import './style.scss'

export const CurrentlyViewing = () => {
	const { intro, name, theme, actions } = useContext( PageViewContext )

	return (
		<div className="fl-asst-currently-viewing">

			<VerticalGroup>
				<div className="fl-asst-pretitle">{intro}</div>
				<div className="fl-asst-title">{name}</div>
				{ actions && <ActionGroup actions={actions} appearance="muted" /> }
			</VerticalGroup>

			<ExpandedContents>
				<ThemeItem
					name={theme.name}
					screenshot={theme.screenshot}
					version={theme.version}
					team={theme.team}
				/>
			</ExpandedContents>
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
