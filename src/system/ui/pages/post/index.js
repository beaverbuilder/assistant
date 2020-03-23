import React, { useState } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Button, Form, List, Page, Layout, Icon } from 'ui'
import { getSystemActions, getSystemConfig } from 'data'
import { getWpRest } from 'utils/wordpress'
import { createSlug } from 'utils/url'
import { getSrcSet } from 'utils/image'
import { getPostActions } from './actions'
import { useParentOptions } from './parent'
import './style.scss'

export const Post = ( { location, match, history } ) => {
	const { item } = location.state
	const { setCurrentHistoryState } = getSystemActions()
	const { contentTypes, contentStatus, taxonomies } = getSystemConfig()
	const { isHierarchical, labels, supports, templates } = contentTypes[ item.type ]
	const [ passwordVisible, setPasswordVisible ] = useState( 'protected' === item.visibility )
	const parentOptions = useParentOptions( item.type )
	const wpRest = getWpRest()
	const [ featureThumbnail, setFeatureThumbnail ] = useState( item.thumbnailData )

	const uploadFeatureImage = () => {
		const customUploader = wp.media( {
			title: 'Select an Image',
			id: 'fl-asst-media-upload',
			button: {
				text: 'Choose Featured Image'
			},
			multiple: false,
			library: {
				type: [ 'image' ]
			},
			width: '50%'
		} )

		customUploader.open()
		customUploader.on( 'select', function() {
			var attachment = customUploader.state().get( 'selection' ).first().toJSON()
			setFeatureThumbnail( attachment )
			setValues( { thumbnailData: attachment }, false )
		} )
	}

	const removeFeatureImage = () => {
		setFeatureThumbnail( false )
		setValues( { thumbnailData: null }, false )
	}

	const getFeaturedImageSrcSet = () => {
		if ( ! item.thumbnailData ) {
			return ''
		}
		const { sizes } = item.thumbnailData
		let srcSet = ''
		if ( sizes ) {
			srcSet = getSrcSet( sizes )
		}
		return srcSet
	}

	const tabs = {
		general: {
			label: __( 'General' ),
			path: match.url,
			exact: true,
			sections: {
				labels: {
					label: __( 'Labels' ),
					fields: {
						labels: {
							component: 'labels',
							alwaysCommit: true,
							onAdd: label => {
								wpRest.notations().createLabel( 'post', item.id, label.id )
							},
							onRemove: label => {
								wpRest.notations().deleteLabel( 'post', item.id, label.id )
							},
						},
					}
				},
				actions: {
					label: __( 'Actions' ),
					fields: {
						actions: {
							component: 'actions',
							options: args => getPostActions( { history, ...args } ),
						}
					}
				}
			},
		},
		edit: {
			label: __( 'Edit' ),
			path: match.url + '/edit',
			sections: {
				general: {
					label: '',
					fields: {
						title: {
							label: __( 'Title' ),
							component: 'text',
							id: 'post_title',
						},
						slug: {
							label: __( 'Slug' ),
							component: 'text',
							id: 'post_name',
							sanitize: createSlug,
						},
						url: {
							label: __( 'URL' ),
							component: 'url',
							id: 'post_url',
						},
					}
				},
				publish: {
					label: __( 'Publish Settings' ),
					fields: {
						status: {
							label: __( 'Status' ),
							labelPlacement: 'beside',
							component: 'plain-text',
							sanitize: value => contentStatus[ value ] ? contentStatus[ value ] : value,
						},
						visibility: {
							label: __( 'Visibility' ),
							labelPlacement: 'beside',
							component: 'select',
							options: {
								'public': __( 'Public' ),
								'private': __( 'Private' ),
								'protected': __( 'Protected' ),
							},
							onChange: ( { value, setValue } ) => {
								switch ( value ) {
								case 'public':
								case 'protected':
									setValue( 'status', 'publish' )
									break
								case 'private':
									setValue( 'status', 'private' )
									break
								}
								setPasswordVisible( 'protected' === value )
							}
						},
						password: {
							label: __( 'Password' ),
							labelPlacement: 'beside',
							component: 'text',
							id: 'post_password',
							isVisible: passwordVisible,
						},
						date: {
							label: __( 'Publish Date' ),
							labelPlacement: 'beside',
							component: 'plain-text',
						},
					},
				},
				taxonomies: {
					label: __( 'Taxonomies' ),
					isVisible: !! Object.keys( item.terms ).length,
					fields: ( { fields } ) => {
						const { value, onChange } = fields.terms
						const values = { ...value }
						return Object.keys( values ).map( ( taxonomy, key ) => (
							<Form.Item
								key={ key }
								label={ taxonomies[ taxonomy ].labels.plural }
							>
								<Form.TaxonomyTermsItem
									taxonomy={ taxonomy }
									value={ [ ...values[ taxonomy ] ] }
									onChange={ newValue => {
										values[ taxonomy ] = newValue
										onChange( { ...values } )
									} }
								/>
							</Form.Item>
						) )
					},
				},
				excerpt: {
					label: __( 'Excerpt' ),
					isVisible: supports.excerpt,
					fields: {
						excerpt: {
							component: 'textarea',
							id: 'post_excerpt',
							isVisible: supports.excerpt,
							rows: 5,
						},
					},
				},
				featureimgUpload: {
					label: __( 'Feature Image' ),
					isVisible: supports.thumbnail,
					fields: {
						featureimgUpload: {
							id: 'post_feature_image',
							isVisible: supports.thumbnail && ! featureThumbnail,
							label: __( 'Set Feature Image' ),
							component: 'text',
							onClick: uploadFeatureImage,
						},
						featureimg: {
							id: 'post_feature_img',
							src: featureThumbnail && featureThumbnail.url,
							srcSet: getFeaturedImageSrcSet(),
							isVisible: featureThumbnail,
							component: 'image',
							onClick: uploadFeatureImage,
						},
						removeFeatureimg: {
							id: 'remove_post_feature_img',
							text: 'Remove',
							btnclass: 'fl-asst-remove-feature-img',
							isVisible: featureThumbnail,
							component: 'button',
							onClick: removeFeatureImage,

						},

					},
				},
				attributes: {
					label: __( 'Attributes' ),
					isVisible: !! Object.keys( templates ).length || isHierarchical || supports.order,
					fields: {
						template: {
							label: __( 'Template' ),
							labelPlacement: 'beside',
							component: 'select',
							isVisible: !! Object.keys( templates ).length,
							options: () => {
								const options = {
									'default': __( 'Default' ),
								}
								Object.keys( templates ).map( ( key ) => {
									options[ templates[ key ] ] = key
								} )
								return options
							},
						},
						parent: {
							label: __( 'Parent' ),
							labelPlacement: 'beside',
							component: 'select',
							id: 'post_parent',
							isVisible: isHierarchical,
							options: parentOptions,
						},
						order: {
							label: __( 'Order' ),
							labelPlacement: 'beside',
							component: 'text',
							id: 'menu_order',
							isVisible: supports.order,
						},
					},
				},
				discussion: {
					label: __( 'Discussion' ),
					isVisible: supports.comments || supports.trackbacks,
					fields: {
						commentsAllowed: {
							label: __( 'Allow Comments' ),
							labelPlacement: 'beside',
							component: 'checkbox',
							isVisible: supports.comments,
						},
						pingbacksAllowed: {
							label: __( 'Allow Pingbacks' ),
							labelPlacement: 'beside',
							component: 'checkbox',
							isVisible: supports.trackbacks,
						},
					},
				},
			},
		},
		comments: {
			label: __( 'Comments' ),
			path: match.url + '/comments',
			isVisible: supports.comments && 0 < item.commentsCount,
			sections: () => (
				<List.Comments
					query={ { post__in: [ item.id ] } }
					getItemProps={ ( item, defaultProps ) => ( {
						...defaultProps,
						to: {
							pathname: `/fl-comments/comment/${ item.id }`,
							state: { item }
						},
					} ) }
					scrollerClassName="fl-asst-outset"
				/>
			),
		},
	}

	const onSubmit = ( { changed, ids, setValue } ) => {
		const data = {
			meta: {},
			terms: {},
		}

		for ( let key in changed ) {
			if ( ! ids[ key ] ) {
				continue
			}
			data[ ids[ key ] ] = changed[ key ]
		}

		if ( 'visibility' in changed ) {
			switch ( changed.visibility ) {
			case 'public':
				data.post_status = 'publish'
				data.post_password = ''
				break
			case 'private':
				data.post_status = 'private'
				data.post_password = ''
				break
			case 'protected':
				data.post_status = 'publish'
				break
			}
		}
		if ( 'commentsAllowed' in changed ) {
			data.comment_status = changed.commentsAllowed ? 'open' : 'closed'
		}
		if ( 'pingbacksAllowed' in changed ) {
			data.ping_status = changed.pingbacksAllowed ? 'open' : 'closed'
		}
		if ( 'template' in changed ) {
			data.meta._wp_page_template = changed.template
		}
		if ( 'parent' in changed ) {
			data.post_parent = changed.parent.split( ':' ).pop()
		}
		if ( 'terms' in changed ) {
			data.terms = changed.terms
		}

		const handleError = error => {
			setIsSubmitting( false )
			alert( __( 'Error: Changes not published! Please try again.' ) )
			if ( error ) {
				console.log( error ) // eslint-disable-line no-console
			}
		}

		wpRest.posts().update( item.id, 'data', data ).then( response => {
			const { data } = response
			if ( data.error ) {
				handleError()
			} else {
				setCurrentHistoryState( { item: data.post } )
				setValue( 'url', data.post.url, true )
				setIsSubmitting( false )
				alert( __( 'Changes published!' ) )
			}
		} ).catch( error => {
			handleError( error )
		} )
	}

	const {
		renderForm,
		resetForm,
		submitForm,
		values,
		hasChanges,
		setIsSubmitting,
		setValues,
	} = Form.useForm( {
		tabs,
		onSubmit,
		defaults: {
			...item,
			parent: item.parent ? `parent:${ item.parent }` : 0,
		},
	} )

	const Footer = () => {
		return (
            <>
			<Button
				onClick={ resetForm }
			>{__( 'Cancel' )}</Button>
			<div style={ { flex: '1 1 auto', margin: 'auto' } } />
			<Button type="submit" status="primary" onClick={ submitForm } >{__( 'Publish' )}</Button>
            </>
		)
	}

	const Hero = () => {
		if ( ! item.thumbnailData ) {
			return null
		}
		const { alt, title, height, width } = item.thumbnailData
		return (
			<div>
				<img
					src={ item.thumbnailData.url }
					srcSet={ getFeaturedImageSrcSet() }
					style={ { objectFit: 'cover' } }
					alt={ alt }
					title={ title }
					height={ height }
					width={ width }
				/>
			</div>
		)
	}

	const isCurrentPage = () => item.url === window.location.href

	const ElevatorButtons = () => (
		<div style={ {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			margin: '10px 0 0',
			flex: '0 0 auto',
		} } >
			{ ! isCurrentPage() && (
				<Button
					appearance='elevator'
					title={ __( 'Go To Post' ) }
					href={ item.url }
				>
					<Icon.View />
				</Button>
			)}
			<Button
				appearance='elevator'
				title={ __( 'Edit in Admin' ) }
				href={ item.editUrl }
			>
				<Icon.Edit />
			</Button>
			{ item.bbCanEdit && (
				<Button
					appearance='elevator'
					title={ sprintf( 'Edit with %s', item.bbBranding ) }
					href={ item.bbEditUrl }
				>
					<Icon.Beaver />
				</Button>
			)}
		</div>
	)

	return (
		<Page
			title={ labels.editItem }
			hero={ item.thumbnailData ? <Hero /> : null }
			footer={ hasChanges && <Footer /> }
		>
			<Layout.Headline>{values.title}</Layout.Headline>
			<ElevatorButtons />
			{ renderForm() }
		</Page>
	)
}
