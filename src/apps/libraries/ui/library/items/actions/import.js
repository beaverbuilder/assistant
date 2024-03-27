import { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'assistant/utils/wordpress'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Icon } from 'assistant/ui'
import { Selection } from '@beaverbuilder/fluid'
import { usePostMediaImport } from 'ui/library/use-post-media-import'
import cloud from 'assistant/cloud'

export default () => {
  const { items, setItems } = Libraries.LibraryContext.use()
  const { items: selectedItems, clearSelection, totalSelectedItems } = Selection.use()
	const [ currentItem, setCurrentItem ] = useState( null )
  const [ completedItemCount, setCompletedItemCount ] = useState( 0 )
	const importPostMedia = usePostMediaImport()
  const api = getWpRest().libraries()

  const importItems = async( ids = [] ) => {
    let completedItemCount = 0

    for ( const id of selectedItems ) {
      const item = items.find( obj => obj.id === id )

      if ( item !== undefined ) {
        setCurrentItem( item )
        
        if ( 'color' === item.type || 'theme_settings' === item.type ) {
          return
        } else if ( 'post' === item.type ) {
          await cloud.libraries.getItem( item.id ).then( async itemResponse => {
            await api.importPost( itemResponse.data ).then( async postResponse => {
              await importPostMedia( postResponse.data, itemResponse.data )
            } )
          } )
        } else {
          await api.importItem( item )
        }
      }

      completedItemCount++
      setCompletedItemCount( completedItemCount )
    }

    setCompletedItemCount( 0 )
    clearSelection()
  }
  
  return (
    <>
      <Button
        disabled={ currentItem !== null }
        onClick={ importItems }
      >
        { __( 'Import' ) }
      </Button>
      { currentItem !== null &&
        <div className="fl-asst-import-bar">
          <p>
            { __( 'Import in progress. Navigating away from this view will stop the import process!' ) }
          </p>
          <LoadingBar
            progress={ ( completedItemCount / selectedItems.length ) * 100 }
          />
          <p style={ {
            fontStyle: 'italic',
            fontSize: '12px',
            marginTop: 'var(--fluid-sm-space)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          } }>
            { __( 'Importing' ) } { currentItem.name }
          </p>
        </div>
      }
    </>
  )
}

const LoadingBar = ( { progress } ) => {
	return (
		<div
			style={ {
				background: 'var(--fluid-transparent-10)',
				borderRadius: 'var(--fluid-radius)',
				height: '6px'
			} }
		>
			<div
				style={ {
					background: 'var(--fluid-transparent-4)',
					borderRadius: 'var(--fluid-radius)',
					height: '6px',
					width: `${ progress }%`
				} }
			/>
		</div>
	)
}
