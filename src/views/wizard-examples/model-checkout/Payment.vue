<script setup lang="ts">
import banreservas from '@images/logos/banreservas.png';
import bhd from '@images/logos/bhd.png';
import popular from '@images/logos/popular.png';
import type { ModelCheckoutData } from './types';

const prop = defineProps<{
  currentStep?: number
  modelCheckoutData: ModelCheckoutData
}>()

const emit = defineEmits<{
  (e: 'update:currentStep', value: number): void
  (e: 'update:checkout-data', value: ModelCheckoutData): void
}>()

const modelCheckoutPaymentDataLocal = ref(prop.modelCheckoutData)
const paymentForm = ref(null);


const required = v => !!v || 'Campo requerido';
const cardNumberRule = v => (v.length === 16) || (v.length === 19) || "Debe tener 16 dígitos";
const expiryRule = v => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) || 'Formato MM/YY';
const cvvRule = v => /^\d{3,4}$/.test(v) || 'Debe tener 3 o 4 dígitos';

const selectedPaymentMethod = ref('card')

const currentTab = ref('banreservas');
const accounts = {
  banreservas: {
    bank: 'Banreservas',
    accountNumber: '123456789',
    accountType: 'Cuenta de Ahorro',
    holder: 'Nombre Completo',
    bankLogo: banreservas
  },
  popular: {
    bank: 'Banco Popular',
    accountNumber: '987654321',
    accountType: 'Cuenta de Ahorro', 
    holder: 'Nombre Completo',
    bankLogo: popular
  },
  bhd: {
    bank: 'Banco BHD',
    accountNumber: '112233445',
    accountType: 'Cuenta de Ahorro',
    holder: 'Nombre Completo',
    bankLogo: bhd
  }
};

const cardFormData = ref({
  cardNumber: null,
  cardName: '',
  cardExpiry: '',
  cardCvv: null,
  isCardSave: true,
})

const giftCardFormData = ref({
  giftCardNumber: null,
  giftCardPin: null,
})

const selectedDeliveryAddress = computed(() => {
  return modelCheckoutPaymentDataLocal.value.addresses.filter(address => {
    return address.value === modelCheckoutPaymentDataLocal.value.deliveryAddress
  })
})

const generateCardToken = (cardFormData) => {
  // Asegúrate de que la tarjeta esté guardada
  if (!cardFormData.value.isCardSave) {
    return null; // No generamos un token si no se guarda la tarjeta
  }
  
  // Concatenamos los datos de la tarjeta en un string (sin almacenar datos sensibles)
  const cardDataString = `${cardFormData.value.cardNumber}-${cardFormData.value.cardName}-${cardFormData.value.cardExpiry}-${cardFormData.value.cardCvv}`;
  
  // Generamos un hash único a partir de la cadena (esto puede ser con un algoritmo de hash más seguro)
  const token = btoa(cardDataString + Date.now()).slice(0, 32); // `btoa` convierte en base64 y `Date.now()` asegura unicidad
  
  return token;
}

const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return "";
    const last4 = cardNumber.slice(-4); // Obtiene los últimos 4 dígitos
    return "**** **** **** " + last4; // Reemplaza los anteriores con *
}

const validateForm = async () => {
  const { valid } = await paymentForm.value.validate();
  if (valid) {
    modelCheckoutPaymentDataLocal.value.paymentMethod.card = generateCardToken(cardFormData)
    cardFormData.value.cardNumber = maskCardNumber(cardFormData.value.cardNumber)
    console.log('Formulario válido', modelCheckoutPaymentDataLocal.value.paymentMethod.card);
  } else {
    console.log('Errores en el formulario');
  }
};

const resetForm = () => {
  cardFormData.value = {
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '', 
    isCardSave: false,
  };
  modelCheckoutPaymentDataLocal.value.paymentMethod.card = ''
  paymentForm.value.resetValidation();
};

const updateCartData = () => {
  emit('update:checkout-data', modelCheckoutPaymentDataLocal.value)
}

const nextStep = () => {
  updateCartData()
  emit('update:currentStep', prop.currentStep ? prop.currentStep + 1 : 1)
}

