import { Layout as FLUID_Layout } from '@beaverbuilder/fluid'
import Attention from './attention'
import PublishBar from './publish-bar'
import Table from './table'
import { Tabs, TabsToolbar, CurrentTab } from './nav'
import { SidebarBackdrop, SidebarSection } from './sidebar'

const Layout = {
	...FLUID_Layout,
	Attention,
	PublishBar,
	Table,
	Tabs,
	TabsToolbar,
	CurrentTab,
	SidebarBackdrop,
	SidebarSection,
}

export default Layout
