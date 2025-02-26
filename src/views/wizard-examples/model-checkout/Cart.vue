<script setup lang="ts">
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { onBeforeUnmount, onMounted } from 'vue';
import type { ModelCheckoutData, ModelItem } from './types';

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

const models_counts = ref(0);

const loading = ref(false)

const showNote = ref(false)

const noteMessage = ref('Añadir una nota')

const modelCheckoutCartDataLocal = ref({ ...props.modelCheckoutData });

watch(() => props.modelCheckoutData, (newData) => {
  modelCheckoutCartDataLocal.value = { ...newData };

  // if (models_counts.value !== modelCheckoutCartDataLocal.value.modelItems.length){
  //   console.log('modelos actuales: ', modelCheckoutCartDataLocal.value.modelItems.length) 
  //   console.log('modelo anteriores: ', models_counts.value)
  // }
  // else console.log('modelos actuales: ', models_counts.value)

  models_counts.value = modelCheckoutCartDataLocal.value.modelItems.length
});

// remove item from cart
const removeItem = (item: ModelItem) => {
  modelCheckoutCartDataLocal.value.modelItems = modelCheckoutCartDataLocal.value.modelItems.filter(i => i.id !== item.id);
  // console.log('REMOVED ITEM: ', modelCheckoutCartDataLocal.value.modelItems)
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

  // if (modelCheckoutCartDataLocal.value.modelItems.length > 0)
  //   emit('update:currentStep', 1)
  // else emit('update:currentStep', 0)
};

const nextStep = () => {
  updateCartData()
  emit('update:currentStep', props.currentStep ? props.currentStep + 1 : 1)
}

