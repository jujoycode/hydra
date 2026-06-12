import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en_auth from './en/auth.json'
import en_common from './en/common.json'
import en_dashboard from './en/dashboard.json'
import en_issue from './en/issue.json'
import en_member from './en/member.json'
import en_nav from './en/nav.json'
import en_project from './en/project.json'
import en_settings from './en/settings.json'
import en_workspace from './en/workspace.json'
import ko_auth from './ko/auth.json'
import ko_common from './ko/common.json'
import ko_dashboard from './ko/dashboard.json'
import ko_issue from './ko/issue.json'
import ko_member from './ko/member.json'
import ko_nav from './ko/nav.json'
import ko_project from './ko/project.json'
import ko_settings from './ko/settings.json'
import ko_workspace from './ko/workspace.json'

export const defaultNS = 'common'
export const resources = {
  ko: {
    auth: ko_auth,
    common: ko_common,
    nav: ko_nav,
    project: ko_project,
    issue: ko_issue,
    member: ko_member,
    workspace: ko_workspace,
    dashboard: ko_dashboard,
    settings: ko_settings
  },
  en: {
    auth: en_auth,
    common: en_common,
    nav: en_nav,
    project: en_project,
    issue: en_issue,
    member: en_member,
    workspace: en_workspace,
    dashboard: en_dashboard,
    settings: en_settings
  }
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('hydra-language') || 'ko',
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false
  }
})

export default i18n

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['ko']
  }
}
