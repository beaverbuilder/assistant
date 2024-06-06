import React, { useEffect, useState } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button } from 'assistant/ui'
import { getWpRest } from 'assistant/utils/wordpress'
import { usePostMediaImport } from 'ui/library/use-post-media-import'
import cloud from 'assistant/cloud'

export default () => {
  const { items, createNotice } = Libraries.LibraryContext.use()
  const [ currentItem, setCurrentItem ] = useState( null )
  const [ selectedItems, setSelectedItems ] = useState( [] )
  const [ importComplete, setImportComplete ] = useState( false )
  const [ completedItemCount, setCompletedItemCount ] = useState( 0 )
  const importPostMedia = usePostMediaImport()
  const api = getWpRest().libraries()

  const importItems = async() => {
    let completedItemCount = 0
    let invalidItemCount = 0
    let invalidPosts = []
    let selectedItems = items.map( item => item.id )

    setSelectedItems( selectedItems )
    setImportComplete( false )

    for ( const id of selectedItems ) {
      const item = items.find( obj => obj.id === id )

      if ( item !== undefined ) {
        setCurrentItem( item )
        
        if ( 'color' === item.type || 'theme_settings' === item.type || 'code' === item.type ) {
          invalidPosts.push( { name: item.name, type: item.type } )
          invalidItemCount++
        } else if ( 'post' === item.type ) {
          await cloud.libraries.getItem( item.id ).then( async itemResponse => {
            await api.importPost( itemResponse.data ).then( async postResponse => {
              if ( postResponse.data.error && postResponse.data.error_code === 'post_type_not_registered' ) {
                invalidPosts.push( { name: item.name, type: postResponse.data.post_type } )
                invalidItemCount++
                return
              }

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

    const invalidPostList = invalidPosts.map( post => (
      <li key={ post.name }>{ post.name } ({ post.type })</li>
    ) )

    if (invalidItemCount < completedItemCount) {
      createNotice( {
        status: 'success',
        shouldDismiss: false,
        content: (
          <>
            { __( 'Library items imported!' ) }
            { ( invalidItemCount > 0 ) && 
              <>
                { ' ' }
                { __( 'Some items were not able to be imported due to these post types not being registered on this site: ' ) }
                <br /><ul>{ invalidPostList }</ul>
              </>
            }
          </>
        )
      } )
    } else {
      createNotice( {
        status: 'error',
        shouldDismiss: false,
        content: (
          <>
            { __( 'The selected items were not able to be imported due to these post types not being registered on this site: ' ) }
            <br /><ul>{ invalidPostList }</ul>
          </>
        )
      } )
    }

    setCompletedItemCount( 0 )
    setImportComplete( true )
  }

  if ( null === currentItem && ! importComplete ) {
    return (
      <Button
        onClick={ importItems }
        title={ __( 'Import all items in this library into your site.' ) }
      >
        { __( 'Import All Library Items' ) }
      </Button>
    )
  }

  return (
    <div style={ { gridColumn: 'span 2' } }>
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
        { null !== currentItem &&
          sprintf( __( 'Importing %s' ), currentItem.name )
        }
        { null === currentItem &&
          __( 'Import Complete!' )
        }
      </p>
    </div>
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
