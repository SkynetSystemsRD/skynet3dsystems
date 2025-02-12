<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import type { ModelCheckoutData } from './types';

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
    icon: { icon: 'tabler-user' },
    title: 'Standard',
    desc: 'Get your product in 1 Week.',
    value: 'free',
  },
  {
    icon: { icon: 'tabler-star' },
    title: 'Express',
    desc: 'Get your product in 4 days.',
    value: 'express',
  },
  {
    icon: { icon: 'tabler-crown' },
    title: 'Overnight',
    desc: 'Get your product in 1 day.',
    value: 'overnight',
  },
]

const resolveAddressBadgeColor: any = {
  home: 'primary',
  office: 'success',
}

const resolveDeliveryBadgeData: any = {
  free: { color: 'success', price: 0, text: 'Free' },
  express: { color: 'secondary', price: 10, text: '$10' },
  overnight: { color: 'secondary', price: 15, text: '$15' },
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

watch(() => props.currentStep, updateAddressData)

onMounted(() => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  // Configuración de la cámara
  const camera = new THREE.PerspectiveCamera(
    75, 440 / 250, 0.1, 1000
  );
  camera.rotation.y = 45 / 180 * Math.PI;
  camera.position.set(30, 30, 30);  // Ajusta la posición de la cámara para un buen ángulo de visión
  camera.fov = 75;  // Ajuste del FOV para un zoom moderado

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(1000, 600);
  document.getElementById('model-viewer')?.appendChild(renderer.domElement);

  // Controles de órbita
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;

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

  modelCheckoutAddressDataLocal.value.modelItems.forEach((item, index) => {
    let loader;

    switch (item.fileName.split('.').pop()?.toLocaleLowerCase()) {
      case 'glb':
      case 'gltf':
        loader = new GLTFLoader();
        loader.load(item.octetStreamContent, (gltf) => {
          const model = gltf.scene.children[0];
          model.scale.set(0.5, 0.5, 0.5);  // Ajusta la escala del modelo
          model.position.set(0, 0, 0);  // Centra el modelo
          scene.add(gltf.scene);
        });
        break;

      case 'obj':
        loader = new OBJLoader();
        loader.load(item.octetStreamContent, (obj) => {
          obj.scale.set(0.5, 0.5, 0.5);  // Ajusta la escala del modelo
          obj.position.set(0, 0, 0);  // Centra el modelo
          scene.add(obj);
        });
        break;

      case 'fbx':
        loader = new FBXLoader();
        loader.load(item.octetStreamContent, (fbx) => {
          fbx.scale.set(0.5, 0.5, 0.5);  // Ajusta la escala del modelo
          fbx.position.set(0, 0, 0);  // Centra el modelo
          scene.add(fbx);
        });
        break;

      case 'stl':
        loader = new STLLoader();
        loader.load(item.octetStreamContent, (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.set(0.5, 0.5, 0.5);  // Ajusta la escala del modelo
          mesh.position.set(0, 0, 0);  // Centra el modelo
          scene.add(mesh);
        });
        break;

      default:
        console.error('Unsupported model format');
    }
  });

  // Función de animación
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate()
});
</script>

<template>
  <section v-if="true">
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <VCard class="invoice-preview-wrapper pa-6 pa-sm-12">
          <div class="px-2 pt-2">
            <div id="model-viewer" class="w-100 rounded" style=" block-size: 600px;inline-size: 800px;"></div>
          </div>
        </VCard>
      </VCol>
    </VRow>
  </section>
  <section v-else>
    <VAlert
      type="error"
      variant="tonal"
    >
      Invoice with ID  {{ route.params.id }} not found!
    </VAlert>
  </section>
</template>

<style lang="scss">
.invoice-preview-table {
  --v-table-header-color: var(--v-theme-surface);

  &.v-table .v-table__wrapper table thead tr th {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  }
}

@media print {
  .v-theme--dark {
    --v-theme-surface: 255, 255, 255;
    --v-theme-on-surface: 47, 43, 61;
    --v-theme-on-background: 47, 43, 61;
  }

  body {
    background: none !important;
  }

  .invoice-header-preview,
  .invoice-preview-wrapper {
    padding: 0 !important;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }

  .v-table__wrapper {
    overflow: hidden !important;
  }

  .vue-devtools__anchor {
    display: none;
  }
}
</style>
