import React from 'react'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Layout } from 'assistant/ui'
import ItemContext from '../context'

export default () => {
	const { item } = ItemContext.use()
	return (
		<Layout.AspectBox ratio='16:9'>
			<Libraries.ItemThumb size='large' { ...item } />
		</Layout.AspectBox>
	)
}
