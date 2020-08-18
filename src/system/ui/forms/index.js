import Form from '@beaverbuilder/forms'
import * as Items from './items'

Object.keys( Items ).map( key => {
	Form[ key ] = Items[ key ]
} )

export default Form