const paymentMethod = (method: string) => {
  switch (method){
    case 'cash':
      modelCheckoutPaymentDataLocal.value.paymentMethod.cash = true
      modelCheckoutPaymentDataLocal.value.paymentMethod.card = ''
      modelCheckoutPaymentDataLocal.value.paymentMethod.transfer = { 
        name: '',
        owner: '',
        accountNumber: 0,
        accountType: ''
      }
    break;
    case 'transfer': 
      modelCheckoutPaymentDataLocal.value.paymentMethod.cash = false
      modelCheckoutPaymentDataLocal.value.paymentMethod.card = ''
    break;
    case 'card':
      modelCheckoutPaymentDataLocal.value.paymentMethod.cash = false
      modelCheckoutPaymentDataLocal.value.paymentMethod.transfer = { 
        name: '',
        owner: '',
        accountNumber: 0,
        accountType: ''
      }
      validateForm()
    break;
  }
}

const selectedBankAccount = (data: string) => {
  if (selectedPaymentMethod.value !== 'transfer')
    return;

  switch (data){
    case 'banreservas':
      modelCheckoutPaymentDataLocal.value.paymentMethod.transfer = { 
        name: accounts.banreservas.bank,
        owner: accounts.banreservas.holder,
        accountNumber: parseInt(accounts.banreservas.accountNumber),
        accountType: accounts.banreservas.accountType
      }
    break;
    case 'popular': 
      modelCheckoutPaymentDataLocal.value.paymentMethod.transfer = { 
        name: accounts.popular.bank,
        owner: accounts.popular.holder,
        accountNumber: parseInt(accounts.popular.accountNumber),
        accountType: accounts.popular.accountType
      }
    break;
    case 'bhd': 
      modelCheckoutPaymentDataLocal.value.paymentMethod.transfer = { 
        name: accounts.bhd.bank,
        owner: accounts.bhd.holder,
        accountNumber: parseInt(accounts.bhd.accountNumber),
        accountType: accounts.bhd.accountType
      }
    break;
  }

  console.log('transfer info: ', modelCheckoutPaymentDataLocal.value.paymentMethod.transfer)
}

watch(
  () => [prop.currentStep, prop.modelCheckoutData],
  ([newStep, newAddress]) => {
    // updateCartData();
    modelCheckoutPaymentDataLocal.value = newAddress;
  }
);

