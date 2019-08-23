import React, { useState } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Button, Icon } from 'shared-lib'
import { List } from 'lib'

export const Updates = ( {
	getItemProps = ( item, defaultProps ) => defaultProps,
	query = {
		updateType: 'all',
	},
	...rest,
} ) => {
	return (
		<List.WordPress
			type={ 'updates' }
			query={ query }
			isListSection={ item => 'undefined' !== typeof item.items }
			getSectionItems={ section => section.items }
			getItemProps={ ( item, defaultProps, isSection ) => {
				if ( isSection ) {
					return {
						...defaultProps,
						label: item.label
					}
				}

				const Extras = () => {
					//const isQueued = updater.isQueued( item.type, item.key )
					const [ updating, setUpdating ] = useState( false )
					return (
						<div className="fl-asst-item-extras" onClick={ e => e.stopPropagation() }>
							<div className="fl-asst-item-extras-left">
								{ updating && <Button
									tabIndex="-1"
								>
									{__( 'Updating...' )}
								</Button> }
								{ ! updating && <Button
									tabIndex="-1"
									onClick={ () => {
										setUpdating( true )
										//updater.queue( item.type, item.key )
									} }
								>
									{__( 'Update' )}
								</Button> }
							</div>
						</div>
					)
				}

				return getItemProps( item, {
					...defaultProps,
					label: item.title,
					description: item.meta,
					thumbnail: item.thumbnail,
					extras: props => <Extras { ...props } />,
				} )
			} }
			{ ...rest }
		/>
	)
}
