import { Layout as FLUID_Layout } from 'fluid/ui'
import Message from './message'

const Layout = { ...FLUID_Layout }

Layout.Message = Message
Layout.Message.displayName = 'Layout.Message'

export default Layout