function handleFileChange(files: File[]) {
  loading.value = true
  // console.log(files.target.files.length); // Log the file objects to inspect
  let last_id = modelCheckoutCartDataLocal.value.modelItems.length + 1;
  const supportedFormats = ['stl', 'fbx', 'gltf', 'obj'];

  if (files.target.files.length > 0) {
    for (let count = 0; count < files.target.files.length; count++) {
      // Crear un FileReader para leer el archivo
      const reader = new FileReader();
      const file = files.target.files[count];
      
      // Create a Promise to handle the file reading asynchronously
      const fileContent = new Promise<string | ArrayBuffer | null>((resolve) => {
        reader.onload = (object) => {
          // `reader.result` contains the content of the loaded file
          resolve(reader.result);  // Resolve the promise with the content
        };
        reader.readAsDataURL(file);  // Read the file as a Data URL (for images, for example)
      });

      // Push the new item to the modelCheckoutCartDataLocal
      fileContent.then(content => {
        let imageData = ''
        let loader;

        const scene = new THREE.Scene();

        // Luz ambiental para iluminación general suave
        const hlight = new THREE.AmbientLight(0x404040, 1);  // Luz más suave
        scene.add(hlight);

        // Luz direccional ejes positivos
        const directionalLight_z_up = new THREE.DirectionalLight(0xFFFFFF, 4);  // Luz más intensa desde arriba
        directionalLight_z_up.position.set(5, 5, 5);  // Aseguramos que la luz venga de arriba
        directionalLight_z_up.castShadow = true;
        scene.add(directionalLight_z_up);

        // Luz direccional ejes negativos
        const directionalLight_z_down = new THREE.DirectionalLight(0xFFFFFF, 3);  // Luz más intensa desde arriba
        directionalLight_z_down.position.set(-5, -5, -5);  // Aseguramos que la luz venga de arriba
        directionalLight_z_down.castShadow = true;
        scene.add(directionalLight_z_down);

        scene.background = new THREE.Color(0xFFFFFF);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(300, 200); // Set canvas size
        const camera = new THREE.PerspectiveCamera(
          90, 440 / 250, 0.1, 1000
        );
        camera.rotation.y = 45 / 180 * Math.PI;
        camera.position.set(50, 50, 50); // Alejar más la cámara
        camera.fov = 90; // Reducir el FOV para un efecto de zoom alejado
        camera.updateProjectionMatrix(); // Aplicar los cambios en el FOV

        switch (file.name.split('.').pop().toLowerCase()) {
          case 'glb':
          case 'gltf':
            loader = new GLTFLoader();
            loader.load(content, (gltf) => {
              const model = gltf.scene.children[0];
              model.scale.set(1.2, 1.2, 1.2);  // Ajusta la escala del modelo
              model.position.set(0, 0, 0);  // Centra el modelo
              scene.add(gltf.scene);

              renderer.render(scene, camera);
              imageData = renderer.domElement.toDataURL("image/png");
        
              // Download or display the image
              // console.log('file format: gltf')
              modelCheckoutCartDataLocal.value.modelItems.push({
                id: last_id++,
                fileName: file.name,
                filePath: '/' + file.name,
                format: file.name.split('.').pop().toUpperCase(),
                isSupported: supportedFormats.includes(file.name.split('.').pop() || ''),
                size: file.size,
                imageContent: imageData,
                octetStreamContent: content,
                price: 0
              });
              
            });
            break;
          case 'obj':
            loader = new OBJLoader();
            loader.load(content, (obj) => {
              obj.scale.set(1.2, 1.2, 1.2);   // Ajusta la escala del modelo
              obj.position.set(0, 0, 0);  // Centra el modelo.
              scene.add(obj);
              renderer.render(scene, camera);
              imageData = renderer.domElement.toDataURL("image/png");
        
              // Download or display the image
              // console.log('file format: obj')
              modelCheckoutCartDataLocal.value.modelItems.push({
                id: last_id++,
                fileName: file.name,
                filePath: '/' + file.name,
                format: file.name.split('.').pop().toUpperCase(),
                isSupported: supportedFormats.includes(file.name.split('.').pop() || ''),
                size: file.size,
                imageContent: imageData,
                octetStreamContent: content,
                price: 0
              });
            });
            break;
          case 'fbx':
            loader = new FBXLoader();
            loader.load(content, (fbx) => {
              fbx.scale.set(1.2, 1.2, 1.2);   // Ajusta la escala del modelo
              fbx.position.set(0, 0, 0);  // Centra el modelo
              scene.add(fbx); 
              
              renderer.render(scene, camera);
              imageData = renderer.domElement.toDataURL("image/png");
        
              // Download or display the image
              // console.log('file format: fbx')
              modelCheckoutCartDataLocal.value.modelItems.push({
                id: last_id++,
                fileName: file.name,
                filePath: '/' + file.name,
                format: file.name.split('.').pop().toUpperCase(),
                isSupported: supportedFormats.includes(file.name.split('.').pop() || ''),
                size: file.size,
                imageContent: imageData,
                octetStreamContent: content,
                price: 0
              });
            });
            break;
          case 'stl':
            loader = new STLLoader();
            loader.load(content, (geometry) => {
              const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.scale.set(1.2, 1.2, 1.2);   // Ajusta la escala del modelo
              mesh.position.set(0, 0, 0);  // Centra el modelo
              scene.add(mesh); 
              renderer.render(scene, camera);
              imageData = renderer.domElement.toDataURL("image/png");
        
              // Download or display the image
              // console.log('file format: stl')
              modelCheckoutCartDataLocal.value.modelItems.push({
                id: last_id++,
                fileName: file.name,
                filePath: '/' + file.name,
                format: file.name.split('.').pop().toUpperCase(),
                isSupported: supportedFormats.includes(file.name.split('.').pop() || ''),
                size: file.size,
                imageContent: imageData,
                octetStreamContent: content,
                price: 0
              });
            });
            break;

          default:
            console.error('Unsupported model format');
        }
        
        emit('update:checkout-data', { ...modelCheckoutCartDataLocal.value });
      });
    }
  }
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const shouldWarnBeforeUnload = computed(() => 
  modelCheckoutCartDataLocal.value.modelItems.length > 0
);

const handleBeforeUnload = (event) => {
  if (shouldWarnBeforeUnload.value) {
    event.preventDefault();
    event.returnValue = '¿Está seguro de que desea salir? Es posible que sus cambios no se guarden?';
  }
};

// Handle the update event
const handleNoteUpdate = (newValue) => {
  modelCheckoutCartDataLocal.value.note = newValue
  emit("update:checkout-data", { ...modelCheckoutCartDataLocal.value });
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
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
        Mi Proyecto tiene ({{ modelCheckoutCartDataLocal.modelItems.length }} 
        {{ modelCheckoutCartDataLocal.modelItems.length === 1 ? 'Modelo 3D' : 'Modelos 3D' }})
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
                :src="item.imageContent"
                width="140"
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
                    {{ item.size < 1024 ? item.size + ' bytes' : item.size < 1024 * 1024 ? (item.size / 1024).toFixed(2) + ' KB' : (item.size / (1024 * 1024)).toFixed(2) + ' MB' }}
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
        :loading="loading"
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
              Agrega una nota indicando lo que deseas en especifico, NOTA: alguna modificacion de los modelos pueden alterar el precio, tiempo de impresion y costos.
            </p>
            <AppTextarea
              v-if="showNote"
              v-model="modelCheckoutCartDataLocal.note"
              @input="handleNoteUpdate($event.target.value)"
              rows="2"
              label="NOTA"
              placeholder="Dinos lo que piensas"
              hint="Comparte tus ideas o sugerencias sobre el diseño o la calidad de la impresión."
            />

            <br>

            <h6 class="text-h6">
              <a href= "#" @click="showNote = !showNote; if (showNote) noteMessage = 'Eliminar esta nota'; else { noteMessage = 'Añadir una nota'; modelCheckoutCartDataLocal.note = '' }">{{ noteMessage }}</a>
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
