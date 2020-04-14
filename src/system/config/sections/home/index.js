import React, { useState, useContext } from 'react'
import { getSystemActions, getSystemConfig, useSystemState, getSystemSelectors } from 'data'
import { Button, Icon, App, List, Layout, Form } from 'ui'
import { Dashicon } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { ENTER } from '@wordpress/keycodes'
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

		const dashURL =
			'undefined' !== typeof adminURLs.dashboard ?
				adminURLs.dashboard :
				'/wp-admin'

		const { appearance } = useSystemState()
		const { setBrightness } = getSystemActions()
		const toggleBrightness = () =>
			'light' === appearance.brightness ?
				setBrightness( 'dark' ) :
				setBrightness( 'light' )

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
						<Button
							key={ i }
							status="primary"
							to={ `/fl-content/tab/${key}` }
							style={ {
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								borderRadius: 'var(--fluid-sm-space)',
								padding: 'var(--fluid-med-space)'
							} }
						>
							{labels.plural}
							<span style={ { fontSize: 24, marginTop: 5, lineHeight: 1 } }>{getCount( `content/${key}` )}</span>
						</Button>
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

registerSection( 'fl-home-subscribe', {
	label: __( 'Subscribe' ),
	location: {
		type: 'home',
	},
	render: () => {
		const [ subscribeEmail, setsubscribeEmail ] = useState( '' )
		const [ isSubscribing, setisSubscribing ] = useState( false )

		const ValidateEmail = mail => {
			if ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( mail ) ) {
				return true
			}
			alert( 'You have entered an invalid email address!' )
			return false
		}

		const subscribeUser = () => {
			if ( '' === subscribeEmail ) {
				alert( 'Please Enter email!' )
			} else if ( ValidateEmail( subscribeEmail ) ) {

				setisSubscribing( true )

				if ( 'undefined' != typeof _dcq ) {
					_dcq.push( [
						'identify',
						{
							email: subscribeEmail,
							tags: [ 'Assistant Newsletter' ],
							success: function( response ) {
								if ( response.success ) {
									setisSubscribing( false )
									alert( 'Subscribed Successfully!' )
								} else {
									setisSubscribing( false )
									alert( 'Problem in subscribing' )
								}
							},
						},
					] )
				} else {
					setisSubscribing( false )
					alert( 'Problem in subscribing' )
				}
			}
		}

		const onClick = e => {
			subscribeUser()
			e.preventDefault()
		}
		const onKeyPress = e => {
			if ( ENTER === e.which ) {
				subscribeUser()
			}
		}

		return (
			<form>
				<p style={{ marginTop: 0 }}>{__('Subscribe for the Latest Assistant News and Updates!')}</p>
				<Form.Input
					value={ subscribeEmail }
					onChange={ e => setsubscribeEmail( e.target.value ) }
					onKeyPress={ onKeyPress }
					placeholder={ __('email@example.com') }
					after={
						subscribeEmail &&
						<Button
							status="primary"
							onClick={ onClick }
						>
							<span style={{ marginRight: 'var(--fluid-sm-space)'}}>{__('Send')}</span>
							<Icon.Return />
						</Button>
					}
				/>
				{ isSubscribing && <Icon.SmallSpinner/> }
			</form>
		)
	},
} )
