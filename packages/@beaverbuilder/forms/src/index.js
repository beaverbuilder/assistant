import { createContext } from 'react'
import { useFormData } from './use-form-data'
import { useForm } from './use-form'
import { Form, Section, Item, Footer } from './parts'
import * as Items from './items'
import './style.scss'

// Form Context
Form.Context = createContext( {} )
Form.Context.displayName = 'Form.Context'

// Form Hooks
Form.useFormData = useFormData
Form.useForm = useForm

// Form Part Components
Form.Section = Section
Form.Section.displayName = 'Form.Section'

Form.Item = Item
Form.Item.displayName = 'Form.Item'

Form.Footer = Footer
Form.Footer.displayName = 'Form.Footer'

Form.Section = Section
Form.Section.displayName = 'Form.Section'

// Form Item Components
Object.keys( Items ).map( key => {
	Form[ key ] = Items[ key ]
	Form[ key ].displayName = `Form.${ key }`
} )

export default Form
