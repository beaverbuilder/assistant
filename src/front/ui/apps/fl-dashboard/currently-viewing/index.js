import React from 'react'
import { HorizontalGroup, VerticalGroup, Padding, Icon } from 'components'
import './style.scss'

export const CurrentlyViewing = props => {

	return (
		<div className="fl-asst-currently-viewing">
			<HorizontalGroup>
				<Padding>
					<Icon />
				</Padding>
				<VerticalGroup>
					<div className="fl-asst-pretitle">You Are Currently Viewing Page</div>
					<div className="fl-asst-title">That Page You're Currently View, You Know The One</div>
				</VerticalGroup>
			</HorizontalGroup>
		</div>
	)
}
