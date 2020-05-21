import { useState, useLayoutEffect } from 'react'
import { getSystemStore } from 'assistant/data'

// useUpdateCounts()
export default ( initial = 0 ) => {
	const store = getSystemStore()
	const [ total, setTotal ] = useState( initial )

	// Get resolve count values
	// Ensures values are never undefined
	const selectCounts = state => {
		const { counts } = state
		const plugins = counts['update/plugins'] ? counts['update/plugins'] : 0
		const themes = counts['update/themes'] ? counts['update/themes'] : 0

		return {
			plugins,
			themes,
			combined: themes + plugins
		}
	}

	// Listen for updates when the store changes
	// But only setTotal when there's a change
	useLayoutEffect( () => {
		const { combined } = selectCounts( store.getState() )

		// Set inital value - overrides inital
		setTotal( combined )

		return store.subscribe( () => {
			const { combined } = selectCounts( store.getState() )

			// If the value is different, trigger re-render
			total !== ( combined ) && setTotal( combined )
		} )
	}, [] )

	const { plugins, themes, combined } = selectCounts( store.getState() )

	return {
		total: combined,
		hasUpdates: 0 < combined,
		plugins,
		themes
	}
}
