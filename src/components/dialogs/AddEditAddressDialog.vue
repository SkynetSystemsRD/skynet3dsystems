<script setup lang="ts">
import { ModelCheckoutData } from '@/@core/types'
import gym from '@images/svg/gym.svg'
import home from '@images/svg/home.svg'
import hotel from '@images/svg/hotel.svg'
import mall from '@images/svg/mall.svg'
import office from '@images/svg/office.svg'
import axios from 'axios'

interface BillingAddress {
  id: string | undefined
  firstName: string | undefined
  lastName: string | undefined
  email: string | undefined
  phone: string
  selectedCountry: string | null
  addressLine1: string
  addressLine2: string
  landmark: string
  contact: string
  country: string | null
  city: string
  state: string
  zipCode: number | null
  addressType: string
}
interface Props {
  billingAddress?: BillingAddress
  isDialogVisible: boolean
  modelCheckoutData: ModelCheckoutData
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submit', value: BillingAddress): void
  (e: 'update:checkout-data', value: ModelCheckoutData): void  // Añadido para permitir este evento
}

const AddOrEdit = ref(true)

const countries = [
  'Afganistán',
  'Albania',
  'Alemania',
  'Andorra',
  'Angola',
  'Antigua y Barbuda',
  'Arabia Saudita',
  'Arcos',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaiyán',
  'Bahamas',
  'Bangladés',
  'Barbados',
  'Baréin',
  'Bélgica',
  'Belice',
  'Benín',
  'Bielorrusia',
  'Birmania',
  'Bolivia',
  'Bosnia y Herzegovina',
  'Botsuana',
  'Brasil',
  'Brunéi',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Bután',
  'Cabo Verde',
  'Camboya',
  'Camerún',
  'Canadá',
  'Catar',
  'Chile',
  'China',
  'Chipre',
  'Colombia',
  'Comoras',
  'Congo (República del)',
  'Congo (República Democrática del)',
  'Corea del Norte',
  'Corea del Sur',
  'Costa Rica',
  'Croacia',
  'Cuba',
  'Curazao',
  'Chipre',
  'Chequia',
  'Dinamarca',
  'Dominica',
  'Ecuador',
  'Egipto',
  'El Salvador',
  'Emiratos Árabes Unidos',
  'Ecuador',
  'Eritrea',
  'Eslovaquia',
  'Eslovenia',
  'España',
  'Estados Unidos',
  'Estonia',
  'Eswatini',
  'Etiopía',
  'Fiyi',
  'Filipinas',
  'Finlandia',
  'Francia',
  'Gabón',
  'Gambia',
  'Gana',
  'Granada',
  'Grecia',
  'Guatemala',
  'Guinea',
  'Guinea Ecuatorial',
  'Guinea-Bisáu',
  'Guyana',
  'Haití',
  'Honduras',
  'Hungría',
  'India',
  'Indonesia',
  'Irak',
  'Irán',
  'Irlanda',
  'Islandia',
  'Islas Cook',
  'Islas Feroe',
  'Islas Marshall',
  'Islas Salomón',
  'Israel',
  'Italia',
  'Jamaica',
  'Japón',
  'Jordania',
  'Kazajistán',
  'Kenia',
  'Kirguistán',
  'Kiribati',
  'Kuwait',
  'Laos',
  'Lesoto',
  'Letonia',
  'Líbano',
  'Liberia',
  'Libia',
  'Liechtenstein',
  'Lituania',
  'Luxemburgo',
  'Madagascar',
  'Malasia',
  'Malaui',
  'Maldivas',
  'Malí',
  'Malta',
  'Marruecos',
  'Mauricio',
  'Mauritania',
  'México',
  'Micronesia',
  'Mónaco',
  'Mongolia',
  'Montenegro',
  'Mozambique',
  'Namibia',
  'Naurú',
  'Nepal',
  'Nicaragua',
  'Níger',
  'Nigeria',
  'Noruega',
  'Nueva Zelanda',
  'Omán',
  'Países Bajos',
  'Pakistán',
  'Palaos',
  'Panamá',
  'Papúa Nueva Guinea',
  'Paraguay',
  'Perú',
  'Polonia',
  'Portugal',
  'Reino Unido',
  'República Checa',
  'República Dominicana',
  'Rumanía',
  'Rusia',
  'Ruanda',
  'Samoa',
  'San Cristóbal y Nieves',
  'San Marino',
  'San Vicente y las Granadinas',
  'Santa Lucía',
  'Santo Tomé y Príncipe',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leona',
  'Singapur',
  'Siria',
  'Somalia',
  'Sri Lanka',
  'Suazilandia',
  'Sudáfrica',
  'Sudán',
  'Suecia',
  'Suiza',
  'Surinam',
  'Tailandia',
  'Tanzania',
  'Tayikistán',
  'Timor Oriental',
  'Togo',
  'Tonga',
  'Trinidad y Tobago',
  'Túnez',
  'Turkmenistán',
  'Turquía',
  'Tuvalu',
  'Uganda',
  'Ucrania',
  'Uruguay',
  'Vanuatu',
  'Vaticano',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Yibuti',
  'Zambia',
  'Zimbabue'
]

