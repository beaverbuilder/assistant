import { getCommunityAppConfig } from '@beaverbuilder/cloud-ui'
import { registerApp } from 'assistant'
import { Icon } from 'assistant/ui'
import '@beaverbuilder/cloud-ui/dist/index.css'

registerApp( 'discover', getCommunityAppConfig() )
