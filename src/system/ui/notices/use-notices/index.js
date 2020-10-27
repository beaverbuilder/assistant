import React from 'react'
import Notice from '../notice'
import { useSystemState, getSystemActions } from 'data'

const NOTICE_TIMEOUT_LENGTH = 3000

export const useNotices = () => {
	const { createNotice, removeNotice } = getSystemActions()
	const { notices } = useSystemState( 'notices' )

	const renderNotices = () => {
		if ( ! notices.length ) {
			return null
		}
		return (
			<div className='fl-asst-notices'>
				{ notices.map( ( notice, i ) => {
					if ( i !== notices.length - 1 ) {
						return null
					}
					const { id, content, shouldDismiss, ...rest } = notice
					if ( shouldDismiss ) {
						setTimeout( () => removeNotice( id ), NOTICE_TIMEOUT_LENGTH )
					}
					return (
						<Notice
							key={ i }
							{ ...rest }
							onRemove={ () => removeNotice( id ) }
						>
							{ content }
						</Notice>
					)
				} ) }
			</div>
		)
	}

	return {
		createNotice,
		removeNotice,
		renderNotices,
		notices,
	}
}
