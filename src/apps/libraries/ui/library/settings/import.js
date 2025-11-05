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

  const importItems = async( itemType ) => {  
    let completedItemCount = 0
    let invalidItemCount = 0
    let invalidPosts = []
    let selectedItems = []

    if ( itemType === 'all' ) {
      selectedItems = items.map( item => item.id )
    } else if ( itemType === 'all-content' ) {
      selectedItems = items.filter( item => item.type === 'post' ).map( item => item.id )
    } else if ( itemType === 'bb-content' ) {
      selectedItems = items.filter( item => item.type === 'post' && item.subtype === 'beaver-builder' ).map( item => item.id )
    } else if ( itemType.startsWith( 'post_type:' ) ) {
      const post_type = itemType.replace( 'post_type:', '' )
      selectedItems = items.filter( item => item.type === 'post' && item.data.post.post_type === post_type ).map( item => item.id )
    } else if ( itemType === 'all-settings' ) {
      selectedItems = items.filter( item => item.type === 'settings' ).map( item => item.id )
    } else if ( itemType === 'theme-settings' ) {
      selectedItems = items.filter( item => item.type === 'settings' && item.subtype === 'theme_settings' ).map( item => item.id )
    } else if ( itemType === 'bb-settings' ) {
      selectedItems = items.filter( item => item.type === 'settings' && item.subtype === 'bb_settings' ).map( item => item.id )
    } else if ( itemType === 'all-images' ) {
      selectedItems = items.filter( item => item.type === 'image' || item.type === 'svg' ).map( item => item.id )
    }

    setSelectedItems( selectedItems )
    setImportComplete( false )

    for ( const id of selectedItems ) {
      const item = items.find( obj => obj.id === id )

      if ( item !== undefined ) {
        setCurrentItem( item )
        
        if ( 'color' === item.type || 'code' === item.type ) {
          // invalidPosts.push( { name: item.name, type: item.type } )
          // invalidItemCount++
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
        } else if ( 'settings' === item.type ) {
          if ( confirm( __( 'Importing these settings will overwrite your existing settings, do you wish to continue?' ) + "\n" + item.name) ) {
            await api.importSettings( item.id )
          }
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

  // Get a list of post types from this library's items
  let post_types = []
  
  if ( items ) {
    post_types = [ ...new Set( items.filter( item => item.type === 'post' ).map( item => item.data.post.post_type ) ) ]
  }

  let hasSettings = false
  let hasImages = false

  if ( items ) {
    hasSettings = items.some( item => item.type === 'settings' )
    hasImages = items.some( item => item.type === 'image' || item.type === 'svg' )
  }

  if ( null === currentItem && ! importComplete ) {
    return (
      <select
        title={ __( 'Import all items in this library into your site.' ) }
        onChange={ e => importItems( e.target.value ) }
      >
        <option value=''>
          { __( 'Import Library...' ) }
        </option>
        <option value='all'>
          All Items
        </option>
        <optgroup label={ __( 'Content' ) }>
          <option value='all-content'>
            { __( 'All Content' ) }
          </option>
          <option value='bb-content'>
            { __( 'Beaver Builder Content' ) }
          </option>
          { post_types.map( post_type => (
            <option key={ post_type } value={ 'post_type:' + post_type }>
              Post Type: { post_type }
            </option>
          ) ) }
        </optgroup>
        { hasSettings &&
          <optgroup label={ __( 'Settings' ) }>
            <option value='all-settings'>
              { __( 'All Settings' ) }
            </option>
            <option value='theme-settings'>
              { __( 'Theme Settings' ) }
            </option>
            <option value='bb-settings'>
              { __( 'Beaver Builder Settings' ) }
            </option>
          </optgroup>
        }
        { hasImages &&
          <option value='all-images'>
            { __( 'Images' ) }
          </option>
        }
      </select>
    )
  }

  return (
    <div style={ { gridColumn: 'span 2' } }>
      { ! importComplete &&
        <p>
          { __( 'Import in progress. Navigating away from this view will stop the import process!' ) }
        </p>
      }
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
        { null !== currentItem && ! importComplete &&
          sprintf( __( 'Importing %s' ), currentItem.name )
        }
        { importComplete &&
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
