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

// from api data
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
  orderAmount: 0,
  deliveryAddress: 'casa',
  deliverySpeed: 'free',
  deliveryCharges: 0,
  addresses: [
    // {
    //   title: 'Juan Perez (Predeterminado)',
    //   desc: 'Avenida Winston Churchill, Santo Domingo, DN, República Dominicana',
    //   subtitle: '1234567890',
    //   value: 'Casa',
    // },
    // {
    //   title: 'Skynet 3D Systems',
    //   desc: 'Avenida 27 de Febrero, Santo Domingo, DN, República Dominicana',
    //   subtitle: '1234567890',
    //   value: 'Trabajo',
    // },
  ],
  paymentMethod: {
    cash: false,
    transfer: {
      name: '',
      owner: '',
      accountNumber: 0,
      accountType: ''
    },
    card: ''
  }
})

// function updateModels(data: ModelCheckoutData, component: string){
//   if (component === 'cart' && modelCheckoutData.value !== data) {
//     modelCheckoutData.value = data;
//   } else if (component === 'address') {
//     modelCheckoutData.value.addresses = data.addresses;
//     modelCheckoutData.value.deliveryAddress = data.deliveryAddress;
//   }
//   // Solo actualiza si hay cambios
//   console.log(`MODELCHECKOUTDATA: ${component}: `, modelCheckoutData.value);
// }

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
                  @update:checkout-data="(data) => { 
                    modelCheckoutData = data 
                    console.log('CART: ', modelCheckoutData);
                  }"
                />
              </VWindowItem>
              <VWindowItem>
                <ViewerContent
                  v-model:current-step="currentStep"
                  v-model:model-checkout-data="modelCheckoutData"
                  @update:checkout-data="(data) => { 
                    if (modelCheckoutData !== data) { 
                      modelCheckoutData = data; 
                      console.log('VIEWER: ', modelCheckoutData)
                    }
                  }"
                />
              </VWindowItem>
              <VWindowItem>
                <PaymentContent
                  v-model:current-step="currentStep"
                  v-model:model-checkout-data="modelCheckoutData"
                  @update:checkout-data="(data) => { 
                    modelCheckoutData = data 
                    console.log('PAYMENT: ', modelCheckoutData) 
                  }"
                />
                <AddressContent
                  v-model:current-step="currentStep"
                  v-model:model-checkout-data="modelCheckoutData"s
                  @update:checkout-data="(data) => { 
                    modelCheckoutData.addresses = data.addresses; 
                    modelCheckoutData.deliveryAddress = data.deliveryAddress; 
                    modelCheckoutData.orderAmount = data.orderAmount; 
                    console.log('ADDRESS: ', modelCheckoutData) 
                  }"
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
