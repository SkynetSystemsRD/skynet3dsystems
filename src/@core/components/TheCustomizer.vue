<script setup lang="tsx">
import { staticPrimaryColor, staticPrimaryDarkenColor } from '@/plugins/vuetify/theme'
import { useConfigStore } from '@core/stores/config'
import { AppContentLayoutNav } from '@layouts/enums'
import { cookieRef, namespaceConfig } from '@layouts/stores/config'
import { useStorage } from '@vueuse/core'
import { useTheme } from 'vuetify'

const configStore = useConfigStore()

// 👉 Primary Color
const vuetifyTheme = useTheme()
const colors = [
  { main: staticPrimaryColor, darken: staticPrimaryDarkenColor },
  { main: '#0D9394', darken: '#0C8485' },
  { main: '#FFB400', darken: '#E6A200' },
  { main: '#FF4C51', darken: '#E64449' },
  { main: '#16B1FF', darken: '#149FE6' },
]

const customPrimaryColor = ref('#663131')

// 👉 Set layout to horizontal
configStore.isVerticalNavCollapsed = false
configStore.appContentLayoutNav = AppContentLayoutNav.Horizontal

// ℹ️ It will set primary color for current theme only
const setPrimaryColor = (color: { main: string; darken: string }) => {
  vuetifyTheme.themes.value[vuetifyTheme.name.value].colors.primary = color.main
  vuetifyTheme.themes.value[vuetifyTheme.name.value].colors['primary-darken-1'] = color.darken

  cookieRef<string | null>(`${vuetifyTheme.name.value}ThemePrimaryColor`, null).value = color.main
  cookieRef<string | null>(`${vuetifyTheme.name.value}ThemePrimaryDarkenColor`, null).value = color.darken

  useStorage<string | null>(namespaceConfig('initial-loader-color'), null).value = color.main
}
</script>
