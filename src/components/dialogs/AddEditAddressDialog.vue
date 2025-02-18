<script setup lang="ts">
import { ModelCheckoutData } from '@/@core/types'
import home from '@images/svg/home.svg'
import office from '@images/svg/office.svg'

interface BillingAddress {
  firstName: string | undefined
  lastName: string | undefined
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

const props = withDefaults(defineProps<Props>(), {
  billingAddress: () => ({
    firstName: '',
    lastName: '',
    phone: '',
    selectedCountry: 'República Dominicana',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    contact: '',
    country: null,
    city: '',
    state: '',
    zipCode: null,
  })
})

const emit = defineEmits<Emit>()

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

const onFormSubmit = () => {
  if (modelCheckoutCartDataLocal.value && Array.isArray(modelCheckoutCartDataLocal.value.addresses)) {
    modelCheckoutCartDataLocal.value.addresses.push({
      title: `${billingAddress.value.firstName} ${billingAddress.value.lastName}`,
      desc: `${billingAddress.value.addressLine1}, ${billingAddress.value.city}, ${billingAddress.value.state}, ${billingAddress.value.country}`,
      subtitle: billingAddress.value.phone,
      value: selectedAddress.value
    })
    emit('update:checkout-data', modelCheckoutCartDataLocal.value)
    emit('update:isDialogVisible', false)
  } else {
    console.error("modelCheckoutCartDataLocal or addresses is not defined correctly");
  }
}


// const onFormSubmit = () => {
//   emit('update:isDialogVisible', false)
//   console.log(billingAddress.value)
//   // modelCheckoutAddressDataLocal.value.addresses.push({
//   //   title: `${billingAddress.value.firstName} ${billingAddress.value.lastName}`,
//   //   desc: `${billingAddress.value.addressLine1}, ${billingAddress.value.city}, ${billingAddress.value.state}, ${billingAddress.value.country}`,
//   //   subtitle: 
//   // })
//   // emit('update:checkout-data', modelCheckoutAddressDataLocal.value)
//   emit('submit', billingAddress.value)
// }

const selectedAddress = ref('Casa')

const addressTypes = [
  {
    icon: { icon: home, size: '28' },
    title: 'Casa',
    desc: 'Delivery Time (9am - 9pm)',
    value: 'Casa',
  },
  {
    icon: { icon: office, size: '28' },
    title: 'Trabajo',
    desc: 'Delivery Time (9am - 5pm)',
    value: 'Trabajo',
  },
]

watch(() => props.modelCheckoutData, value => {
  modelCheckoutCartDataLocal.value = JSON.parse(JSON.stringify(value))
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900 "
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <VCard
      v-if="props.billingAddress"
      class="pa-sm-10 pa-2"
    >
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          {{ (props.billingAddress.addressLine1 || props.billingAddress.addressLine2) ? 'Editar' : 'Agregar Nueva' }} Direccion
        </h4>
        <p class="text-body-1 text-center mb-6">
          Agrega Una Nueva Direccion
        </p>

        <div class="d-flex mb-6">
          <CustomRadiosWithIcon
            v-model:selected-radio="selectedAddress"
            :radio-content="addressTypes"
            :grid-column="{ sm: '6', cols: '12' }"
          />
        </div>

        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
            <!-- 👉 First Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.firstName"
                label="Primer Nombre"
                placeholder="Juan"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.lastName"
                label="Apellido"
                placeholder="Perez"
              />
            </VCol>

            <!-- 👉 Select Number -->
            <VCol cols="12">
              <AppTextField
                v-model="billingAddress.phone"
                label="Numero Celular"
                placeholder="849 000 1111"
              />
            </VCol>

            <!-- 👉 Select Country -->
            <VCol cols="12">
              <AppSelect
                v-model="billingAddress.selectedCountry"
                label="Seleccione su Pais"
                placeholder="Seleccione su Pais"
                :items="countries"
              />
            </VCol>

            <!-- 👉 Address Line 1 -->
            <VCol cols="12">
              <AppTextField
                v-model="billingAddress.addressLine1"
                label="Direccion #1"
                placeholder="Av. 27 de Febrero"
              />
            </VCol>

            <!-- 👉 Address Line 2 -->
            <VCol cols="12">
              <AppTextField
                v-model="billingAddress.addressLine2"
                label="Direccion #2"
                placeholder="Winston Churchill"
              />
            </VCol>

            <!-- 👉 Landmark -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.landmark"
                label="Landmark"
                placeholder="Hard Rock Cafe"
              />
            </VCol>

            <!-- 👉 City -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.city"
                label="Cuidad"
                placeholder="Santo Domingo"
              />
            </VCol>

            <!-- 👉 State -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.state"
                label="Provincia"
                placeholder="Distrito Nacional"
              />
            </VCol>

            <!-- 👉 Zip Code -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.zipCode"
                label="Codigo Postal"
                placeholder="10305"
                type="number"
              />
            </VCol>

            <VCol cols="12">
              <VSwitch label="Utilizar como dirección de facturación?" />
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                type="submit"
                class="me-3"
              >
                Guardar
              </VBtn>

              <VBtn
                variant="tonal"
                color="secondary"
                @click="resetForm"
              >
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
