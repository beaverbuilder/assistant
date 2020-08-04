import { getPostConfig, getPostData } from './post'
import { getImageConfig, getImageData } from './image'
import { getSvgConfig, getSvgData } from './svg'

export const getFormConfig = ( fields, item, setItem ) => {
	switch ( item.type ) {
		case 'post':
			return getPostConfig( fields, item, setItem )
		case 'image':
			return getImageConfig( fields, item, setItem )
		case 'svg':
			return getSvgConfig( fields, item, setItem )
		default:
			return {}
	}
}

export const getFormData = ( values, data ) => {
	switch ( values.type ) {
		case 'post':
			return getPostData( values, data )
		case 'image':
			return getImageData( values, data )
		case 'svg':
			return getSvgData( values, data )
		default:
			return data
	}
}
