import { Layout as FLUID_Layout } from 'fluid/ui'
import Message from './message'
import Attention from './attention'
import PublishBar from './publish-bar'
import AspectBox from './aspect-box'
import Loading from './loading'

const Layout = { ...FLUID_Layout }

Layout.Message = Message
Layout.Message.displayName = 'Layout.Message'

Layout.Attention = Attention
Layout.Attention.displayName = 'Layout.Attention'

Layout.PublishBar = PublishBar
Layout.PublishBar.displayName = 'Layout.PublishBar'

Layout.AspectBox = AspectBox
Layout.AspectBox.displayName = 'Layout.AspectBox'

Layout.Loading = Loading
Layout.Loading.displayName = 'Layout.Loading'

export default Layout
