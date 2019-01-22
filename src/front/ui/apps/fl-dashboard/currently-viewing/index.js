import React, { useContext } from 'react'
import { VerticalGroup, Padding, Icon, CurrentPageViewContext } from 'components'
import './style.scss'

export const CurrentlyViewing = props => {
	const { name, intro } = useContext(CurrentPageViewContext)

	return (
		<div className="fl-asst-currently-viewing">
			<VerticalGroup>
				<div className="fl-asst-pretitle">{intro}</div>
				<div className="fl-asst-title">{name}</div>
			</VerticalGroup>
		</div>
	)
}
