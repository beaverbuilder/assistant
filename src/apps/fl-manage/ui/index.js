import React from 'react'
import { Button, Icon, App } from 'assistant/ui'
import { UP, DOWN } from '@wordpress/keycodes'
import LabelsScreen from './labels'
import './style.scss'

export { LabelsScreen }

export const AppList = ( { ...rest } ) => {
	return (
		<App.List
			className="fl-asst-manage-app-order-list"
			{ ...rest }
		>
			{ ( { handle, label, icon, moveUp, moveDown } ) => {
				return (
					<>
						<DragHandleBox>
							<Icon.DragHandle />
						</DragHandleBox>
						<Button
							to={ `/${ handle }` }
							onDragStart={ e => e.preventDefault() }
							appearance="transparent"
							size="lg"
							onKeyDown={ e => {
								if ( e.keyCode === DOWN ) {
									moveDown()
									e.preventDefault()
								}
								if ( e.keyCode === UP ) {
									moveUp()
									e.preventDefault()
								}
							} }
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
