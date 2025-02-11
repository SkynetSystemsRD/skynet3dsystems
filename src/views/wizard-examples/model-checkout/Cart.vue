<script setup lang="ts">
import type { ModelCheckoutData, ModelItem } from './types'

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

const modelCheckoutCartDataLocal = ref({ ...props.modelCheckoutData });

watch(() => props.modelCheckoutData, (newData) => {
  modelCheckoutCartDataLocal.value = { ...newData };
});

// remove item from cart
const removeItem = (item: ModelItem) => {
  modelCheckoutCartDataLocal.value.modelItems = modelCheckoutCartDataLocal.value.modelItems.filter(i => i.id !== item.id);
  updateCartData(); // Emitir actualización después de eliminar un ítem
};

//  cart total
const totalCost = computed(() => {
  return modelCheckoutCartDataLocal.value.modelItems.reduce((acc, item) => {
    // return acc + item.price * item.quantity
    return 0
  }, 0)
})

const updateCartData = () => {
  modelCheckoutCartDataLocal.value.orderAmount = totalCost.value;
  emit("update:checkout-data", { ...modelCheckoutCartDataLocal.value });
};

const nextStep = () => {
  updateCartData()
  emit('update:currentStep', props.currentStep ? props.currentStep + 1 : 1)
}

function handleFileChange(files: File[]) {
  console.log(files.target.files.length); // Log the file objects to inspect
  let last_id = modelCheckoutCartDataLocal.value.modelItems.length;
  const supportedFormats = ['stl', 'fbx', 'gltf'];

  if (files.target.files.length > 0) {

    for (let count = 0; count < files.target.files.length; count++) {
      // Example to read the file content (if it's a text file)
      
      console.log("fileName:", files.target.files[count].name);
      console.log("size:", files.target.files[count].size < 1024000 ? files.target.files[count].size + ' KB' : (files.target.files[count].size / 1024000).toFixed(2) + ' MB');

      modelCheckoutCartDataLocal.value.modelItems.push({
        id: last_id++,
        fileName: files.target.files[count].name,
        format: files.target.files[count].name.split('.').pop().toUpperCase(),
        isSupported: supportedFormats.includes(files.target.files[count].name.split('.').pop()),
        size: files.target.files[count].size,
        image: "",

      })
      
      // Emitir los cambios al componente padre
      emit('update:checkout-data', { ...modelCheckoutCartDataLocal.value });
    };
  }
}

watch(() => props.currentStep, updateCartData)
</script>

