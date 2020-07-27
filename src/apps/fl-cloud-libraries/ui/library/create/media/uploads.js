import React from 'react'
import { __ } from '@wordpress/i18n'
import { Icon, Layout } from 'assistant/ui'
import { truncate } from 'assistant/utils/text'

export default  ( {
	files = [],
	isLoading = false
} ) => {
	if ( ! files.length ) {
		return null
	}

	return files.map( ( file, i ) => (
		<Layout.Box
			key={ i }
			style={ {
				borderBottom: '1px solid var(--fluid-line-color)',
				padding: 'var(--fluid-med-space) 0'
			} }
		>
			<Layout.Row
				style={ {
					alignItems: 'center',
					justifyContent: 'left',
				} }
			>
				<div
					style={ {
						marginRight: 'var(--fluid-med-space)'
					} }
				>
					<div
						style={ {
							backgroundImage: file.tempUrl ? `url(${ file.tempUrl })` : '',
							backgroundColor: 'var(--fluid-transparent-12)',
							backgroundSize: 'cover',
							backgroundPosition: 'center center',
							height: 30,
							width: 30
						} }
					/>
				</div>
				<div
					style={ {
						flexGrow: 1,
					} }
				>
					<span style={ {
						color: 'error' === file.status ? 'var(--fluid-destructive-color)' : ''
					} }>
						{ truncate( file.name, 20 ) }
					</span>
				</div>
				<div>
					{ isLoading && 0 === i &&
						<Icon.Loading />
					}
					{ isLoading && i > 0 &&
						__( 'Waiting' )
					}
					{ ! isLoading && ! file.error &&
						__( 'Uploaded' )
					}
					{ ! isLoading && file.error &&
						<span style={ {
							color: 'var(--fluid-destructive-color)',
							fontWeight: 'bold'
						} }>
							{ __( 'Error' ) }
						</span>
					}
				</div>
			</Layout.Row>
			{ file.error &&
				<div
					style={ {
						background: 'var(--fluid-destructive-hover-background)',
						borderRadius: 'var(--fluid-radius)',
						margin: 'var(--fluid-med-space) 0 0',
						padding: 'var(--fluid-sm-space)'
					} }
				>
					{ file.error }
				</div>
			}
		</Layout.Box>
	) )
}
