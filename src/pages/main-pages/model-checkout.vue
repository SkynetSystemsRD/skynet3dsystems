<script setup lang="ts">
import Footer from '@/views/main-pages/main-page-footer.vue'
import Navbar from '@/views/main-pages/main-page-navbar.vue'
import AddressContent from '@/views/wizard-examples/model-checkout/Address.vue'
import CartContent from '@/views/wizard-examples/model-checkout/Cart.vue'
import ConfirmationContent from '@/views/wizard-examples/model-checkout/Confirmation.vue'
import PaymentContent from '@/views/wizard-examples/model-checkout/Payment.vue'
import type { ModelCheckoutData } from '@/views/wizard-examples/model-checkout/types'
import ViewerContent from '@/views/wizard-examples/model-checkout/Viewer.vue'
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
    enabled: true
  },
  {
    title: 'Verifica tus Modelos 3D',
    icon: viewModel,
    enabled: false
  },
  {
    title: 'Formas de Pago',
    icon: customPayment,
    enabled: false
  },
  {
    title: 'Confirmación',
    icon: customTrending,
    enabled: false
  },
]

let modelCheckoutData = ref<ModelCheckoutData>({
  modelItems: [],
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

function updateModels(data: ModelCheckoutData){
  modelCheckoutData.value = data

  console.log("modelCheckoutData.value: ", modelCheckoutData.value)
}
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
                  @update:checkout-data="(data) => updateModels(data)"
                />
              </VWindowItem>
              <VWindowItem>
                <ViewerContent
                  v-model:current-step="currentStep"
                  v-model:model-checkout-data="modelCheckoutData"
                />
              </VWindowItem>
              <VWindowItem>
                <PaymentContent
                  v-model:current-step="currentStep"
                  v-model:model-checkout-data="modelCheckoutData"
                />
                <AddressContent
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
