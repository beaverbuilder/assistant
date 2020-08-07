// Absolutely have to be set up first
import './libs'

// App Core
import * as BBAppCore from 'vendor-app-core'
FL.vendors.BBAppCore = BBAppCore

// Forms
import * as BBForms from 'vendor-forms'
FL.vendors.BBForms = BBForms

// FL.UID
import * as FLUID from '@beaverbuilder/fluid'
import '@beaverbuilder/fluid/dist/index.css'

FL.UID = FLUID

// Cloud UI
import '@beaverbuilder/cloud-ui/dist/index.css'
