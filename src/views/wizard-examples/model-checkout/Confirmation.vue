<script setup lang="ts">
import axios from 'axios';
import type { ModelCheckoutData } from './types';

const props = defineProps<{
  currentStep?: number
  modelCheckoutData: ModelCheckoutData
}>()

defineEmits<{
  (e: 'update:currentStep', value: number): void
  (e: 'update:checkout-data', value: ModelCheckoutData): void
}>()

const storedData = localStorage.getItem('userData');
const userData = storedData ? JSON.parse(storedData) : null;
const paymentMethod = ref({})

const createProject = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/projects/createProject`, {
      userId: userData.id
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.project) {
      return response.data.project
    }
  } catch (error) {
    console.log('createProject: ', error.response?.data?.message || error.message);
    return null
  }
}

const saveBillingDetails = (proyectId: string, addressId: string) => {
  try {
    const response = axios.post(`${import.meta.env.VITE_API_BASE_URL}/billing-details/createBillingDetails`, {
      projectId: proyectId,
      addressId: addressId,
      userId: userData.id,
      deliverySpeed: props.modelCheckoutData.deliverySpeed,
      note: props.modelCheckoutData.note,
      totalAmount: props.modelCheckoutData.orderAmount,
      promoCode: props.modelCheckoutData.promoCode,
      paymentMethod: paymentMethod.value,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.result) {
      messageInfo.value = 'Muchas gracias, pedido confirmado 😇'
    } else {
      console.error("El campo 'user' no está presente en la respuesta");
      messageInfo.value = '¡Uy! Algo salió mal 😵‍💫 Pero no te preocupes, estamos en ello 🛠️✨'
      isSnackbarScrollReverseVisible.value = true
    }
  } catch (error) {
    console.log('confirmOrder: ', error.response?.data?.message || error.message);
    isSnackbarScrollReverseVisible.value = true
  }
}

const confirmOrder = async () => {
  if (
    props.modelCheckoutData.modelItems.length > 0 &&
    props.modelCheckoutData.addresses.length > 0 &&
    (props.modelCheckoutData.paymentMethod.cash || props.modelCheckoutData.paymentMethod.card !== '' || props.modelCheckoutData.paymentMethod.transfer.accountNumber !== 0)
  ) {
    const projectId = await createProject()
    const addressId = props.modelCheckoutData.addresses.find(a => a.value === props.modelCheckoutData.deliveryAddress)?.id;
    saveBillingDetails(projectId, addressId)

    props.modelCheckoutData.modelItems.forEach(model => {
      try {
        const response = axios.post(`${import.meta.env.VITE_API_BASE_URL}/models/saveModels`, {
          projectId: projectId,
          userId: userData.id,
          fileName: model.fileName.split('.')[0],
          filePath: model.filePath,
          size: model.size,
          dimentions: {
            x: model.dimentions.x,
            y: model.dimentions.y,
            z: model.dimentions.z
          },
          format: model.format.toLowerCase(),
          weight: model.weight,
          price: model.price,
          uuid: model.uuid,
          imageContent: model.imageContent,
          octetStreamContent: model.octetStreamContent,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.result) {
          messageInfo.value = 'Muchas gracias, pedido confirmado 😇'
          isSnackbarScrollReverseVisible.value = true
        } else {
          console.error("El campo 'user' no está presente en la respuesta");
          messageInfo.value = '¡Uy! Algo salió mal 😵‍💫 Pero no te preocupes, estamos en ello 🛠️✨'
          isSnackbarScrollReverseVisible.value = true
        }
      } catch (error) {
        console.log('confirmOrder: ', error.response?.data?.message || error.message);
        isSnackbarScrollReverseVisible.value = true
      }
    })
  }
  else {
    messageInfo.value = '🚨 ¡Ups! Antes de confirmar, revisa que hayas seleccionado los modelos, la dirección y el método de pago. 🏡💳✅ ¡Completa estos datos y estarás listo para continuar! 🚀'
    isSnackbarScrollReverseVisible.value = true
  }
}

const selectedDeliveryAddress = computed(() => {
  if (props.modelCheckoutData.paymentMethod.cash) {
    // with cash

    paymentMethod.value = { method: 'En efectivo' }

    return [{
      value: 1,
      title: 'En efectivo',
      desc: 'El 50% restante del total se realiza en la entrega',
      subtitle: ''
    }]
  }
  else if (props.modelCheckoutData.paymentMethod.card !== '') {
    // with card

    paymentMethod.value = { method: `Tarjeta Credito/Debito:${props.modelCheckoutData.paymentMethod.card}` }

    return [{
      value: 1,
      title: 'Tarjeta Credito/Debido',
      desc: 'El pago se realizara por tarjeta de credito o debido',
      subtitle: 'MasterCard debito termina en ** 8546'
    }]
  }
  else if (props.modelCheckoutData.paymentMethod.transfer.accountNumber !== 0) {
    // with transfer

    paymentMethod.value = { method: `Transferencia Bancaria:${props.modelCheckoutData.paymentMethod.transfer.name}` }

    return [{
      value: 1,
      title: 'Transferencia Bancaria',
      desc: 'El pago se realizara mediante transaccion bancaria del banco',
      subtitle: props.modelCheckoutData.paymentMethod.transfer.name
    }]
  }
  else {
    return [{
      value: null,
      title: null,
      desc: null,
      subtitle: null
    }]
  }
})

const resolveDeliveryMethod = computed(() => {
  if (props.modelCheckoutData.deliverySpeed === 'overnight')
    return { method: 'Envio Nocturno', desc: 'En 1h' }
  else if (props.modelCheckoutData.deliverySpeed === 'express')
    return { method: 'Envio Expreso', desc: 'Normalmente en 12h' }
  else
    return { method: 'Envio Estándar', desc: 'Normalmente en 24h' }
})
// Thank You! 😇
const messageInfo = ref('Ahora Verifica tu Pedido 👍')
const isSnackbarScrollReverseVisible = ref(false)

watch(() => props.modelCheckoutData, (value) => {
  // console.log('en confir: ', value)
})
</script>

<template>
  <section class="text-base">
    <div class="text-center">
      <h4 class="text-h4 mb-4">
        {{ messageInfo }}
      </h4>
      <p>
        Tu numero de orden es <span class="text-body-1 font-weight-medium text-high-emphasis">#1536548131</span>,
        verificala tus modelos antes de confirmarla
      </p>
      <p class="mb-0">
        Te enviaremos un correo a <span class="text-body-1 font-weight-medium text-high-emphasis">
          {{props.modelCheckoutData.addresses.find(address => address.value.toLowerCase() ===
            props.modelCheckoutData.deliveryAddress.toLowerCase())?.email}}
        </span> con la confirmacion de la orden y la factura
      </p>
      <p>Si el correo electrónico no ha llegado dentro de dos minutos, revise su carpeta de correo no deseado para ver
        si el correo electrónico fue enviado allí.</p>
      <div class="d-flex align-center gap-2 justify-center">
        <VIcon size="20" icon="tabler-clock" class="text-high-emphasis" />
        <span>Fecha del Pedido 25/05/2020 12:35pm</span>
      </div>
    </div>

    <VRow class="border rounded ma-0 mt-6">
      <VCol cols="12" md="4" class="pa-6" :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'">
        <div class="d-flex align-center gap-2 text-high-emphasis mb-4">
          <VIcon icon="tabler-map-pin" size="20" />
          <span class="text-base font-weight-medium">
            Metodo de Pago
          </span>
        </div>

        <template v-for="item in selectedDeliveryAddress" :key="item.value">
          <p class="mb-0">
            {{ item.title }}
          </p>
          <p class="mb-4">
            {{ item.desc }}
          </p>
          <div class="text-base">
            {{ item.subtitle }}
          </div>
        </template>
      </VCol>

      <VCol cols="12" md="4" class="pa-6" :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'">
        <div class="d-flex align-center gap-2 text-high-emphasis mb-4">
          <VIcon icon="tabler-credit-card" size="20" />
          <span class="text-base font-weight-medium">
            Dirección de Envio
          </span>
        </div>

        <template
          v-for="(item, index) in props.modelCheckoutData.addresses.filter(address => address.value.toLowerCase() == props.modelCheckoutData.deliveryAddress.toLowerCase())"
          :key="item.value">
          <p class="mb-0">
            {{ item.title }}
          </p>
          <p class="mb-4">
            {{ item.desc }}
          </p>

          <div class="text-base">
            +{{ item.subtitle }}
          </div>
        </template>
      </VCol>

      <VCol cols="12" md="4" class="pa-6">
        <div class="d-flex align-center gap-2 text-high-emphasis mb-4">
          <VIcon icon="tabler-ship" size="20" />
          <span class="text-base font-weight-medium">
            Metodo de Envio
          </span>
        </div>

        <p class="font-weight-medium">
          Metodo Preferido:
        </p>
        <p class="mb-0">
          {{ resolveDeliveryMethod.method }}
        </p>
        <p class="mb-0">
          ( {{ resolveDeliveryMethod.desc }} )
        </p>
      </VCol>
    </VRow>

    <VRow>
      <VCol cols="12" md="9">
        <!-- 👉 cart items -->
        <div class="border rounded">
          <template v-for="(item, index) in props.modelCheckoutData.modelItems" :key="item.name">
            <div class="d-flex align-start gap-4 pa-6 position-relative flex-column flex-sm-row"
              :class="index ? 'border-t' : ''">
              <div>
                <VImg width="80" :src="item.imageContent" />
              </div>

              <div class="d-flex w-100 justify-space-between gap-4"
                :class="$vuetify.display.width <= 700 ? 'flex-column' : 'flex-row'">
                <div>
                  <h6 class="text-h6 mb-2">
                    {{ item.fileName.split('.')[0] }}
                  </h6>
                  <div class="text-body-1 mb-2">
                    Formato:
                    <span class="d-inline-block text-primary"> {{ item.format }}</span>
                  </div>
                  <VChip :color="item.isSupported ? 'success' : 'error'" label size="small">
                    {{ item.isSupported ? 'Soportado' : 'No Soportado' }}
                  </VChip>
                </div>

                <!-- <VSpacer /> -->

                <div class="d-flex text-base"
                  :class="$vuetify.display.width <= 700 ? 'align-self-start' : 'align-self-center'">
                  <!-- <div class="text-primary">
                    ${{ item.price }}
                  </div>
                  <div>/</div> -->
                  <div>
                    RD${{ item.price }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </VCol>

      <VCol cols="12" md="3">
        <div class="border rounded">
          <div class="border-b pa-6">
            <h6 class="text-base font-weight-medium mb-4">
              Detalles de Precio
            </h6>

            <div class="d-flex align-center justify-space-between text-base mb-4">
              <span class="text-high-emphasis">Total de la Orden</span>
              <span>${{ props.modelCheckoutData.orderAmount }}.00</span>
            </div>

            <div class="d-flex justify-space-between text-base">
              <div class="text-high-emphasis">
                Cargos
              </div>
              <div v-if="props.modelCheckoutData.deliverySpeed === 'free'" class="d-flex align-center">
                <div class="text-decoration-line-through text-disabled me-2">
                  $200.00
                </div>
                <VChip size="small" color="success">
                  Gratis
                </VChip>
              </div>
              <div v-else>
                <span>${{ props.modelCheckoutData.deliveryCharges }}</span>
              </div>
            </div>
          </div>
          <div class="d-flex align-center justify-space-between text-high-emphasis font-weight-medium pa-6">
            <span>Total</span>
            <span>${{ props.modelCheckoutData.orderAmount + props.modelCheckoutData.deliveryCharges }}.00</span>
          </div>
        </div>

        <br>

        <VBtn @click="confirmOrder">
          Confirmar Pedido
        </VBtn>
      </VCol>
    </VRow>
  </section>

  <VSnackbar v-model="isSnackbarScrollReverseVisible" transition="scroll-y-reverse-transition" location="top end">
    {{ messageInfo }}
  </VSnackbar>
</template>
