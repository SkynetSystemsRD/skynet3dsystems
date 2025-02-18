<script setup lang="ts">
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

const selectedPaymentMethod = ref('card')

const currentTab = ref('banreservas');
const accounts = {
  banreservas: {
    bank: 'Banreservas',
    accountNumber: '123456789',
    accountType: 'Cuenta de Ahorro',
    holder: 'Nombre Completo'
  },
  popular: {
    bank: 'Banco Popular',
    accountNumber: '987654321',
    accountType: 'Cuenta de Ahorro',
    holder: 'Nombre Completo'
  },
  bhd: {
    bank: 'Banco BHD',
    accountNumber: '112233445',
    accountType: 'Cuenta de Ahorro',
    holder: 'Nombre Completo'
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

const updateCartData = () => {
  emit('update:checkout-data', modelCheckoutPaymentDataLocal.value)
}

const nextStep = () => {
  updateCartData()
  emit('update:currentStep', prop.currentStep ? prop.currentStep + 1 : 1)
}

watch(
  () => [prop.currentStep, prop.modelCheckoutData.deliveryAddress],
  ([newStep, newAddress]) => {
    // updateCartData();
    modelCheckoutPaymentDataLocal.value.deliveryAddress = newAddress;
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
        <VTab value="cash-on-delivery">
          En Efectivo
        </VTab>
        <VTab value="gift-card">
          Transferencia Bancaria
        </VTab>
        <VTab value="card">
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
          <VForm class="mt-3">
            <VRow class="ma-0 pa-n2">
              <VCol cols="12">
                <AppTextField
                  v-model="cardFormData.cardNumber"
                  type="number"
                  label="Numero de Tarjeta"
                  placeholder="1356 3215 6548 7898"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="cardFormData.cardName"
                  label="Nombre"
                  placeholder="Juan Perez"
                />
              </VCol>

              <VCol
                cols="6"
                md="4"
              >
                <AppTextField
                  v-model="cardFormData.cardExpiry"
                  label="Expiracion"
                  placeholder="MM/YY"
                />
              </VCol>

              <VCol
                cols="6"
                md="4"
              >
                <AppTextField
                  v-model="cardFormData.cardCvv"
                  label="CVV"
                  placeholder="123"
                  type="number"
                >
                  <template #append-inner>
                    <VTooltip
                      text="Valor de Verificacion de la Tarjeta"
                      location="bottom"
                    >
                      <template #activator="{ props: tooltipProps }">
                        <VIcon
                          v-bind="tooltipProps"
                          size="20"
                          icon="tabler-help"
                        />
                      </template>
                    </VTooltip>
                  </template>
                </AppTextField>
              </VCol>

              <VCol
                cols="12"
                class="pt-1"
              >
                <VSwitch
                  v-model="cardFormData.isCardSave"
                  label="¿Guardar tarjeta para facturación futura?"
                />

                <div class="mt-4">
                  <VBtn
                    class="me-4"
                    @click="nextStep"
                  >
                    Guardar Cambios
                  </VBtn>
                  <VBtn
                    variant="tonal"
                    color="secondary"
                  >
                    Borrar Todo
                  </VBtn>
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

        <VWindowItem value="gift-card">
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
                  <VWindow v-model="currentTab">
                    <VWindowItem
                      v-for="(data, key) in accounts"
                      :key="key"
                      :value="key"
                    >
                      <h3>{{ data.bank }}</h3>
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
          <div class="d-flex justify-space-between text-base mb-2">
            <span class="text-high-emphasis font-weight-medium">Total</span>
            <span class="font-weight-medium">RD${{ modelCheckoutPaymentDataLocal.orderAmount + modelCheckoutPaymentDataLocal.deliveryCharges }}.00</span>
          </div>

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

          <h6 class="text-h6">
            <a href="#">Cambiar Direccion</a>
          </h6>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
