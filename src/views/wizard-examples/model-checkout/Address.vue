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
  // console.log('valor: ', modelCheckoutAddressDataLocal.value.orderAmount)
})

const selectedAddress = ref({
  firstName: '',
  lastName: '',
  phone: '',
  selectedCountry: '',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  contact: '',
  country: null,
  city: '',
  state: '',
  zipCode: null,
  addressType: 'Casa'
});

const deliveryOptions = [
  {
    icon: { icono: 'tabler-user' },
    title: 'Estándar',
    desc: 'Recibe tu producto en 24h.',
    value: 'free',
  },
  {
    icon: { icono: 'tabler-star' },
    title: 'Expreso',
    desc: 'Recibe tu producto en 12h.',
    value: 'express',
  },
  {
    icon: { icono: 'tabler-crown' },
    title: 'Nocturno',
    desc: 'Recibe tu producto en 1h.',
    value: 'overnight',
  },
];

const resolveAddressBadgeColor: any = {
  home: 'primary',
  office: 'success',
}

const resolveDeliveryBadgeData: any = {
  free: { color: 'success', price: 0, text: 'Gratis' },
  express: { color: 'secondary', price: 200, text: 'RD$200' },
  overnight: { color: 'secondary', price: 300, text: 'RD$300' },
}

const totalPriceWithDeliveryCharges = computed(() => {
  let deliveryCharges = 0
  if (modelCheckoutAddressDataLocal.value.deliverySpeed !== 'free')
    deliveryCharges = resolveDeliveryBadgeData[modelCheckoutAddressDataLocal.value.deliverySpeed].price

  return modelCheckoutAddressDataLocal.value.orderAmount + deliveryCharges
})

const storedData = localStorage.getItem('userData');
const userData = storedData ? JSON.parse(storedData) : null;

const updateAddressData = () => {
  modelCheckoutAddressDataLocal.value.deliveryCharges = resolveDeliveryBadgeData[modelCheckoutAddressDataLocal.value.deliverySpeed].price
  emit('update:checkout-data', modelCheckoutAddressDataLocal.value)
}

const nextStep = () => {
  updateAddressData()
  emit('update:currentStep', props.currentStep ? props.currentStep + 1 : 1)
}

const changeAddress = (item: CustomInputContent) => {
  modelCheckoutAddressDataLocal.value.deliveryAddress = item.value
  const addresses = modelCheckoutAddressDataLocal.value.addresses;

  // Find index of the item to replace
  const index = addresses.findIndex(addr => addr.value === item.value);

  if (index !== -1) {
    // Replace the item at the found index
    modelCheckoutAddressDataLocal.value.addresses[index].desc = item.desc;
    modelCheckoutAddressDataLocal.value.addresses[index].subtitle = item.subtitle;
    modelCheckoutAddressDataLocal.value.addresses[index].title = item.title;
    modelCheckoutAddressDataLocal.value.addresses[index].value = item.value;
  }

  // Emit the updated checkout data
  emit('update:checkout-data', modelCheckoutAddressDataLocal.value);
};


const changeDeliverySpeed = (item: CustomInputContent) => {
  modelCheckoutAddressDataLocal.value.deliverySpeed = item.value
  emit('update:checkout-data', modelCheckoutAddressDataLocal.value)
}

const editAddress = (item: CustomInputContent) => {
  const [firstName, lastName] = item.title.split(' ')
  const [addressLine1, city, state, country] = item.desc?.split(',')

  selectedAddress.value = {
    firstName: firstName,
    lastName: lastName,
    phone: item.subtitle ?? "",
    selectedCountry: country,
    addressLine1: addressLine1,
    addressLine2: null,
    landmark: null,
    contact: item.subtitle ?? "",
    country: country,
    city: city,
    state: state,
    zipCode: null,
    addressType: item.value
  }

  // console.log("selectedAddress: ", selectedAddress.value)

  isEditAddressDialogVisible.value = !isEditAddressDialogVisible.value
}

const deleteAddress = (item: CustomInputContent) => {
  modelCheckoutAddressDataLocal.value.addresses = modelCheckoutAddressDataLocal.value.addresses.filter(a => a.value !== item.value)
  emit('update:checkout-data', modelCheckoutAddressDataLocal.value)
}

