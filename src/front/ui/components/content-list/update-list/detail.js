import React, { useContext } from 'react'
import { autop } from '@wordpress/autop'
import { __ } from '@wordpress/i18n'
import {
	ContentFrame,
	ContentItem,
	ContentListDetail,
	Heading,
	Icon,
	Padding,
	Photo,
	ScreenHeader,
	TagGroup,
	Tag,
	ViewContext,
} from 'components'

export const UpdateDetail = () => {
	const {
		banner,
		content,
		meta,
		title,
		thumbnail,
		updating,
		updatingText,
		updateClicked,
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

			{ banner && <Photo src={banner} style={ { marginTop: 'var(--fl-asst-base-padding)' } } /> }

			<ScreenHeader title={ headerTitle }>
				<TagGroup appearance='muted'>
					<Tag className='fl-asst-update-button' onClick={ updateClicked }>
						{ updating && <Icon name='small-spinner' /> }
						{ updatingText }
					</Tag>
				</TagGroup>
			</ScreenHeader>

			<Padding top={ false }>
				<Heading>{ __( 'Description' ) }</Heading>
				<ContentFrame dangerouslySetInnerHTML={ { __html: autop( content ) } } />
			</Padding>

		</ContentListDetail>
	)
}
