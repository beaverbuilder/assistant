import { useState, useEffect } from 'react'
import cloud from 'assistant/utils/cloud'

export const useLibrary = id => {
    const defaultLibrary = {
        name: '',
        id: '',
        assets: [],
    }
    const [value, setValue] = useState( defaultLibrary )

    useEffect( () => {
        cloud.libraries.get( id ).then( response => {
            console.log( response.data )
            setValue( response.data )
        } )
    }, [])

    return {
        ...value
    }
}
