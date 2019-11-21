
export const isModifiedKeyEvent = e => {
	return !! ( e.metaKey || e.altKey || e.ctrlKey || e.shiftKey )
}
