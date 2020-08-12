import React from 'react'
import { Libraries } from '@beaverbuilder/cloud-ui'
import LibraryContext from '../library/context'
import * as formConfig from './form'

export default () => {
	const context = LibraryContext.use()
	return (
		<Libraries.ItemDetail
			libraryContext={ context }
			formConfig={ formConfig }
		/>
	)
}
