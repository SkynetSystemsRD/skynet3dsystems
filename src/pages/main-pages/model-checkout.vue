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
const route = useRoute();
const from = route.query.from;

const storedData = localStorage.getItem('userData');
const userData = storedData ? JSON.parse(storedData) : null;
const octetData = ref('');

const getData = (id, callback) => {
  const dbRequest = indexedDB.open('OctetDB', 1);

  dbRequest.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction('dataStore', 'readonly');
    const store = transaction.objectStore('dataStore');
    const getRequest = store.get(id);

    getRequest.onsuccess = function () {
      callback(getRequest.result?.content || null);
    };
  };
};

if (!userData) {
  router.push({ path: '/pages/authentication/login-v1', query: { pending_to_go: '/main-pages/model-checkout' } });
}
else if (from === 'image-to-3d') {
  getData('imageData', (imageData) => {
    getData('octetData', (octetData) => {
      modelCheckoutData.value.modelItems.push({
        id: 1,
        fileName: 'TuModeloSkynet3DSystems.gltf',
        filePath: '/TuModeloSkynet3DSystems.gltf',
        format: 'gltf'.toUpperCase(),
        isSupported: 'gltf',
        size: 500,
        imageContent: imageData,
        octetStreamContent: octetData,
        dimentions: {
          x: 1,
          y: 1,
          z: 1
        },
        weight: 0, // dar el valor correspondiente
        uuid: 'uuid', // dar el valor correspondiente
        price: 0
      });
    });
  });
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
    title: 'Formas de Pago y Envio',
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
  const maxRetries = 5; // Maximum number of retries
  const retryDelay = 1000; // Delay in milliseconds between retries

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Await the response from axios
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/addresses/getAddress`, {
        userId: userData.id
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const address = response.data.address;

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
        break; // Successfully got the address, so break out of the loop
      }
    } catch (error) {
      console.log(`Error in getAddress (Attempt ${attempt}/${maxRetries}): `, error.response?.data?.message || error.message);

      if (attempt < maxRetries) {
        // Wait for a delay before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.log('Max retries reached. Could not fetch the address.');
      }
    }
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
const confirmed = ref(false)

// Use onMounted or another async lifecycle hook to fetch addresses
onMounted(async () => {
  await getAddress();
  // console.log(modelCheckoutData.value.addresses)
});
</script>

<template>
  <div class="model-checkout-page">
    <Navbar />
    <VContainer>
      <div class="model-checkout-card">
        <VCard>
          <VCardText v-if="!confirmed">
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
                <ConfirmationContent v-model:model-checkout-data="modelCheckoutData" @confirm:checkout-data="() => {
                  confirmed = true
                  console.log('CONFIRM: ', modelCheckoutData)
                }" />
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
