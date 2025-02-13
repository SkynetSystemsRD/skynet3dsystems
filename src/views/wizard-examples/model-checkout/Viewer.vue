<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { nextTick, onMounted } from 'vue';
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

const models_counts = ref(0);

const emit = defineEmits<Emit>()

const modelCheckoutAddressDataLocal = ref<ModelCheckoutData>(JSON.parse(JSON.stringify(props.modelCheckoutData)))

watch(() => props.modelCheckoutData, value => {
  modelCheckoutAddressDataLocal.value = JSON.parse(JSON.stringify(value))

  models_counts.value = modelCheckoutAddressDataLocal.value.modelItems.length
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

// 
// function calcularCostoPorModelo(longitudFilamentoModelo) {
//   // Datos proporcionados
//   const costoFilamentoTotal = 25000; // en pesos
//   const longitudFilamentoTotal = 402; // en metros
//   const costoPorMetro = costoFilamentoTotal / longitudFilamentoTotal; // Costo por metro de filamento
  
//   // Cálculo del costo para el modelo
//   const costoModelo = longitudFilamentoModelo * costoPorMetro;
  
//   return costoModelo;
// }

// // Ejemplo de uso: si el modelo usa 10 metros de filamento
// const costoDelModelo = calcularCostoPorModelo(10); 
// console.log(`El costo del modelo es: ${costoDelModelo} pesos.`);


onMounted(() => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  const camera = new THREE.PerspectiveCamera(75, 1000 / 600, 0.1, 1000);
  camera.position.set(30, 30, 30);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  // renderer.setSize(1000, 600);
  document.getElementById('model-viewer')?.appendChild(renderer.domElement);

  // Redimensiona el renderizador según el tamaño del contenedor
  function resizeRenderer() {
    const container = document.getElementById('model-viewer');
    if (container) {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width !== 0 && height !== 0) {  // Verifica que el tamaño no sea 0
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    }
  }

  nextTick(() => {
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);
  });

  setTimeout(() => {
    resizeRenderer();  // Llamar a resizeRenderer después de un pequeño retraso
  }, 100);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const hlight = new THREE.AmbientLight(0x404040, 1);
  scene.add(hlight);

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 4);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  let loadedModels: THREE.Object3D[] = [];
  let selectedModel: THREE.Object3D | null = null;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let isDragging = false;

  function loadModel(item: any) {
    let loader: any;
    let fileType = item.fileName.split('.').pop()?.toLowerCase();

    switch (fileType) {
      case 'glb':
      case 'gltf':
        loader = new GLTFLoader();
        loader.load(item.octetStreamContent, (gltf) => {
          addModelToScene(gltf.scene);
        });
        break;

      case 'obj':
        loader = new OBJLoader();
        loader.load(item.octetStreamContent, (obj) => {
          addModelToScene(obj);
        });
        break;

      case 'fbx':
        loader = new FBXLoader();
        loader.load(item.octetStreamContent, (fbx) => {
          addModelToScene(fbx);
        });
        break;

      case 'stl':
        loader = new STLLoader();
        loader.load(item.octetStreamContent, (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
          const mesh = new THREE.Mesh(geometry, material);
          addModelToScene(mesh);
        });
        break;

      default:
        console.error('Unsupported model format');
    }
  }

  function addModelToScene(model: THREE.Object3D) {
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, 0, 0);
    scene.add(model);
    loadedModels.push(model);
  }

  modelCheckoutAddressDataLocal.value.modelItems.forEach(loadModel);

  // function selectModel(event: MouseEvent) {
  //   if (!event.ctrlKey && !event.shiftKey) return;

  //   const rect = renderer.domElement.getBoundingClientRect();
  //   mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  //   mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  //   raycaster.setFromCamera(mouse, camera);
  //   const intersects = raycaster.intersectObjects(loadedModels, true);

  //   if (intersects.length > 0) {
  //     selectedModel = intersects[0].object;
  //     console.log("Modelo seleccionado:", selectedModel);
  //     isDragging = true;
  //   }
  // }

  // function moveModel(event: MouseEvent) {
  //   if (!isDragging || !selectedModel) return;

  //   const rect = renderer.domElement.getBoundingClientRect();
  //   mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  //   mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  //   raycaster.setFromCamera(mouse, camera);
  //   const intersects = raycaster.intersectObjects(scene.children, true);

  //   if (intersects.length > 0) {
  //     const point = intersects[0].point;
  //     selectedModel.position.set(point.x, point.y, point.z);
  //   }
  // }

  function selectModel(event: MouseEvent) {
    if (event.button !== 0) return; // Detecta solo clic izquierdo

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(loadedModels, true);

    if (intersects.length > 0) {
        // Restaurar el color del modelo previamente seleccionado
        if (selectedModel) {
            selectedModel.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(0x555555); // Color original
                }
            });
        }

        selectedModel = intersects[0].object;
        console.log("Modelo seleccionado:", selectedModel);

        // Cambiar el color del modelo seleccionado
        selectedModel.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(0xff0000); // Rojo
            }
        });

        isDragging = true;
    }
  } 



  function releaseModel() {
    isDragging = false;
  }

  renderer.domElement.addEventListener('mousedown', selectModel);
  // renderer.domElement.addEventListener('mousemove', moveModel);
  renderer.domElement.addEventListener('mouseup', releaseModel);

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
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
      <!-- Invoice with ID  {{ route.params.id }} not found! -->
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
