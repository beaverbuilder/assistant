import React from 'react'
import classname from 'classnames'
import Form from '@beaverbuilder/forms'
import * as Items from './items'
import '@beaverbuilder/forms/dist/index.css'

Object.keys( Items ).map( key => {
	Form[ key ] = Items[ key ]
	Form[ key ].displayName = `Form.${ key }`
} )

export { Form }
