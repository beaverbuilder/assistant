import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Form, Control, Button } from 'lib'
import utils from 'utils'
const { react: { useInitialFocus } } = utils

/**
 * Get a srcset string from an object of sizes.
 * Expects size.url and size.width to be present.
 */
const getSrcSet = ( sizes = {} ) => {
	return Object.values( sizes ).map( size => {
		return size.url + ' ' + size.width + 'w'
	} ).join( ', ' )
}

export const Attachment = ( { location } ) => {
	const firstRef = useInitialFocus()
	const defaultItem = {
		url: '',
		sizes: {},
		caption: '',
		description: '',
		alt: '',
		title: '',
		filesize: '',
	}
	const item = 'undefined' !== typeof location.state.item ? location.state.item : defaultItem
	const srcSet = getSrcSet( item.sizes )

	const onFormChange = () => {}

	const [ values, setValue ] = Form.useFormState( {
		title: item.title,
		description: item.description,
		url: item.url,
		alt: item.alt,
		caption: item.caption,
	}, onFormChange )

	const Header = () => {
		return (
			<Page.TitleCard>
				<img src={ item.thumbnail } srcSet={ srcSet } />
				<div style={ { paddingTop: 'var(--fl-asst-tiny-space)' } }>{item.filesize}</div>
			</Page.TitleCard>
		)
	}

    const Actions = () => {
        return (
            <Control.NextPrev
                onPrev={ () => console.log('prev') }
                onNext={ () => console.log('next')}
            />
        )
    }

	let hasFullURL = false
	if ( 'undefined' !== typeof item.sizes.full ) {
		hasFullURL = true
	}

	return (
		<Page shouldPadSides={ false } title={ __( 'Attachment' ) } header={ <Header /> } headerActions={<Actions />}>

			<Form>
				<Form.Section label={ __( 'Links' ) }>
					{ hasFullURL && (
						<Form.Item label={ __( 'File URL' ) }>
							<Control.URL url={ item.sizes.full.url } />
						</Form.Item>
					)}

					<Form.Item label={ __( 'Attachment Page' ) }>
						<Control.URL url={ values.url } />
					</Form.Item>
				</Form.Section>

				<Form.Section label={ __( 'Metadata' ) }>
					<Form.Item label={ __( 'Title' ) } labelFor="title">
						<input
							id="title"
							type="text"
							required={ true }
							placeholder={ __( 'Attachment Title' ) }
							value={ values.title }
							onChange={ e => setValue( 'title', e.target.value ) }
							ref={ firstRef }
						/>
					</Form.Item>
					<Form.Item label={ __( 'Alternative Text' ) } labelFor="alt">
						<input
							id="alt"
							type="text"
							required={ true }
							placeholder={ __( 'Describe your file' ) }
							value={ values.alt }
							onChange={ e => setValue( 'alt', e.target.value ) }
						/>
					</Form.Item>
					<Form.Item label={ __( 'Description' ) } labelFor="description" isRequired={ true }>
						<textarea
							id="description"
							value={ values.description }
							rows={ 4 }
							onChange={ e => setValue( 'description', e.target.value ) }
						/>
					</Form.Item>
					<Form.Item label={ __( 'Caption' ) } labelFor="caption">
						<textarea
							id="caption"
							value={ values.caption }
							rows={ 4 }
							onChange={ e => setValue( 'caption', e.target.value ) }
						/>
					</Form.Item>
				</Form.Section>
				<Form.Section label={ __( 'Actions' ) }>
					<Form.Item>
						<Button.Group appearance="grid">
							<Button>{__( 'View Attachment Page' )}</Button>
							<Button>{__( 'Edit in Admin' )}</Button>
							<Button>{__( 'Replace File' )}</Button>
							<Button>{__( 'Regenerate Thumbnails' )}</Button>
							<Button>{__( 'Move to Trash' )}</Button>
						</Button.Group>
					</Form.Item>
				</Form.Section>
			</Form>
		</Page>
	)
}
