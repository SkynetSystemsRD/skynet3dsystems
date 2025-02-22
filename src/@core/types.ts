import type { I18nLanguage, LayoutConfig } from '@layouts/types'
import type { LiteralUnion, ValueOf } from 'type-fest'
import type { Skins } from './enums'

interface ExplicitThemeConfig {
  app: {
    i18n: {
      defaultLocale: string
      langConfig: I18nLanguage[]
    }
    theme: LiteralUnion<'light' | 'dark' | 'system', string>
    skin: ValueOf<typeof Skins>
  }
  verticalNav: {
    isVerticalNavSemiDark: boolean
  }
}

export type UserThemeConfig = LayoutConfig & ExplicitThemeConfig

// SECTION Custom Input
export interface CustomInputContent {
  title: string
  desc?: string
  value: string
  subtitle?: string
  icon?: string | object
  images?: string
}

export interface GridColumn {
  cols?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
  xxl?: string
}

// Data table
export interface SortItem { key: string; order?: boolean | 'asc' | 'desc' }

export interface Options {
  page: number
  itemsPerPage: number
  sortBy: readonly SortItem[]
  groupBy: readonly SortItem[]
  search: string | undefined
}

export interface ModelItem {
  id: number
  fileName: string
  filePath: string
  format: string
  size: number
  octetStreamContent: string
  uuid: string
  dimentions: xyz;
  weight: number;
  price: number;
}

interface xyz {
  x: number | undefined,
  y: number | undefined,
  z: number | undefined,
}

export interface Addresses {
  title: string
  desc: string
  subtitle: string
  value: string
}

export interface ModelCheckoutData {
  modelItems: ModelItem[]
  promoCode: string
  orderAmount: number
  deliveryAddress: string
  deliverySpeed: string
  deliveryCharges: number
  addresses: Addresses[]
}

