<script lang="ts" setup>
import navItems from '@/navigation/horizontal';

import { themeConfig } from '@themeConfig';

// Components
import Footer from '@/layouts/components/Footer.vue';
import { HorizontalNavLayout } from '@layouts';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'; /* PartiallyEnd: #3632/scriptSetup.vue */
</script>

<template>
  <HorizontalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar>
      <RouterLink
        to="/main-pages/landing-page"
        class="app-logo d-flex align-center gap-x-3"
      >
        <VNodeRenderer :nodes="themeConfig.app.logo" />

        <h1 class="app-title font-weight-bold leading-normal text-xl text-capitalize">
          {{ themeConfig.app.title }}
        </h1>
      </RouterLink>
      <VSpacer />
      <RouterLink
        class="mega-menu-item"
        to="/pages/authentication/login-v1"
      >
        <VBtn
          v-if="$vuetify.display.lgAndUp"
          prepend-icon="tabler-login"
          variant="elevated"
          color="primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Iniciar Sección
        </VBtn>
      </RouterLink>

      <!-- <NavSearchBar trigger-btn-class="ms-lg-n3" />

      <NavBarI18n
        v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
        :languages="themeConfig.app.i18n.langConfig"
      />

      <NavbarThemeSwitcher />
      <NavbarShortcuts />
      <NavBarNotifications class="me-2" />
      <UserProfile /> -->
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <TheCustomizer />
  </HorizontalNavLayout>
</template>

<style lang="css" module>
.mega-menu-item {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}
</style>
