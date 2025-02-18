<script setup lang="ts">
import { CustomInputContent } from '@/@core/types'
import type { ModelCheckoutData } from './types'

interface Props {
  currentStep?: number
  modelCheckoutData: ModelCheckoutData
}
interface Emit {
  (e: 'update:currentStep', value: number): void
  (e: 'update:checkout-data', value: ModelCheckoutData): void
}
const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const modelCheckoutAddressDataLocal = ref<ModelCheckoutData>(JSON.parse(JSON.stringify(props.modelCheckoutData)))
const isEditAddressDialogVisible = ref(false)

watch(() => props.modelCheckoutData, value => {
  modelCheckoutAddressDataLocal.value = JSON.parse(JSON.stringify(value))
})

const deliveryOptions = [
  {
    icon: { icono: 'tabler-user' },
    title: 'Estándar',
    desc: 'Recibe tu producto en 1 días.',
    value: 'free',
  },
  {
    icon: { icono: 'tabler-star' },
    title: 'Expreso',
    desc: 'Recibe tu producto en menos de 24h.',
    value: 'express',
  },
  {
    icon: { icono: 'tabler-crown' },
    title: 'Nocturno',
    desc: 'Recibe tu producto en menos de 1h.',
    value: 'overnight',
  },
];

const resolveAddressBadgeColor: any = {
  home: 'primary',
  office: 'success',
}

const resolveDeliveryBadgeData: any = {
  free: { color: 'success', price: 0, text: 'Gratis' },
  express: { color: 'secondary', price: 10, text: 'RD$10' },
  overnight: { color: 'secondary', price: 15, text: 'RD$15' },
}

const totalPriceWithDeliveryCharges = computed(() => {
  let deliveryCharges = 0
  if (modelCheckoutAddressDataLocal.value.deliverySpeed !== 'free')
    deliveryCharges = resolveDeliveryBadgeData[modelCheckoutAddressDataLocal.value.deliverySpeed].price

  return modelCheckoutAddressDataLocal.value.orderAmount + deliveryCharges
})

const updateAddressData = () => {
  modelCheckoutAddressDataLocal.value.deliveryCharges = resolveDeliveryBadgeData[modelCheckoutAddressDataLocal.value.deliverySpeed].price
  emit('update:checkout-data', modelCheckoutAddressDataLocal.value)
}

const nextStep = () => {
  updateAddressData()
  emit('update:currentStep', props.currentStep ? props.currentStep + 1 : 1)
}

const changeAddress = (value: string) => {
  modelCheckoutAddressDataLocal.value.deliveryAddress = value.toLowerCase()
  emit('update:checkout-data', modelCheckoutAddressDataLocal.value)
}

const deleteAddress = (item: CustomInputContent) => {
  modelCheckoutAddressDataLocal.value.addresses = modelCheckoutAddressDataLocal.value.addresses.filter(a => a.value !== item.value)
  emit('update:checkout-data', modelCheckoutAddressDataLocal.value)
}

watch(() => props.currentStep, updateAddressData)
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="8"
    >
      <!-- 👉 Address options -->
      <h6 class="text-h6 mb-4">
        Seleccione su direccion de preferencia
      </h6>

      <!-- 👉 Address custom input -->
      <CustomRadios
        v-model:selected-radio="modelCheckoutAddressDataLocal.deliveryAddress"
        :radio-content="modelCheckoutAddressDataLocal.addresses"
        :grid-column="{ cols: '12', sm: '6' }"
      >
        <template #default="{ item }">
          <div class="w-100" @click="changeAddress(item.value)">
            <div class="d-flex justify-space-between mb-3">
              <h6 class="text-base font-weight-medium">
                {{ item.title }}
              </h6>

              <VChip
                :color="resolveAddressBadgeColor[item.value]"
                label
                size="small"
                class="text-capitalize"
              >
                {{ item.value }}
              </VChip>
            </div>

            <p class="mb-0 text-sm">
              {{ item.desc }}
            </p>
            <p class="text-sm mb-3">
              Celular: {{ item.subtitle }}
            </p>
            <VDivider />
            <div class="pt-2">
              <a
                class="me-4"
              >Editar</a>
              <a @click="deleteAddress(item)">Eliminar</a>
            </div>
          </div>
        </template>
      </CustomRadios>

      <!-- 👉 Add New Address -->
      <VBtn
        variant="tonal"
        class="mt-4 mb-6"
        @click="isEditAddressDialogVisible = !isEditAddressDialogVisible"
      >
        Agregar Nueva Direccion
      </VBtn>

      <!-- 👉 Delivery options -->
      <h6 class="text-h6 mb-4">
        Elige la prioridad del envio
      </h6>

      <!-- 👉 Delivery options custom input -->
      <CustomRadiosWithIcon
        v-model:selected-radio="modelCheckoutAddressDataLocal.deliverySpeed"
        :radio-content="deliveryOptions"
        :grid-column="{ cols: '12', sm: '4' }"
      >
        <template #default="{ item }">
          <div class="d-flex flex-column align-center gap-2 w-100">
            <div class="d-flex justify-end w-100 mb-n3">
              <VChip
                :color="resolveDeliveryBadgeData[item.value].color"
                size="small"
                label
              >
                {{ resolveDeliveryBadgeData[item.value].text }}
              </VChip>
            </div>

            <VIcon
              
              size="28"
            />

            <h6 class="text-h6">
              {{ item.title }}
            </h6>
            <p class="text-sm text-center mb-0">
              {{ item.desc }}
            </p>
          </div>
        </template>
      </CustomRadiosWithIcon>
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <VCard
        flat
        variant="outlined"
      >
        <!-- 👉 Delivery estimate date -->
        <VCardText>
          <h6 class="text-h6 mb-4">
            Tiempo estimado de Envio
          </h6>

          <VList class="card-list">
            <VListItem
              v-for="product in modelCheckoutAddressDataLocal.modelItems"
              :key="product.fileName"
            >
              <template #prepend>
                <img
                  height="70"
                  width="60"
                  :src="product.imageContent"
                  class="me-4"
                >
              </template>

              <div class="text-body-1">
                {{ product.fileName }}
              </div>
            </VListItem>
          </VList>
        </VCardText>

        <VDivider />

        <!-- 👉 Price details -->
        <VCardText>
          <h6 class="text-h6 mb-4">
            Detalles del Precio
          </h6>

          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-high-emphasis">Total de la Orden</span>
            <span>RD${{ modelCheckoutAddressDataLocal.orderAmount }}</span>
          </div>

          <div class="d-flex align-center justify-space-between">
            <span class="text-high-emphasis">Cargos de Envio</span>
            <div class="text-end">
              <div
                v-if="modelCheckoutAddressDataLocal.deliverySpeed === 'free'"
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
              <span v-else>RD${{ resolveDeliveryBadgeData[modelCheckoutAddressDataLocal.deliverySpeed ].price }}.00</span>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex align-center justify-space-between text-high-emphasis">
          <span class="text-base font-weight-medium">Total</span>
          <span class="text-base font-weight-medium">
            RD${{ totalPriceWithDeliveryCharges }}

          </span>
        </VCardText>
      </VCard>

      <VBtn
        block
        class="mt-4"
        @click="nextStep"
      >
        Realizar pedido
      </VBtn>
    </VCol>
  </VRow>
  <AddEditAddressDialog v-model:is-dialog-visible="isEditAddressDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1rem;
}
</style>
