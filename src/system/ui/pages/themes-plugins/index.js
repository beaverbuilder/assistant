import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form, Page, Layout, Text } from 'ui'
import { useLocation } from 'react-router-dom'

export const Plugin = () => {
	const { item } = useLocation().state
	const {
		thumbnail,
		title,
		content,
		author,
		authorURI,
		pluginURI
	} = item

	const Hero = () => {
		return (
			<Layout.AspectBox
				ratio="square"
				style={ {
					backgroundImage: `url(${thumbnail})`,
					backgroundSize: 'cover'
				} }
			/>
		)
	}

	const { renderForm } = Form.useForm( {
		defaults: item,
		sections: {
			details: {
				label: __( 'Details' ),
				fields: {
					version: {
						label: __( 'Current Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					updatedVersion: {
						label: __( 'Updated Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					author: {
						label: __( 'Author' ),
						labelPlacement: 'beside',
						component: () => authorURI ? <a href={ authorURI }>{author}</a> : author,
					},
					pluginURI: {
						label: __( 'Plugin Page' ),
						labelPlacement: 'beside',
						component: () => <a href={ pluginURI }>{title}</a>,
					},
					tested: {
						label: __( 'Tested for WordPress Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					requiresPHP: {
						label: __( 'Requires PHP Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					}
				}
			},
		}
	} )

	return (
		<Page.Detail
			title={ title }
			toolbarTitle={ __( 'Plugin' ) }
			thumbnail={ thumbnail && <Hero /> }
		>
			<div dangerouslySetInnerHTML={ { __html: content } } />
			{renderForm()}
		</Page.Detail>
	)
}

export const Theme = () => {
	const { item } = useLocation().state
	const { banner, title, content } = item

	const { renderForm } = Form.useForm( {
		defaults: item,
		sections: {
			details: {
				label: __( 'Details' ),
				fields: {
					version: {
						label: __( 'Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					updatedVersion: {
						label: __( 'Updated Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					author: {
						label: __( 'Author' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					}
				}
			}
		}
	} )

	const Hero = () => {
		return (
			<Layout.AspectBox
				width={ 1200 }
				height={ 900 }
				style={ {
					backgroundImage: `url(${banner})`,
					backgroundSize: 'cover'
				} }
			/>
		)
	}

	return (
		<Page
			toolbarTitle={ __( 'Theme' ) }
			title={ title }
			hero={ banner && <Hero /> }
			padY={ false }
		>
			<div dangerouslySetInnerHTML={ { __html: content } } />
			{renderForm()}
		</Page>
	)
}
