import { createContext } from 'react'
import { useFormData } from './use-form-data'
import { useForm } from './use-form'
import { Form, Section, Item, Footer } from './parts'
import * as Items from './items'
import './style.scss'

// Form Context
Form.Context = createContext( {} )

// Form Hooks
Form.useFormData = useFormData
Form.useForm = useForm

// Form Part Components
Form.Section = Section
Form.Item = Item
Form.Footer = Footer
Form.Section = Section

// Form Item Components
Object.keys( Items ).map( key => {
	Form[ key ] = Items[ key ]
	Form[ key ].displayName = `Form.${ key }`
} )

export default Form
