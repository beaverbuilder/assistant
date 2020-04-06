import React, { useContext } from 'react'
import { getSystemActions, getSystemConfig, useSystemState, getSystemSelectors } from 'data'
import { Button, Icon, App, List, Layout } from 'ui'
import { Dashicon } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import './style.scss'

const { registerSection } = getSystemActions()

registerSection( 'fl-asst-quick-actions', {
	location: {
		type: 'home',
	},
	padX: false,
	render: () => {
		const { environment } = useContext( App.Context )
		const { adminURLs } = getSystemConfig()

		const dashURL = 'undefined' !== typeof adminURLs.dashboard ? adminURLs.dashboard : '/wp-admin'

		const { appearance } = useSystemState()
		const { setBrightness } = getSystemActions()
		const toggleBrightness = () => 'light' === appearance.brightness ? setBrightness( 'dark' ) : setBrightness( 'light' )

		return (
			<div className="fl-asst-quick-actions">
				<Button to="/fl-search" appearance="elevator" title={ __( 'Search' ) }>
					<Icon.Search />
				</Button>
				<Button href={ dashURL } appearance="elevator" title={ __( 'Go to Admin' ) }>
					<Dashicon icon="wordpress" />
				</Button>
				{ 'beaver-builder' !== environment && (
					<Button onClick={ toggleBrightness } appearance="elevator" title={ __( 'Toggle UI Brightness' ) }>
						{ 'light' === appearance.brightness ? <Icon.Moon /> : <Icon.Brightness /> }
					</Button>
				)}
				<Button to={ {
					pathname: '/fl-content/post/new',
					state: { detailBaseUrl: '/fl-content/post' }
				} } appearance="elevator" title={ __( 'Create Post' ) }>
					<Icon.Plus />
				</Button>
			</div>
		)
	},
} )

registerSection( 'fl-home-currently-viewing', {
	label: false,
	location: {
		type: 'home',
	},
	contentStyle: {
		paddingTop: 0
	},
	render: () => {
		const { currentPageView } = getSystemConfig()
		const { name, intro, actions } = currentPageView

		const style = {
			background: 'var(--fluid-box-background)',
			borderRadius: 'var(--fluid-radius)',
			padding: 'var(--fluid-lg-space)',
		}

		return (
			<>
			<div
				className="fl-asst-currently-viewing-summary"
				style={ style }
			>
				{ intro && <div className="fl-asst-pretitle">{intro}</div> }
				<div className="fl-asst-title">{name}</div>

			</div>
			{ Array.isArray( actions ) && 0 < actions.length &&
			<Button.Group appearance="buttons">{ Button.renderActions( actions ) }</Button.Group> }
			</>
		)
	},
} )

const PostTypeCounts = () => {
	const { getCount } = getSystemSelectors()
	const { contentTypes } = getSystemConfig()

	return (
		<Layout.Box padY={ false }>
			<div style={ {
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: 5
			} }>
				{ Object.entries( contentTypes ).map( ( [ key, item ], i ) => {
					const { labels } = item
					return (
						<div key={ i } style={ {
							display: 'flex',
							flexDirection: 'column',
							background: 'var(--fluid-primary-background)',
							color: 'var(--fluid-primary-color)',
							borderRadius: 'var(--fluid-sm-space)',
							padding: 'var(--fluid-med-space)'
						} }>
							{labels.plural}
							<span style={ { fontSize: 24, marginTop: 5, lineHeight: 1 } }>{getCount( `content/${key}` )}</span>
						</div>
					)
				} )}
			</div>

		</Layout.Box>
	)
}

registerSection( 'fl-recent-posts', {
	label: __( 'Recent Posts' ),
	location: {
		type: 'home',
	},
	padX: false,
	render: () => {
		const handle = 'fl-content'
		return (
			<>
				<PostTypeCounts />
				<List.Posts
					query={ {
						post_type: 'post',
						posts_per_page: 5
					} }
					paginate={ false }
					getItemProps={ ( item, defaultProps ) => {
						if ( item.id ) {
							return {
								...defaultProps,
								description: null,
								thumbnailSize: 'sm',
								to: {
									pathname: `/${handle}/post/${item.id}`,
									state: { item }
								},
							}
						}
						return defaultProps
					} }
				/>
			</>
		)
	}
} )