const storedData = localStorage.getItem('userData');
const userData = storedData ? JSON.parse(storedData) : null;

const props = withDefaults(defineProps<Props>(), {
  billingAddress: () => ({
    id: '',
    firstName: 'Jose',
    lastName: 'Lopez',
    phone: '849 000 1111',
    email: 'juanperez@gmail.com',
    selectedCountry: 'República Dominicana',
    addressLine1: 'Av. 27 de Febrero',
    addressLine2: '',
    landmark: 'Hard Rock Cafe',
    contact: '',
    country: 'República Dominicana',
    city: 'Santo Domingo',
    state: 'Distrito Nacional',
    zipCode: 10305,
    addressType: 'Casa'
  })
})

const toggleSwitch = ref(false)
const form = ref(null);

const emit = defineEmits<Emit>()

// Reglas de validación
const requiredRule = value => !!value || 'Este campo es obligatorio';
const phoneRule = value => /^\d{10,11}$/.test(value) || 'Número no válido';
const emailRule = value => /^(?=[a-zA-Z0-9._%+-]{1,256})([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$/.test(value) || 'Formato de correo inválido'

// Referencia local para el checkout data
const modelCheckoutCartDataLocal = ref<ModelCheckoutData>({
  ...props.modelCheckoutData, // Asegúrate de que el objeto contiene los datos correctos
  addresses: [] // Inicializa 'addresses' como un arreglo vacío
})

const billingAddress = ref<BillingAddress>(structuredClone(toRaw(props.billingAddress)))

const resetForm = () => {
  emit('update:isDialogVisible', false)
  billingAddress.value = structuredClone(toRaw(props.billingAddress))
}

const onFormSubmit = async () => {
  if ((props.billingAddress.addressLine1 || props.billingAddress.addressLine2)) {
    const { valid } = await form.value.validate();
    if (valid) {
      if (modelCheckoutCartDataLocal.value && Array.isArray(modelCheckoutCartDataLocal.value.addresses)) {
        await updateAddress({
          id: billingAddress.value.id,
          name: billingAddress.value.firstName,
          lastName: billingAddress.value.lastName,
          email: billingAddress.value.email,
          phone: billingAddress.value.phone,
          place: selectedAddress.value,
          street: billingAddress.value.addressLine1,
          city: billingAddress.value.city,
          state: billingAddress.value.state,
          country: billingAddress.value.selectedCountry,
          // zipCode: model.uuid,
          defaultAddress: toggleSwitch.value,
        })

        modelCheckoutCartDataLocal.value.addresses.push({
          id: billingAddress.value.id,
          title: toggleSwitch.value ? `${billingAddress.value.firstName} ${billingAddress.value.lastName} (Predeterminado)` : `${billingAddress.value.firstName} ${billingAddress.value.lastName}`,
          email: billingAddress.value.email,
          desc: `${billingAddress.value.addressLine1}, ${billingAddress.value.city}, ${billingAddress.value.state}, ${billingAddress.value.selectedCountry}`,
          subtitle: billingAddress.value.phone,
          value: selectedAddress.value
        });

        // Eliminar el primer elemento después de agregar el nuevo
        if (modelCheckoutCartDataLocal.value.addresses.length > 1) {
          modelCheckoutCartDataLocal.value.addresses.shift();
        }

        emit('update:checkout-data', modelCheckoutCartDataLocal.value);
        emit('update:isDialogVisible', false);
      } else {
        console.error("modelCheckoutCartDataLocal or addresses is not defined correctly");
      }
    }
  }
  else {
    const { valid } = await form.value.validate();
    if (valid) {
      if (modelCheckoutCartDataLocal.value && Array.isArray(modelCheckoutCartDataLocal.value.addresses)) {
        const id = await saveAddress({
          name: billingAddress.value.firstName,
          lastName: billingAddress.value.lastName,
          email: billingAddress.value.email,
          phone: billingAddress.value.phone,
          place: selectedAddress.value,
          street: billingAddress.value.addressLine1,
          city: billingAddress.value.city,
          state: billingAddress.value.state,
          country: billingAddress.value.selectedCountry,
          // zipCode: model.uuid,
          defaultAddress: toggleSwitch.value,
        })

        modelCheckoutCartDataLocal.value.addresses.push({
          id: id,
          title: toggleSwitch.value ? `${billingAddress.value.firstName} ${billingAddress.value.lastName} (Predeterminado)` : `${billingAddress.value.firstName} ${billingAddress.value.lastName}`,
          email: billingAddress.value.email,
          desc: `${billingAddress.value.addressLine1}, ${billingAddress.value.city}, ${billingAddress.value.state}, ${billingAddress.value.selectedCountry}`,
          subtitle: billingAddress.value.phone,
          value: selectedAddress.value
        });

        // Eliminar el primer elemento después de agregar el nuevo
        if (modelCheckoutCartDataLocal.value.addresses.length > 1) {
          modelCheckoutCartDataLocal.value.addresses.shift();
        }

        emit('update:checkout-data', modelCheckoutCartDataLocal.value);
        emit('update:isDialogVisible', false);
      } else {
        console.error("modelCheckoutCartDataLocal or addresses is not defined correctly");
      }
    }
  }
};

const selectedAddress = ref('Casa')

const addressTypes = [
  {
    icon: { icon: home, size: '28' },
    title: 'Casa',
    desc: 'Hora de Envio (7am - 10pm)',
    value: 'Casa',
  },
  {
    icon: { icon: office, size: '28' },
    title: 'Trabajo',
    desc: 'Hora de Envio (7am - 10pm)',
    value: 'Trabajo',
  },
  {
    icon: { icon: mall, size: '28' },
    title: 'Centro comercial',
    desc: 'Hora de Envio (7am - 10pm)',
    value: 'Centro comercial',
  },
  {
    icon: { icon: hotel, size: '28' },
    title: 'Hotel',
    desc: 'Hora de Envio (7am - 10pm)',
    value: 'Hotel',
  },
  {
    icon: { icon: gym, size: '28' },
    title: 'Gimnasio',
    desc: 'Hora de Envio (7am - 10pm)',
    value: 'Gimnasio',
  },
]

interface Address {
  id: string,
  userId: string,
  name: string,
  lastName: string,
  email: string,
  phone: string,
  place: string
  street: string,
  city: string,
  state: string,
  country: string,
  // zipCode: model.uuid,
  defaultAddress: boolean,
}

const saveAddress = async (newAddress: Address) => {
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/addresses/saveAddress`, {
    userId: userData.id,
    name: newAddress.name,
    lastName: newAddress.lastName,
    email: newAddress.email,
    phone: newAddress.phone,
    place: newAddress.place,
    street: newAddress.street,
    city: newAddress.city,
    state: newAddress.state,
    country: newAddress.country,
    // zipCode: model.uuid,
    defaultAddress: newAddress.defaultAddress,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.data.address) {
    console.log('Direccion guardada con exito!')
    return response.data.id
  } else {
    console.error("Error al guardar la direccion");
    return null
  }
}

const updateAddress = async (newAddress: Address) => {
  const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/addresses/updateAddress`, {
    id: newAddress.id,
    name: newAddress.name,
    lastName: newAddress.lastName,
    email: newAddress.email,
    phone: newAddress.phone,
    place: newAddress.place,
    street: newAddress.street,
    city: newAddress.city,
    state: newAddress.state,
    country: newAddress.country,
    // zipCode: model.uuid,
    defaultAddress: newAddress.defaultAddress,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.data.address) {
    console.log('Direccion guardada con exito!')
  } else {
    console.error("Error al guardar la direccion");
    return null
  }
}

watch(() => props.modelCheckoutData, value => {
  modelCheckoutCartDataLocal.value = JSON.parse(JSON.stringify(value))
})

watch(() => props.billingAddress, (newbillingAddress) => {
  console.log("billingAddress ha cambiado:", newbillingAddress);
  billingAddress.value = { ...newbillingAddress };
  selectedAddress.value = billingAddress.value.addressType
}, { deep: true });
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)">
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <VCard v-if="props.billingAddress" class="pa-sm-10 pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          {{ (props.billingAddress.addressLine1 || props.billingAddress.addressLine2) ? 'Editar' : 'Agregar Nueva' }}
          Dirección
        </h4>
        <p class="text-body-1 text-center mb-6">
          Agrega Una Nueva Dirección
        </p>

        <div class="d-flex mb-6">
          <CustomRadiosWithIcon v-model:selected-radio="selectedAddress" :radio-content="addressTypes"
            :grid-column="{ sm: '6', cols: '12' }" />
        </div>

        <!-- 👉 Form -->
        <VForm ref="form" @submit.prevent="onFormSubmit">
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12" md="6">
              <AppTextField v-model="billingAddress.firstName" label="Primer Nombre" placeholder="Juan"
                :rules="[requiredRule]" />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol cols="12" md="6">
              <AppTextField v-model="billingAddress.lastName" label="Apellido" placeholder="Pérez"
                :rules="[requiredRule]" />
            </VCol>

            <!-- 👉 Phone Number -->
            <VCol cols="12">
              <AppTextField v-model="billingAddress.email" label="Correo Electronico" placeholder="juanperez@gmail.com"
                :rules="[requiredRule, emailRule]" />
            </VCol>

            <!-- 👉 Phone Number -->
            <VCol cols="12">
              <AppTextField v-model="billingAddress.phone" label="Número Celular" placeholder="849 000 1111"
                :rules="[requiredRule, phoneRule]" />
            </VCol>

            <!-- 👉 Select Country -->
            <VCol cols="12">
              <AppSelect v-model="billingAddress.selectedCountry" label="Seleccione su País"
                placeholder="Seleccione su País" :items="countries" :rules="[requiredRule]" />
            </VCol>

            <!-- 👉 Address Line 1 -->
            <VCol cols="12">
              <AppTextField v-model="billingAddress.addressLine1" label="Dirección #1" placeholder="Av. 27 de Febrero"
                :rules="[requiredRule]" />
            </VCol>

            <!-- 👉 Address Line 2 -->
            <VCol cols="12">
              <AppTextField v-model="billingAddress.addressLine2" label="Dirección #2"
                placeholder="Winston Churchill" />
            </VCol>

            <!-- 👉 Landmark -->
            <VCol cols="12" md="6">
              <AppTextField v-model="billingAddress.landmark" label="Referencia" placeholder="Hard Rock Cafe" />
            </VCol>

            <!-- 👉 City -->
            <VCol cols="12" md="6">
              <AppTextField v-model="billingAddress.city" label="Ciudad" placeholder="Santo Domingo"
                :rules="[requiredRule]" />
            </VCol>

            <!-- 👉 State -->
            <VCol cols="12" md="6">
              <AppTextField v-model="billingAddress.state" label="Provincia" placeholder="Distrito Nacional"
                :rules="[requiredRule]" />
            </VCol>

            <!-- 👉 Zip Code -->
            <VCol cols="12" md="6">
              <AppTextField v-model="billingAddress.zipCode" label="Código Postal" placeholder="10305" type="number"
                :rules="[requiredRule]" />
            </VCol>

            <VCol cols="12">
              <VSwitch v-model="toggleSwitch" label="¿Utilizar como dirección de facturación?" />
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol cols="12" class="text-center">
              <VBtn type="submit" class="me-3">
                Guardar
              </VBtn>

              <VBtn variant="tonal" color="secondary" @click="resetForm">
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
