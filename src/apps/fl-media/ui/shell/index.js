import React from 'react'
import { __ } from '@wordpress/i18n'
import c from 'classnames'
import { Layout, Button, Icon } from 'assistant/ui'
import { getSystemHooks } from 'assistant/data'
import { attachmentTypes, useMediaApp } from '../../data'
import MediaIcon from '../../icon'
import './style.scss'

const MediaShell = ( { children, className, ...rest } ) => {
	const { showUploader, setShowUploader } = useMediaApp()
	return (
		<div
			className={ c( 'fl-asst-media-app-shell', className ) }
			{ ...rest }
		>
			<Layout.SidebarBackdrop>
				<AttachmentTypesSection />
				<LabelsSection />
			</Layout.SidebarBackdrop>

			<div className="fl-asst-toolbar">
				<div className="fl-asst-primary-toolbar-area">
					<div className="fl-asst-media-branding">
						<MediaIcon />
						{ __( 'Media', 'fl-assistant' ) }
					</div>
				</div>
				<div className="fl-asst-secondary-toolbar-area">
					<Button
						isSelected={ showUploader }
						shape="round"
						icon={ <Icon.Plus /> }
						onClick={ () => setShowUploader( ! showUploader ) }
					/>
				</div>
			</div>
			<div className="fl-asst-media-app-content">{children}</div>
		</div>
	)
}

const AttachmentTypesSection = () => {
	const { query, setQuery } = useMediaApp()
	const setType = value => setQuery( { ...query, post_mime_type: value, label: '' } )

	return (
		<Layout.SidebarSection style={ { paddingTop: 0 } }>
			<ul>
				{ Object.keys( attachmentTypes ).map( key => {
					const { label, icon: TypeIcon } = attachmentTypes[ key ]

					return (
						<li key={ key }>
							<Button
								onClick={ () => setType( key ) }
								size="lg"
								icon={ <TypeIcon /> }
								isSelected={ query.post_mime_type === key && '' === query.label }
							>
								{ label }
							</Button>
						</li>
					)
				} ) }
			</ul>
		</Layout.SidebarSection>
	)
}

const LabelsSection = () => {
	const { query, setQuery } = useMediaApp()
	const { useLabels } = getSystemHooks()
	const [ labels ] = useLabels()

	const LabelDot = ( { color } ) => (
		<div
			style={ { width: 10, height: 10, borderRadius: '50%', backgroundColor: color } }
		/>
	)

	return (
		<Layout.SidebarSection title={ __( 'Labels', 'fl-assistant' ) }>
			<ul>
				{ labels.map( item => {
					const { id, label, color } = item
					return (
						<li key={ id }>
							<Button
								icon={ <LabelDot color={ color } /> }
								onClick={ () => setQuery( { ...query, label: id } ) }
							>
								{label}
							</Button>
						</li>
					)
				} ) }
			</ul>
		</Layout.SidebarSection>
	)
}

export default MediaShell
