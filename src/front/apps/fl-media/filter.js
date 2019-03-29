import React, { Fragment } from 'react'
import { __ } from '@wordpress/i18n'
import { useAppState, getAppActions, useSystemState } from 'store'
import { Header, NavBar, Title } from 'components'

export const MediaListFilter = () => {
	const { filter } = useAppState()
	const { setType } = getAppActions()
	const { typeTags } = getFilterTags()
	const { type } = filter
	let title = __( 'Media' )

	const navItems = []
	typeTags.map( tag => {

		if ( tag.count < 1 ) {
			return
		}

		if ( type === tag.value ) {
			title = tag.label
		}
		navItems.push( {
			children: tag.label,
			onClick: () => setType( tag.value ),
			isSelected: type === tag.value
		} )
	} )

	if ( '' === type ) {
		title = __( 'Media' )
	}

	return (
		<Fragment>
			<Header>
				<NavBar items={navItems} />
			</Header>
			<Title actions={<TitleActions />}>{title}</Title>
		</Fragment>
	)
}

const TitleActions = () => {
	return (
		<Fragment></Fragment>
	)
}

export const getFilterTags = () => {
	const { counts } = useSystemState()

	const typeTags = [
		{
			label: __( 'All Media' ),
			value: '',
		},
		{
			label: __( 'Images' ),
			value: 'image',
			count: counts[ 'attachment/image' ] || '0',
		},
		{
			label: __( 'Videos' ),
			value: 'video',
			count: counts[ 'attachment/video' ] || '0',
		},
		{
			label: __( 'Audio' ),
			value: 'audio',
			count: counts[ 'attachment/audio' ] || '0',
		},
		{
			label: __( 'Documents' ),
			value: 'application',
			count: counts[ 'attachment/application' ] || '0',
		}
	]

	return { typeTags }
}
