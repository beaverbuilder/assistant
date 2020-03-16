import { Layout as FLUID_Layout } from 'fluid/ui'
import Message from './message'
import Attention from './attention'

const Layout = { ...FLUID_Layout }

Layout.Message = Message
Layout.Message.displayName = 'Layout.Message'

Layout.Attention = Attention
Layout.Attention.displayName = 'Layout.Attention'

export default Layout