const addNewAddress = async (data: ModelCheckoutData) => {
  try {
    const newAddress = data.addresses[0];

    modelCheckoutAddressDataLocal.value.addresses.forEach(address => {
      address.title = address.title.replace(' (Predeterminado)', '');
    });

    const existingAddressIndex = modelCheckoutAddressDataLocal.value.addresses.findIndex(
      (addr) => addr.value === newAddress.value
    );

    if (existingAddressIndex === -1) {
      // Si no existe, agregar la nueva dirección
      modelCheckoutAddressDataLocal.value.addresses.push({ ...newAddress });
    } else {
      // Si ya existe, verifica si ha cambiado
      const existingAddress = modelCheckoutAddressDataLocal.value.addresses[existingAddressIndex];

      if (JSON.stringify(existingAddress) !== JSON.stringify(newAddress)) {
        // Actualiza la dirección si hay cambios
        modelCheckoutAddressDataLocal.value.addresses[existingAddressIndex] = { ...newAddress };

        // const response = axios.post(`${import.meta.env.VITE_API_BASE_URL}/address/updateAddress`, {
        //   userId: id,
        //   name: address.title.split(" ")[0],
        //   lastName: address.title.split(" ")[1],
        //   email: address.email,
        //   phone: address.subtitle,
        //   place: address.value,
        //   street: address.desc.split(", ")[0],
        //   city: address.desc.split(", ")[1],
        //   state: address.desc.split(", ")[2],
        //   country: address.desc.split(", ")[3],
        //   // zipCode: model.uuid,
        //   defaultAddress: address.title.includes('(Predeterminado)'),
        // }, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });

        // if (response.data.address) {
        //   console.log('Direccion guardada con exito!')
        // } else {
        //   console.error("Error al guardar la direccion");
        // }
      } else {
        // console.log('La dirección ya existe y no tiene cambios.');
        return;
      }
    }
    console.log('newAddress:  ', modelCheckoutAddressDataLocal.value)  // Busca la dirección existente

    // Emitir evento de actualización
    emit('update:checkout-data', modelCheckoutAddressDataLocal.value);
  } catch (err) {
    console.error(err)
  }
};

const buttonAddNewAddress = () => {
  selectedAddress.value = {
    firstName: '',
    lastName: '',
    phone: '',
    selectedCountry: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    contact: '',
    country: null,
    city: '',
    state: '',
    zipCode: null,
    addressType: 'Casa'
  }

  isEditAddressDialogVisible.value = !isEditAddressDialogVisible.value
}

// watch(() => props.currentStep, updateAddressData)
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <!-- 👉 Address options -->
      <h6 class="text-h6 mb-4">
        Seleccione su direccion de preferencia
      </h6>

      <!-- 👉 Address custom input -->
      <CustomRadios v-model:selected-radio="modelCheckoutAddressDataLocal.deliveryAddress"
        :radio-content="modelCheckoutAddressDataLocal.addresses" :grid-column="{ cols: '12', sm: '6' }">
        <template #default="{ item }">
          <div class="w-100" @click="changeAddress(item)">
            <div class="d-flex justify-space-between mb-3">
              <h6 class="text-base font-weight-medium">
                {{ item.title }}
              </h6>

              <VChip :color="resolveAddressBadgeColor[item.value]" label size="small" class="text-capitalize">
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
              <a class="me-4" @click="editAddress(item)">Editar</a>
              <a @click="deleteAddress(item)">Eliminar</a>
            </div>
          </div>
        </template>
      </CustomRadios>

      <!-- 👉 Add New Address -->
      <VBtn variant="tonal" class="mt-4 mb-6" @click="buttonAddNewAddress">
        Agregar Nueva Direccion
      </VBtn>

      <!-- 👉 Delivery options -->
      <h6 class="text-h6 mb-4">
        Elige la prioridad del envio
      </h6>

      <!-- 👉 Delivery options custom input -->
      <CustomRadiosWithIcon v-model:selected-radio="modelCheckoutAddressDataLocal.deliverySpeed"
        :radio-content="deliveryOptions" :grid-column="{ cols: '12', sm: '4' }">
        <template #default="{ item }">
          <div class="d-flex flex-column align-center gap-2 w-100" @click="changeDeliverySpeed(item)">
            <div class="d-flex justify-end w-100 mb-n3">
              <VChip :color="resolveDeliveryBadgeData[item.value].color" size="small" label>
                {{ resolveDeliveryBadgeData[item.value].text }}
              </VChip>
            </div>

            <VIcon :icon="item.icon.icono" size="28" />

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

    <VCol cols="12" md="4">
      <VCard flat variant="outlined">
        <!-- 👉 Delivery estimate date -->
        <VCardText>
          <h6 class="text-h6 mb-4">
            Tiempo estimado de Envio
          </h6>

          <VList class="card-list">
            <VListItem v-for="product in modelCheckoutAddressDataLocal.modelItems" :key="product.fileName">
              <template #prepend>
                <img height="70" width="60" :src="product.imageContent" class="me-4">
              </template>

              <div class="text-body-1">
                {{ product.fileName.split('.')[0] }}
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
              <div v-if="modelCheckoutAddressDataLocal.deliverySpeed === 'free'" class="d-flex align-center">
                <div class="text-decoration-line-through text-disabled me-2">
                  RD$200.00
                </div>
                <VChip size="small" color="success">
                  Gratis
                </VChip>
              </div>
              <span v-else>RD${{ resolveDeliveryBadgeData[modelCheckoutAddressDataLocal.deliverySpeed].price
                }}.00</span>
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

      <VBtn block class="mt-4" @click="nextStep">
        Realizar pedido
      </VBtn>
    </VCol>
  </VRow>
  <AddEditAddressDialog :billingAddress="selectedAddress" v-model:is-dialog-visible="isEditAddressDialogVisible"
    :modelCheckoutData="modelCheckoutData" @update:checkout-data="(data) => addNewAddress(data)" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1rem;
}
</style>