</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="8"
    >
      <!-- 👉 Offers alert -->
      <VAlert
        type="success"
        variant="tonal"
        icon="tabler-tag"
        title="Ofertas Disponibles"
        closable
      >
        <template #text>
          <p class="mb-0">
            - 🎉 5% de Descuento Instantáneo en tu primer pedido de impresión 3D con Visa, Mastercard y American Express.
            <br>
            - 💰 RD$1,000 de Reembolso en compras superiores a RD$10,000 pagando con PayPal.
            <br>
            - 🚀 Envío Exprés Gratis en pedidos mayores a RD$7,000.
          </p>
        </template>
      </VAlert>

      <br>

      <VTabs
        v-model="selectedPaymentMethod"
        class="v-tabs-pill"
        density="comfortable"
      >
        <VTab value="cash-on-delivery" @click="paymentMethod('cash')">
          En Efectivo
        </VTab>
        <VTab value="transfer" @click="paymentMethod('transfer')">
          Transferencia Bancaria
        </VTab>
        <VTab value="card" @click="paymentMethod('card')">
          Tarjeta de Debido/Credito
        </VTab>
      </VTabs>

      <VWindow
        v-model="selectedPaymentMethod"
        style="max-inline-size: 600px;"
        :touch="false"
      >
        <VWindowItem
          value="card"
          class="ms-n3"
        >
        <VForm ref="paymentForm" @submit.prevent="validateForm">
          <VRow class="ma-0 pa-n2">
            <VCol cols="12">
              <AppTextField
                v-model="cardFormData.cardNumber"
                type="text"
                label="Número de Tarjeta"
                placeholder="**** **** **** 7898"
                :rules="[required, cardNumberRule]"
              />
            </VCol>

            <VCol cols="12" md="4">
              <AppTextField
                v-model="cardFormData.cardName"
                label="Nombre"
                placeholder="Juan Perez"
                :rules="[required]"
              />
            </VCol>

            <VCol cols="6" md="4">
              <AppTextField
                v-model="cardFormData.cardExpiry"
                label="Expiración"
                placeholder="MM/YY"
                :rules="[required, expiryRule]"
              />
            </VCol>

            <VCol cols="6" md="4">
              <AppTextField
                v-model="cardFormData.cardCvv"
                label="CVV"
                placeholder="•••"
                type="password" 
                :rules="[required, cvvRule]"
              >
                <template #append-inner>
                  <VTooltip text="Valor de Verificación de la Tarjeta" location="bottom">
                    <template #activator="{ props: tooltipProps }">
                      <VIcon v-bind="tooltipProps" size="20" icon="tabler-help" />
                    </template>
                  </VTooltip>
                </template>
              </AppTextField>
            </VCol>

            <VCol cols="12" class="pt-1">
              <VSwitch
                v-model="cardFormData.isCardSave"
                label="¿Guardar tarjeta para facturación futura?"
              />

              <div class="mt-4">
                <VBtn class="me-4" @click="validateForm">Guardar Cambios</VBtn>
                <VBtn variant="tonal" color="secondary" @click="resetForm">Borrar Todo</VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
        </VWindowItem>

        <VWindowItem value="cash-on-delivery">
          <p class="text-base text-high-emphasis my-6">
            Realiza tu pago en efectivo al momento de la entrega y recibe tu pedido de forma rápida y segura.
          </p>

          <VBtn @click="nextStep">
            Pagar en la Entregar
          </VBtn>
        </VWindowItem>

        <VWindowItem value="transfer">
          <h6 class="text-base font-weight-medium mt-6">
            Detalles de Numero de Cuenta
          </h6>

          <br>

          <VForm class="ms-n3">
            <VRow class="ma-0">
              <VCard class="w-100">
                <VTabs v-model="currentTab" grow>
                  <VTab value="banreservas">Banreservas</VTab>
                  <VTab value="popular">Popular</VTab>
                  <VTab value="bhd">BHD</VTab>
                </VTabs>

                <VCardText>
                  <VWindow v-model="currentTab" :click="selectedBankAccount(currentTab)">
                    <VWindowItem
                    v-for="(data, key) in accounts"
                    :key="key"
                    :value="key"
                  >
                    <VImg
                      :src="data.bankLogo"
                      alt="Bank Logo"
                      max-height="300"
                      max-width="200"
                      contain
                      class="ml-2"
                    />
                    <br>
                    <p><strong>Nombre:</strong> {{ data.holder }}</p>
                    <p><strong>Número de Cuenta:</strong> {{ data.accountNumber }}</p>
                    <p><strong>Tipo de Cuenta:</strong> {{ data.accountType }}</p>
                  </VWindowItem>
                  </VWindow>
                </VCardText>
              </VCard>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <VCard
        flat
        variant="outlined"
      >
        <!-- <VCardText>
          <h6 class="text-h6 mb-4">
            Detalles del Precio
          </h6>

          <div class="d-flex justify-space-between text-base mb-2">
            <span class="text-high-emphasis">Total de la Orden</span>
            <span>RD${{ modelCheckoutPaymentDataLocal.orderAmount }}.00</span>
          </div>

          <div class="d-flex justify-space-between text-base">
            <span class="text-high-emphasis">Cargos de Envio</span>
            <div
              v-if="modelCheckoutPaymentDataLocal.deliverySpeed === 'free'"
              class="d-flex align-center"
            >
              <div class="text-decoration-line-through text-disabled me-2">
                RD$5.00
              </div>
              <VChip
                size="small"
                color="success"
              >
                Gratis
              </VChip>
            </div>
            <div v-else>
              <span>RD${{ modelCheckoutPaymentDataLocal.deliveryCharges }}</span>
            </div>
          </div>
        </VCardText>

        <VDivider /> -->

        <VCardText>
          <!-- <div class="d-flex justify-space-between text-base mb-2">
            <span class="text-high-emphasis font-weight-medium">Total</span>
            <span class="font-weight-medium">RD${{ modelCheckoutPaymentDataLocal.orderAmount + modelCheckoutPaymentDataLocal.deliveryCharges }}.00</span>
          </div> -->

          <div class="d-flex justify-space-between text-base mb-4">
            <span class="text-high-emphasis font-weight-medium">Enviar a:</span>
            <VChip
              color="primary"
              class="text-capitalize"
              label
              size="small"
            >
              {{ modelCheckoutPaymentDataLocal.deliveryAddress }}
            </VChip>
          </div>

          <template
            v-for="item in selectedDeliveryAddress"
            :key="item.value"
          >
            <h6 class="text-base font-weight-medium">
              {{ item.title }}
            </h6>
            <p class="text-base text-wrap mb-0">
              {{ item.desc }}
            </p>
            <p class="text-base mb-4">
              Celular : {{ item.subtitle }}
            </p>
          </template>

          <!-- <h6 class="text-h6">
            <a href="#">Cambiar Direccion</a>
          </h6> -->
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