<template>
  <VRow v-if="modelCheckoutCartDataLocal">
    <VCol
      cols="12"
      lg="8"
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

      <h5 class="text-h5 my-4">
        Mi Projecto tiene ({{ modelCheckoutCartDataLocal.modelItems.length }} Modelos 3D)
      </h5>

      <!-- 👉 Cart items -->
      <div
        v-if="modelCheckoutCartDataLocal.modelItems.length"
        class="border rounded"
      >
        <template
          v-for="(item, index) in modelCheckoutCartDataLocal.modelItems"
          :key="item.name"
        >
          <div
            class="d-flex align-center gap-4 pa-6 position-relative flex-column flex-sm-row"
            :class="index ? 'border-t' : ''"
          >
            <IconBtn
              class="checkout-item-remove-btn"
              @click="removeItem(item)"
            >
              <VIcon
                size="18"
                icon="tabler-x"
                class="text-disabled"
              />
            </IconBtn>

            <div>
              <VImg
                width="140"
                :src="item.image"
              />
            </div>

            <div class="d-flex w-100 flex-column flex-md-row">
              <div class="d-flex flex-column gap-y-2">
                <h6 class="text-h6">
                  {{ item.fileName.split('.').slice(0, -1).join('.') }}
                </h6>
                <div class="d-flex align-center text-no-wrap gap-4 text-body-1">
                  <div class="text-disabled">
                    Formato:
                    <span class="d-inline-block text-primary">  {{ item.format }}</span>
                  </div>
                  <VChip
                    :color="item.isSupported ? 'success' : 'error'"
                    label
                    size="small"
                  >
                    {{ item.isSupported ? 'Soportado' : 'No Soportado' }}
                  </VChip>
                </div>

                <!-- <VRating
                  density="compact"
                  :model-value="item.rating"
                  size="24"
                  readonly
                /> -->

                <!-- <AppTextField
                  v-model="item.quantity"
                  type="number"
                  style="inline-size: 9.375rem;"
                  density="compact"
                /> -->
              </div>

              <VSpacer />

              <div
                class="d-flex flex-column mt-5 text-start text-md-end"
                :class="$vuetify.display.mdAndDown ? 'gap-2' : 'gap-4'"
              >
                <div class="d-flex text-base align-self-md-end">
                  <div class="text-primary">
                    Peso: 
                    {{ item.size < 1024 ? item.size + ' KB' : (item.size / 1024).toFixed(2) + ' MB' }} 
                  </div>
                </div>

                <div>
                  <!-- <VBtn
                    variant="tonal"
                    size="small"
                  >
                    move to wishlist
                  </VBtn> -->
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <br>

      <!-- 👉 Empty Cart -->
      <!-- <div v-else>
        <VImg :src="emptyCartImg" />
      </div> -->

      <!-- 👉 Add more from wishlist -->
      <VFileInput
        multiple
        prepend-icon="tabler-upload"
        label="Sube más modelos 3D 🚀"
        @change="handleFileChange"
      />
      <!-- <VIcon
        icon="tabler-upload"
        size="16"
        class="flip-in-rtl text-primary"
      /> -->
    </VCol>

    <VCol
      cols="12"
      lg="4"
    >
      <VCard
        flat
        variant="outlined"
      >
        <!-- 👉 payment offer -->
        <VCardText>
          <h6 class="text-h6 mb-4">
            Oferta
          </h6>

          <div class="d-flex align-center gap-4 flex-wrap">
            <AppTextField
              v-model="modelCheckoutCartDataLocal.promoCode"
              placeholder="Codigo Promo"
              style="min-inline-size: 200px;"
            />

            <VBtn
              variant="tonal"
              @click="updateCartData"
            >
              Aplicar
            </VBtn>
          </div>

          <!-- 👉 Gift wrap banner -->
          <div class="bg-var-theme-background rounded pa-6 mt-4">
            <h6 class="text-h6 mb-2">
              ¿Personaliza tu pedido?
            </h6>
            <p class="mb-2">
              Agrega un acabado especial o una nota personalizada por solo $2.
            </p>

            <h6 class="text-h6">
              <a href="#">Añadir personalización</a>
            </h6>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Price details -->
        <!-- <VCardText>
        <h6 class="text-h6 mb-4">
            Detalles del Precio
          </h6>

          <div class="text-high-emphasis">
            <div class="d-flex justify-space-between mb-2">
              <span>Bolsa Total</span>
              <span class="text-medium-emphasis">${{ totalCost }}.00</span>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Cupón de Descuento</span>
              <a href="#">Aplicar Cupón</a>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>Orden Total</span>
              <span class="text-medium-emphasis">${{ totalCost }}.00</span>
            </div>

            <div class="d-flex justify-space-between">
              <span>Costo de Envio</span>

              <div class="d-flex align-center">
                <div class="text-decoration-line-through text-disabled me-2">
                  $5.00
                </div>
                <VChip
                  size="small"
                  color="success"
                >
                  Gratis  
                </VChip>
              </div>
            </div>
          </div>
        </VCardText> -->

        <!-- <VDivider />

        <VCardText class="d-flex justify-space-between pa-6">
          <h6 class="text-h6">
            Total
          </h6>
          <h6 class="text-h6">
            ${{ totalCost }}.00
          </h6>
        </VCardText> -->
      </VCard>

      <!-- <div>
        <br v-for="n in 14" :key="n" />
      </div> -->

      <br>

      <VBtn
        block
        class="mt-auto"
        @click="nextStep"
      >
        Continuar Pedido
      </VBtn>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.checkout-item-remove-btn {
  position: absolute;
  inset-block-start: 14px;
  inset-inline-end: 14px;
}
</style>
