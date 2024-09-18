import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button } from 'assistant/ui'
import cloud from 'assistant/cloud'

export default () => {
	const { library } = Libraries.LibraryContext.use()
	const [ disabled, setDisabled ] = useState( false )

  return (
    <Button 
      title={ __( 'Download a ZIP file of all items in this library.' ) }
      disabled={ disabled }
      onClick={ async () => {
        setDisabled( true )

        const form = document.createElement( 'form' )
        const input = document.createElement( 'input' )

        form.method = 'POST'
        form.action = `${ cloud.http.defaults.baseURL }/libraries/${ library.id }/download`

        input.name = 'token'
        input.type = 'hidden'
        input.value = cloud.session.getToken()

        form.appendChild( input )
        document.body.appendChild( form )

        form.submit()
        form.remove()

        setDisabled( false )
      } }
    >
      { __( 'Download ZIP' ) }
    </Button>
  )
}