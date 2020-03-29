import React from 'react'
import { __ } from '@wordpress/i18n'
import { List, Page } from 'assistant/ui'

export default () => {
	const items = [
		{ label: 'Beaver Builder', description: 'https://www.wpbeaverbuilder.com' },
		{ label: 'Another Site', description: 'https://www.anothersite.com' },
		{ label: 'Lorem Ipsum', description: 'https://www.lorem ipsum.com' }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			description: item.description,
			shouldAlwaysShowThumbnail: true
		}
	}

	return (
		<Page
			className='fl-asst-sites-layout'
			title={ __( 'Sites' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<List
				items={ items }
				getItemProps={ getItemProps }
			/>
		</Page>
	)
}
