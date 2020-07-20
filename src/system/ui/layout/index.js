import { Layout as FLUID_Layout } from 'fluid'
import Attention from './attention'
import PublishBar from './publish-bar'
import Table from './table'
import { Tabs, TabsToolbar, CurrentTab } from './nav'

const Layout = {
	...FLUID_Layout,
	Attention,
	PublishBar,
	Table,
	Tabs,
	TabsToolbar,
	CurrentTab
}

export default Layout
