import React, { memo } from 'react'
import { __ } from '@wordpress/i18n'
import { useHistory } from 'react-router-dom'
import { Page, Form, Layout, Notice, Button } from 'ui'
import { getSrcSet } from 'utils/image'
import { getWpRest } from 'utils/wordpress'
import { getSystemActions } from 'data'
import { useLibrarySaveAction } from 'ui/library/use-save-action'
import './style.scss'

export const Attachment = ( { CloudUI } ) => {
	const history = useHistory()
	const { item } = history.location.state
	const wpRest = getWpRest()
	const { setCurrentHistoryState } = getSystemActions()
	const { createNotice } = Notice.useNotices()
	const { id, type, subtype } = item

	const { saveToLibrary, LibraryDialog } = useLibrarySaveAction( {
		type: 'attachment',
		item,
		history,
		createNotice,
		CloudUI
	} )

	const onSubmit = ( { changed, ids } ) => {
		const data = {
			meta: {},
		}
		for ( let key in changed ) {
			if ( ! ids[key] ) {
				continue
			}
			data[ids[key]] = changed[key]
		}

		if ( 'title' in changed ) {
			item.title = changed.title
		}

		if ( 'alt' in changed ) {
			item.alt = changed.alt
			data.meta.alt = changed.alt
		}

		if ( 'description' in changed ) {
			item.description = changed.description
		}

		const handleError = error => {
			createNotice( {
				id: 'update-error',
				status: 'error',
				content: __( 'Error saving! Please try again.' )
			} )
			if ( error ) {
				console.log( error ) // eslint-disable-line no-console
			}
		}

		return wpRest
			.attachments()
			.update( id, 'data', data )
			.then( response => {
				const { data } = response
				if ( data.error ) {
					handleError()
				} else {
					setCurrentHistoryState( { item } )
					createNotice( {
						id: 'update-success',
						status: 'success',
						content: __( 'Changes saved!' )
					} )
				}
			} )
			.catch( error => {
				handleError( error )
			} )
	}

	const deleteAttchment = () => {
		if ( confirm( __( 'Do you really want to delete this media?' ) ) ) {
			wpRest
				.attachments()
				.update( id, 'trash' )
				.then( () => {
					createNotice( {
						id: 'delete-success',
						status: 'success',
						content: __( 'Media Permanently Deleted!' )
					} )
				} )
			history.goBack()
		}
	}

	const sections = {
		meta: {
			label: __( 'Metadata' ),
			fields: {
				title: {
					label: __( 'Title' ),
					id: 'post_title',
					component: 'text',
				},
				alt: {
					label: __( 'Alternative Text' ),
					id: 'alt',
					component: 'text',
				},
				description: {
					label: __( 'Description' ),
					component: 'textarea',
					id: 'post_content',
					rows: 4,
				},
			},
		},
		info: {
			label: __( 'Info' ),
			fields: {
				filesize: {
					label: __( 'File size' ),
					component: 'plain-text',
					labelPlacement: 'beside',
				},
				type: {
					label: __( 'File type' ),
					component: 'plain-text',
					labelPlacement: 'beside',
				},
				date: {
					label: __( 'Uploaded on' ),
					component: 'plain-text',
					labelPlacement: 'beside',
				},
				author: {
					label: __( 'Uploaded by' ),
					component: 'plain-text',
					labelPlacement: 'beside',
				},
			}
		},
		links: {
			label: __( 'Links' ),
			fields: {
				url: {
					label: __( 'File URL' ),
					component: 'url',
				},
				permalink: {
					label: __( 'URL' ),
					component: 'url',
				},
			},
		},
		labels: {
			label: __( 'Labels' ),
			fields: {
				labels: {
					component: 'labels',
					alwaysCommit: true,
					onAdd: label => {
						wpRest.attachments().addLabel( item.id, label.id )
					},
					onRemove: label => {
						wpRest.attachments().removeLabel( item.id, label.id )
					},
				},
			}
		},
		actions: {
			label: __( 'Actions' ),
			fields: {
				actions: {
					component: 'actions',
					options: [
						{
							label: __( 'View Attachment' ),
							href: item.permalink,
						},
						{
							label: __( 'Edit in Admin' ),
							href: item.editUrl,
						},
						{
							label: __( 'Save to Library' ),
							onClick: saveToLibrary,
						},
						{
							label: __( 'Delete' ),
							status: 'destructive',
							onClick: deleteAttchment,
						},
					],
				},
			},
		},
	}

	const defaults = {
		...item,
		type: type + '/' + subtype,
	}

	const {
		hasChanges,
		submitForm,
		renderForm,
		values,
	} = Form.useForm( {
		sections,
		onSubmit,
		defaults,
	} )

	const ToolbarActions = () => {
		return (
			<>
				<Button
					disabled={ ! hasChanges }
					isSelected={ hasChanges }
					onClick={ submitForm }
				>
					{ hasChanges ? __( 'Update' ) : __( 'Saved' ) }
				</Button>
			</>
		)
	}

	return (
		<Page.Detail
			id="fl-asst-attachment-detail"
			toolbarTitle={ __( 'Edit Attachment' ) }
			toolbarActions={ <ToolbarActions /> }
			title={ values.title }
			thumbnail={ <Hero { ...item } /> }
		>
			{ renderForm() }
			<LibraryDialog />
		</Page.Detail>

	)
}

const Hero = memo( ( { width, sizes, height, alt, type, url, mime, thumbnail } ) => {
	const srcSet = getSrcSet( sizes )

	// Temp - Handle non-image heroes.
	if ( ( 'image' !== type && 'audio' !== type && 'video' !== type ) && ! thumbnail ) {
		return null
	}

	let mediaContent = ''

	if ( 'audio' == type || 'video' == type ) {
		mediaContent = <video width="100%" controls><source src={ url } type={ mime } /></video>
	} else {
		mediaContent = <img src={ thumbnail } srcSet={ srcSet } height={ height } width={ width } alt={ alt } loading="lazy" />
	}

	return (
		<Layout.AspectBox
			className="fl-asst-hero-image"
			height={ height }
			width={ width }
		>
			{mediaContent}
		</Layout.AspectBox>
	)
} )
