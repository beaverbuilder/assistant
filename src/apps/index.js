__webpack_public_path__ = `${ FL_ASSISTANT_CONFIG.pluginURL }/build/`

import './fl-home'
import './fl-manage'
import './fl-content'
import './fl-media'
import './fl-comments'
import './fl-updates'

// Hidden from production builds for now
// Use npm run build:pro or npm run dev to enable these apps
import './fl-cloud-connect'
import './libraries'

// Hidden from production
import './designsystem'

import './integrations'
