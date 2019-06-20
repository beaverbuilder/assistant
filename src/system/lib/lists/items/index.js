
export const getDefaultItemProps = ( item, index ) => {
	let props = {}
	// Find a key
	props.key = index

	// Find a label
	if ( 'string' === typeof item ) {
		props.label = item
	} else if ( 'object' === typeof item ) {
		const labelKeys = ['label', 'title', 'name', 'postTitle', 'text' ]
		const labelKey = labelKeys.find( key => item.hasOwnProperty( key ) )
		if ( labelKey ) props.label = item[labelKey]
	}

	// Find subtitle
	if ( 'object' === typeof item ) {
		const subtitleKeys = ['subtitle', 'description', 'caption']
		const subtitleKey = subtitleKeys.find( key => item.hasOwnProperty( key ) )
		if ( subtitleKey ) props.description = item[subtitleKey]
	}

	// Find thumbnail
	if ( 'object' === typeof item ) {
		const imgKeys = ['thumbnail', 'thumb', 'icon', 'image', 'img', 'cover' ]
		const imgKey = imgKeys.find( key => item.hasOwnProperty( key ) )
		if ( imgKey ) props.thumbnail = item[imgKey]
	}

	return props
}
