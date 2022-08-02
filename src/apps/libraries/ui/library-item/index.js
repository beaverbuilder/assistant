import React from 'react'
import { Libraries } from '@beaverbuilder/cloud-ui'
import * as formConfig from './form'
import './style.scss' // TEMP! TODO: Move to cloud-ui

export default () => {
	return (
		<div
			style={ {
				display: 'flex',
				position: 'absolute',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				width: '100%'
			} }
		>
			<Libraries.ItemDetail
				formConfig={ formConfig }
			/>
		</div>
	)
}
