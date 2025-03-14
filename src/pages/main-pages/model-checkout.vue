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
import axios from 'axios'

import { useConfigStore } from '@core/stores/config'

const router = useRouter()

const storedData = localStorage.getItem('userData');
const userData = storedData ? JSON.parse(storedData) : null;

if (!userData) {
  router.push({ path: '/pages/authentication/login-v1', query: { pending_to_go: '/main-pages/model-checkout' } });
}

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

const getAddress = async () => {
  try {
    // Await the response from axios
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/addresses/getAddress`, {
      userId: userData.id
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const address = response.data.address

    // Ensure response data is handled correctly
    if (address) {
      modelCheckoutData.value.addresses.push({
        id: address._id,
        title: `${address.name} ${address.lastName}`,  // Adjust the title as needed
        email: address.email,  // Adjust the email
        desc: `${address.street}, ${address.city}, ${address.state}, ${address.country}`,  // Adjust the description
        subtitle: address.phone,  // Adjust subtitle
        value: address.place  // Adjust the value
      });
    }
  } catch (error) {
    console.log('Error in getAddress: ', error.response?.data?.message || error.message);
  }
};

let modelCheckoutData = ref<ModelCheckoutData>({
  modelItems: [],
  promoCode: '',
  note: '',
  orderAmount: 0,
  deliveryAddress: 'Casa',
  deliverySpeed: 'free',
  deliveryCharges: 0,
  addresses: [],
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

// Use onMounted or another async lifecycle hook to fetch addresses
onMounted(async () => {
  await getAddress();
  console.log(modelCheckoutData.value.addresses)
  // console.log(modelCheckoutData.value.addresses)
});
</script>

<template>
  <div class="model-checkout-page">
    <Navbar />
    <VContainer>
      <div class="model-checkout-card">
        <VCard>
          <VCardText>
            <!-- 👉 Stepper -->
            <AppStepper v-model:current-step="currentStep" class="model-checkout-stepper" :items="modelCheckoutSteps"
              :direction="$vuetify.display.mdAndUp ? 'horizontal' : 'vertical'" align="center" />
          </VCardText>
          <VDivider />
          <VCardText>
            <!-- 👉 stepper content -->
            <VWindow v-model="currentStep" class="disable-tab-transition" :touch="false">
              <VWindowItem>
                <CartContent v-model:current-step="currentStep" v-model:model-checkout-data="modelCheckoutData"
                  @update:checkout-data="(data) => {
                    modelCheckoutData = data
                    console.log('CART: ', modelCheckoutData);
                  }" />
              </VWindowItem>
              <VWindowItem>
                <ViewerContent v-model:current-step="currentStep" v-model:model-checkout-data="modelCheckoutData"
                  @update:checkout-data="(data) => {
                    if (modelCheckoutData !== data) {
                      modelCheckoutData = data;
                      console.log('VIEWER: ', modelCheckoutData)
                    }
                  }" />
              </VWindowItem>
              <VWindowItem>
                <PaymentContent v-model:current-step="currentStep" v-model:model-checkout-data="modelCheckoutData"
                  @update:checkout-data="(data) => {
                    modelCheckoutData = data
                    console.log('PAYMENT: ', modelCheckoutData)
                  }" />
                <AddressContent v-model:current-step="currentStep" v-model:model-checkout-data="modelCheckoutData"
                  @update:checkout-data="(data) => {
                    modelCheckoutData = data
                    console.log('ADDRESS: ', modelCheckoutData)
                  }" />
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
