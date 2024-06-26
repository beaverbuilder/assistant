import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Icon } from 'assistant/ui'
import { Selection } from '@beaverbuilder/fluid'
import cloud from 'assistant/cloud'

export default () => {
  const { items, setItems } = Libraries.LibraryContext.use()
  const { items: selectedItems, clearSelection, totalSelectedItems } = Selection.use()

  const deleteItems = async( ids = [] ) => {
    cloud.libraries.deleteItem( ids ).finally( () => {
      setItems( [ ...items.filter( obj => ! selectedItems.includes( obj.id ) ) ] )
      clearSelection()
    } )
  }

  return (
    <Button
      status="destructive"
      icon={ <Icon.Trash /> }
      disabled={ 0 >= totalSelectedItems }
      onClick={ () => {
        if ( confirm( __( 'Do you really want to delete these items?' ) ) ) {
          deleteItems( selectedItems )
        }
      } }
    >
      { __( 'Delete' ) }
    </Button>
  )
}