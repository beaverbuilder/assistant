import { createContext } from 'react'
import { Form, Section, Item, Footer, Input } from './parts'
import { useFormData } from './use-form-data'

// Form Context
Form.Context = createContext( {} )
Form.Context.displayName = 'Form.Context'

// Form Hooks
Form.useFormData = useFormData

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
Form.Input = Input
Form.Input.displayName = 'Form.Input'

export default Form
