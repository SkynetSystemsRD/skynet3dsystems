<script setup lang="ts">
import Footer from '@/views/main-pages/main-page-footer.vue'
import Navbar from '@/views/main-pages/main-page-navbar.vue'
import AddressContent from '@/views/wizard-examples/model-checkout/Address.vue'
import CartContent from '@/views/wizard-examples/model-checkout/Cart.vue'
import ConfirmationContent from '@/views/wizard-examples/model-checkout/Confirmation.vue'
import PaymentContent from '@/views/wizard-examples/model-checkout/Payment.vue'
import type { ModelCheckoutData } from '@/views/wizard-examples/model-checkout/types'
import googleHome from '@images/pages/google-home.png'
import iphone11 from '@images/pages/iphone-11.png'
import uploadModel from '@images/svg/3d-printer6.svg'
import viewModel from '@images/svg/3d-printer9.svg'
import customPayment from '@images/svg/payment.svg'
import customTrending from '@images/svg/trending.svg'

import { useConfigStore } from '@core/stores/config'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const store = useConfigStore()

store.skin = 'default'

const modelCheckoutSteps = [
  {
    title: 'Sube tus Modelos 3D',
    icon: uploadModel,
  },
  {
    title: 'Verifica tus Modelos 3D',
    icon: viewModel,
  },
  {
    title: 'Formas de Pago',
    icon: customPayment,
  },
  {
    title: 'Confirmación',
    icon: customTrending,
  },
]

const modelCheckoutData = ref<ModelCheckoutData>({
  cartItems: [
    {
      id: 1,
      name: 'Google - Google Home - White',
      seller: 'Google',
      inStock: true,
      rating: 4,
      price: 299,
      discountPrice: 359,
      image: googleHome,
      quantity: 1,
      estimatedDelivery: '18th Nov 2021',
    },
    {
      id: 2,
      name: 'Apple iPhone 11 (64GB, Black)',
      seller: 'Apple',
      inStock: true,
      rating: 4,
      price: 899,
      discountPrice: 999,
      image: iphone11,
      quantity: 1,
      estimatedDelivery: '20th Nov 2021',
    },
  ],
  promoCode: '',
  orderAmount: 1198,
  deliveryAddress: 'home',
  deliverySpeed: 'free',
  deliveryCharges: 0,
  addresses: [
    {
      title: 'John Doe (Default)',
      desc: '4135 Parkway Street, Los Angeles, CA, 90017',
      subtitle: '1234567890',
      value: 'home',
    },
    {
      title: 'ACME Inc.',
      desc: '87 Hoffman Avenue, New York, NY, 10016',
      subtitle: '1234567890',
      value: 'office',
    },
  ],
})

const currentStep = ref(0)
</script>

<template>
  <div class="model-checkout-page">
    <Navbar />
    <VContainer>
      <div class="model-checkout-card">
        <VCard>
          <VCardText>
            <!-- 👉 Stepper -->
            <AppStepper
              v-model:current-step="currentStep"
              class="model-checkout-stepper"
              :items="modelCheckoutSteps"
              :direction="$vuetify.display.mdAndUp ? 'horizontal' : 'vertical'"
              align="center"
            />
          </VCardText>
          <VDivider />
          <VCardText>
            <!-- 👉 stepper content -->
            <VWindow
              v-model="currentStep"
              class="disable-tab-transition"
              :touch="false"
            >
              <VWindowItem>
                <CartContent
                  v-model:current-step="currentStep"
                  v-model:model-checkout-data="modelCheckoutData"
                />
              </VWindowItem>
              <VWindowItem>
                <AddressContent
                  v-model:current-step="currentStep"
                  v-model:model-checkout-data="modelCheckoutData"
                />
              </VWindowItem>
              <VWindowItem>
                <PaymentContent
                  v-model:current-step="currentStep"
                  v-model:model-checkout-data="modelCheckoutData"
                />
              </VWindowItem>
              <VWindowItem>
                <ConfirmationContent v-model:model-checkout-data="modelCheckoutData" />
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </div>
    </VContainer>
    <Footer />
  </div>
</template>

<style lang="scss">
.model-checkout-card {
  margin-block: 10.5rem 5.25rem;
}

@media (max-width: 960px) and (min-width: 600px) {
  .model-checkout-page {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}

@media (max-width: 600px) {
  .model-checkout-card {
    margin-block-start: 6rem;
  }
}
</style>
