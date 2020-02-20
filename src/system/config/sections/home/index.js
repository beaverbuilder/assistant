import React, { useState } from 'react'
import { getSystemActions, getSystemConfig, useSystemState } from 'data'
import { Button, Icon, Layout } from 'ui'
import { __ } from '@wordpress/i18n'
import { useInitialFocus } from 'utils/react'
import './style.scss'

const { registerSection } = getSystemActions()

registerSection( 'fl-asst-quick-actions', {
	location: {
		type: 'home',
	},
	padX: false,
	render: () => {
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
					<span className="dashicons dashicons-wordpress-alt"></span>
				</Button>
				<Button
					onClick={ toggleBrightness }
					appearance="elevator"
					title={ __( 'Toggle UI Brightness' ) }
				>
					<Icon.Brightness />
				</Button>
				<Button
					to={ {
						pathname: '/fl-content/post/new',
						state: { detailBaseUrl: '/fl-content/post' },
					} }
					appearance="elevator"
					title={ __( 'Create Post' ) }
				>
					<Icon.Plus />
				</Button>
			</div>
		)
	},
} )

registerSection( 'fl-home-currently-viewing', {
	label: __( 'Currently Viewing' ),
	location: {
		type: 'home',
	},
	render: () => {
		const { currentPageView } = getSystemConfig()
		const { name, type, actions } = currentPageView

		return (
			<>
				<div className="fl-asst-currently-viewing-summary">
					{type && <div className="fl-asst-pretitle">{type}</div>}
					<div className="fl-asst-title">{name}</div>
					{Array.isArray( actions ) && 0 < actions.length && (
						<Button.Group appearance="buttons">
							{Button.renderActions( actions )}
						</Button.Group>
					)}
				</div>
			</>
		)
	},
} )

registerSection( 'fl-home-apps', {
	label: __( 'Apps' ),
	location: {
		type: 'home',
	},
	padX: false,
	render: () => {
		const { apps, appOrder, window } = useSystemState()
		const focusRef = useInitialFocus()
		let didSetFocusRef = false

		return (
			<div className="fl-asst-app-grid">
				{appOrder.map( ( handle, i ) => {
					const app = apps[handle]

					let icon = Icon.DefaultApp
					if ( 'function' === typeof app.icon ) {
						icon = app.icon
					}

					if ( 'undefined' === typeof app || ! app.shouldShowInAppList ) {
						return
					}

					const location = {
						pathname: `/${handle}`,
						state: app,
					}

					const style = {
						color: 'var(--fl-asst-secondary-surface-background)',
					}
					if ( 'undefined' !== typeof app.accent ) {
						style['--fl-asst-accent-color'] = app.accent.color
						style.color = 'var(--fl-asst-accent-color)'
					}

					let ref = null
					if ( ! didSetFocusRef ) {
						ref = focusRef
						didSetFocusRef = true
					}

					const size = 'mini' === window.size ? 50 : 60
					const iconProps = {
						width: size,
						height: size,
						windowSize: window.size,
						context: 'app-list',
					}

					return (
						<Button
							to={ location }
							className="fl-asst-app-grid-item"
							key={ i }
							innerRef={ ref }
							appearance="transparent"
						>
							<div className="fl-asst-app-icon" style={ style }>
								{'function' === typeof icon && icon( iconProps )}
							</div>
							<label>{app.label}</label>
						</Button>
					)
				} )}
			</div>
		)
	},
} )

registerSection( 'fl-home-subscribe', {
	label: __( 'Subscribe' ),
	location: {
		type: 'home',
	},
	padX: false,
	render: () => {
		const { apps, appOrder, window } = useSystemState()
		const focusRef = useInitialFocus()
		let didSetFocusRef = false
		const [ subscribeEmail, setsubscribeEmail ] = useState( '' )
		const [ isSubscribing, setisSubscribing ] = useState( false )
		const [ responseMessage, setResponseMessage ] = useState( {
			message: '',
			status: '',
			icon: ''
		} )
		const ValidateEmail = mail => {
			if ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( mail ) ) {
				return true
			}

			setResponseMessage( {
				message: __( 'You have entered an invalid email address!' ),
				status: 'destructive',
				icon: Icon.Reject
			}
		 )
			return false
		}

		const subscribeUser = () => {
			if ( '' === subscribeEmail ) {
				setResponseMessage( {
					message: __( 'Please Enter Email!' ),
					status: 'destructive',
					icon: Icon.Reject
				}
			 )
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
									setResponseMessage( {
										message: __( 'Subscribed Successfully!' ),
										status: 'alert',
										icon: Icon.Approve
									}
								 )

								} else {
									setisSubscribing( false )
									setResponseMessage( {
										message: __( 'Problem in subscribing!' ),
										status: 'destructive',
										icon: Icon.Reject
									}
								 )
								}
							},
						},
					] )
				} else {
					setisSubscribing( false )
					setResponseMessage( {
						message: __( 'Problem in subscribing!' ),
						status: 'destructive',
						icon: Icon.Reject
					}
				 )
				}
			}
		}

		return (
			<div className="fluid-pad-x fl-asst-form fl-asst-subscribe">
				<p>Subscribe for the Latest Assistant News and Updates!</p>
				<div className="fl-asst-subscribe-wrap">
					<label>
						<input
							type="text"
							value={ subscribeEmail }
							onChange={ e => {
								setsubscribeEmail( e.target.value )
							} }
						/>
					</label>
					<div className="fl-asst-form-item-content">
						<Button className="fl-asst-app-grid-item" onClick={ subscribeUser }>
							<label>Subscribe</label>
						</Button>

					</div>
				</div>
				{isSubscribing &&
				<Icon.SmallSpinner/>
				}
				{responseMessage.message && (
				<Layout.Message status={ responseMessage.status } icon={ responseMessage.icon }>
					{responseMessage.message}
				</Layout.Message>
			)}
			</div>
		)
	},
} )
