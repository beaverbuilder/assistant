import { useState, useEffect } from 'react'
import { getSystemStore } from 'assistant/data'

const useUpdates = () => {
	const store = getSystemStore()
	const [ total, setTotal ] = useState( 0 )

	// Listen for updates when the store changes
	// But only setTotal when there's a change
	useEffect( () => {
		return store.subscribe( () => {
			const { counts } = store.getState()
			const plugins = counts['update/plugins'] ? counts['update/plugins'] : 0
			const themes = counts['update/themes'] ? counts['update/themes'] : 0

			total !== ( themes + plugins ) && setTotal( themes + plugins )
		} )
	}, [] )

	const { counts } = store.getState()
	const plugins = counts['update/plugins'] ? counts['update/plugins'] : 0
	const themes = counts['update/themes'] ? counts['update/themes'] : 0

	return {
		total: plugins + themes,
		hasUpdates: 0 < ( plugins + themes ),
		plugins,
		themes
	}
}

export default useUpdates
