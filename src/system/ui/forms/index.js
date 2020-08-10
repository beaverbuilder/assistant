import Form from '@beaverbuilder/forms'
import '@beaverbuilder/forms/dist/index.css'
import * as Items from './items'

Object.keys( Items ).map( key => {
	Form[ key ] = Items[ key ]
} )

export default Form
