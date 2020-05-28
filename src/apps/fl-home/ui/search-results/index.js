import React from 'react'
import { List, Layout, Icon } from 'assistant/ui'
import { Card } from 'home/ui'
import { getListSectionConfig, getListItemConfig, getRequestConfig } from '../../config'
import './style.scss'

const SectionCard = ( { children, label, ...rest } ) => {
	return (
		<li style={ { paddingBottom: 20 } }>
			<Card
				title={ label }
				className="fl-asst-search-results-card"
				{ ...rest }
			>{ children }</Card>
		</li>
	)
}

const Results = ( {
	isLoading = false,
	items,
	keyword,
	baseURL
} ) => {

	if ( isLoading ) {
		return (
			<List.Loading />
		)
	}

	const { config } = getRequestConfig( { keyword } )

	return (
		<Layout.Box padY={ false }>
			<List
				items={ items }
				getSectionProps={ ( section, defaultProps ) => {
					return getListSectionConfig( {
						section,
						defaultProps,
						keyword,
						baseURL,
					} )
				} }
				getItemProps={ ( item, defaultProps ) => {
					return getListItemConfig( {
						item,
						defaultProps,
						config,
						baseURL,
					} )
				} }
				getItemComponent={ ( item, isSection, defaultComponent ) => {
					return isSection ? SectionCard : defaultComponent
				} }
			/>
			<Layout.Row padY={ true }>
				<Icon.Pencil />
			</Layout.Row>
		</Layout.Box>
	)
}

export default Results
