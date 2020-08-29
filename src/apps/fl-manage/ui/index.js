import React from 'react'
import { Button, Icon, App } from 'assistant/ui'
import './style.scss'

export const AppList = ( { ...rest } ) => {

	return (
		<App.List
			className="fl-asst-manage-app-order-list"
			{ ...rest }
		>
			{ ( { handle, label, icon } ) => {
				return (
					<>
						<DragHandleBox>
							<Icon.DragHandle />
						</DragHandleBox>
						<Button
							to={ `/${ handle }` }
							onDragStart={ e => e.preventDefault() }
							appearance="transparent"
						>
							<span className="fl-asst-item-icon">
								<Icon.Safely
									icon={ icon }
									context="manage"
									isSelected={ false }
								/>
							</span>

							{label}
						</Button>
					</>
				)
			} }
		</App.List>
	)
}

export const DragHandleBox = props => (
	<div
		className="fl-asst-app-drag-handle-box"
		{ ...props }
	/>
)
