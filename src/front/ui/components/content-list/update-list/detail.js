import React, { useContext } from 'react'
import { autop } from '@wordpress/autop'
import { __ } from '@wordpress/i18n'
import {
	ContentFrame,
	ContentItem,
	ContentListDetail,
	Heading,
	Padding,
	Photo,
	ScreenHeader,
	TagGroup,
	Tag,
	Title,
	ViewContext,
} from 'components'

export const UpdateDetail = () => {
	const {
		banner,
		content,
		meta,
		title,
		thumbnail,
	} = useContext( ViewContext )

	const headerTitle = (
		<ContentItem
			thumbnail={ thumbnail }
			title={ <strong>{ title }</strong> }
			meta={ meta }
		/>
	)

	return (
		<ContentListDetail className='fl-asst-update-detail'>

			<Title>{__( 'Update' )}</Title>

			{ banner && <Photo src={banner} style={ { marginTop: 'var(--fl-asst-base-padding)' } } /> }

			<ScreenHeader title={ headerTitle }>
				<TagGroup appearance='muted'>
					<Tag>Update</Tag>
				</TagGroup>
			</ScreenHeader>

			<Padding top={ false }>
				<Heading>{ __( 'Description' ) }</Heading>
				<ContentFrame dangerouslySetInnerHTML={ { __html: autop( content ) } } />
			</Padding>

		</ContentListDetail>
	)
}
