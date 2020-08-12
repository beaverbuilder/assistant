import React from 'react'
import { Libraries } from '@beaverbuilder/cloud-ui'
import * as formConfig from './form'

export default () => {
	return (
		<Libraries.ItemDetail
			formConfig={ formConfig }
		/>
	)
}
