import { useState } from 'react'
import { useSystemState, getSystemActions, getSystemState } from 'assistant/data'

const filter = apps => apps.filter( app => {

	return ( 'undefined' !== typeof app && app.shouldShowInAppList )
} )

const useAppOrder = () => {
	const { apps: initialApps } = useSystemState()
	const [ _apps, setApps ] = useState( filter( Object.values( initialApps ) ) )

	const apps = filter( _apps )
	const keys = apps.map( app => app.handle )

	return { apps, setApps, keys }
}

export default useAppOrder
