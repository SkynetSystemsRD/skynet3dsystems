<script setup lang="ts">
import AddressContent from '@/views/wizard-examples/model-checkout/Address.vue'
import CartContent from '@/views/wizard-examples/model-checkout/Cart.vue'
import ConfirmationContent from '@/views/wizard-examples/model-checkout/Confirmation.vue'
import PaymentContent from '@/views/wizard-examples/model-checkout/Payment.vue'
import type { ModelCheckoutData } from '@/views/wizard-examples/model-checkout/types'
import customAddress from '@images/svg/address.svg'
import customCart from '@images/svg/cart.svg'
import customPayment from '@images/svg/payment.svg'
import customTrending from '@images/svg/trending.svg'

const modelCheckoutSteps = [
  {
    title: 'Cart',
    icon: customCart,
  },
  {
    title: 'Address',
    icon: customAddress,
  },
  {
    title: 'Payment',
    icon: customPayment,
  },
  {
    title: 'Confirmation',
    icon: customTrending,
  },
]


// from api data
const modelCheckoutData = ref<ModelCheckoutData>({
  modelItems: [
    // {
    //   id: 1,
    //   format: 'gltf',
    //   filePath: '/xyzCalibration_cube.gltf',
    //   fileName: 'xyzCalibration_cube.gltf',
    //   size: 235654,
    //   octetStreamContent: '',
    //   uuid: '',
    //   dimentions: {
    //     x: 42,
    //     y: 42,
    //     z: 42
    //   }, 
    //   weight: 250
    // },
    // {
    //   id: 1,
    //   format: 'gltf',
    //   filePath: '/xyzCalibration_cube.gltf',
    //   fileName: 'xyzCalibration_cube.gltf',
    //   size: 235654,
    //   octetStreamContent: '',
    //   uuid: '',
    //   dimentions: {
    //     x: 42,
    //     y: 42,
    //     z: 42
    //   }, 
    //   weight: 250
    // },
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
                  :current-step="currentStep"
                  :model-checkout-data="modelCheckoutData"
                />
              </VWindowItem>
              <VWindowItem>
                <ViewerContent
                  :current-step="currentStep"
                  :model-checkout-data="modelCheckoutData"
                />
              </VWindowItem>
              <VWindowItem>
                <PaymentContent
                  :current-step="currentStep"
                  :model-checkout-data="modelCheckoutData"
                />
                <AddressContent
                  :current-step="currentStep"
                  :model-checkout-data="modelCheckoutData"
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
