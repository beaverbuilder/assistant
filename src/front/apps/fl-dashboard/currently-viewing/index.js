import React, { useContext } from 'react'
import {
	ActionGroup,
	VerticalGroup,
	PageViewContext,
	Padding,
} from 'components'
import Truncate from 'react-truncate'
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
