<script setup lang="ts">
import Banner from '@/views/main-pages/landing-page/banner.vue'
import ContactUs from '@/views/main-pages/landing-page/contact-us.vue'
import CustomersReview from '@/views/main-pages/landing-page/customers-review.vue'
import FaqSection from '@/views/main-pages/landing-page/faq-section.vue'
import Home from '@/views/main-pages/landing-page/home.vue'
import OurTeam from '@/views/main-pages/landing-page/our-team.vue'
import ProductStats from '@/views/main-pages/landing-page/product-stats.vue'
import Services from '@/views/main-pages/landing-page/services.vue'
import Tecnologies from '@/views/main-pages/landing-page/tecnologies.vue'
import Footer from '@/views/main-pages/main-page-footer.vue'
import Navbar from '@/views/main-pages/main-page-navbar.vue'
import { useConfigStore } from '@core/stores/config'

const store = useConfigStore()

store.skin = 'default'
definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const activeSectionId = ref()

const refHome = ref()
const refServices = ref()
const refTeam = ref()
const refContact = ref()
const refFaq = ref()

useIntersectionObserver(
  [refHome, refServices, refTeam, refContact, refFaq],
  ([{ isIntersecting, target }]) => {
    if (isIntersecting)
      activeSectionId.value = target.id
  },
  {
    threshold: 0.25,
  },
)
</script>

<template>
  <div class="landing-page-wrapper">
    <Navbar :active-id="activeSectionId" />

    <!-- 👉 Hero Section  -->
    <Home ref="refHome" />

    <!-- 👉 Useful Services  -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <Services ref="refServices" />
    </div>

    <!-- 👉 Customer Review -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <CustomersReview />
    </div>

    <!-- 👉 Our Team -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <OurTeam ref="refTeam" />
    </div>

    <!-- 👉 Tecnologies -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <Tecnologies />
    </div>

    <!-- 👉 Product stats -->
    <ProductStats />

    <!-- 👉 FAQ Section -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <FaqSection ref="refFaq" />
    </div>

    <!-- 👉 Banner  -->
    <Banner />

    <!-- 👉 Contact Us  -->
    <ContactUs ref="refContact" />

    <!-- 👉 Footer -->
    <Footer />
  </div>
</template>

<style lang="scss">
@media (max-width: 960px) and (min-width: 600px) {
  .landing-page-wrapper {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
</style>
