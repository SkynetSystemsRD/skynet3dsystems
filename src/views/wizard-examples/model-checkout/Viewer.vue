<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { nextTick, onMounted } from 'vue';
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
const panelStatus = ref(1);
const instructions = [
    {
      title: "👋 Manipulación del Modelo 3D",
      topics: [
      { 
          title: "Mover la entorno", 
          instruction1: "Mantén presionado el botón derecho del ratón",
          instruction2: "y mueve el ratón para mover el entorno de la escena.",
          icon: "tabler-direction"
        },
        { 
          title: "Rotar la cámara", 
          instruction1: "Mantén presionado el botón izquierdo del ratón",
          instruction2: "y mueve el ratón para rotar el entorno de la escena.",
          icon: "tabler-rotate"
        },
        { 
          title: "Rotacion Manual/Automatica del modelo 3D", 
          instruction1: "Seleccione el modelo que desea rotar luego presione el boton de rotar y el check",
          instruction2: "de rotacion automatica, lo mismo para la rotacion manual.",
          icon: "tabler-rotate-2"
        },
        { 
          title: "Acercar/Lejar el Modelo", 
          instruction1: "Usa la rueda del ratón para acercar o alejar el modelo.",
          instruction2: "",
          icon: "tabler-zoom"
        },
        { 
          title: "Mover el Modelo", 
          instruction1: "Seleccion con click izquierdo y mantén presionado el botón izquierdo del ratón y arrastra para ",
          instruction2: "mover el modelo 3D.",
          icon: "tabler-mouse"
        },
        { 
          title: "Elimnar el Modelo", 
          instruction1: "Seleccion con click izquierdo el modelo 3D que desea eliminar",
          instruction2: "y presione el boton rojo con la X",
          icon: "tabler-x"
        }
      ]
    },
  ]

const models_counts = ref(0);
const rotateButtonColor = ref('primary')
const rotateButtonText = ref('Rotacion Desactivada')
const isSnackbarVisible = ref(false)
const InfoMessage = ref('')
const checkboxString = ref('Rotacion Manual')
const inFill = ref(10)
const filament = ref([
  {
    name: 'PTEG',
    density: 1.38,
    diameter: 1.75,
    filamentCost: 25000,
    filamentWeight: 1200,
    filamentLenght: 362,
    costPerMeter: 69.15
  }
])

const emit = defineEmits<Emit>()

let models = <{ id: number; uuid: string; parent_uuid: string | undefined}[]>([]);
let id = 0

const modelCheckoutAddressDataLocal = ref<ModelCheckoutData>(JSON.parse(JSON.stringify(props.modelCheckoutData)))

watch(() => props.modelCheckoutData, value => {
  Object.assign(modelCheckoutAddressDataLocal.value, value);

  if (models_counts.value !== modelCheckoutAddressDataLocal.value.modelItems.length) {
    reload();
    initModels();
  }

  if (JSON.stringify(modelCheckoutAddressDataLocal.value) !== JSON.stringify(value)) {
    console.log('ha cambiado : ', modelCheckoutAddressDataLocal.value)
    emit("update:checkout-data", { ...modelCheckoutAddressDataLocal.value });
  }

  models_counts.value = modelCheckoutAddressDataLocal.value.modelItems.length;
});


const updateCartData = () => {
  emit("update:checkout-data", { ...modelCheckoutAddressDataLocal.value });

  // if (modelCheckoutCartDataLocal.value.modelItems.length > 0)
  //   emit('update:currentStep', 1)
  // else emit('update:currentStep', 0)
};

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
  console.log('aja: ', modelCheckoutAddressDataLocal.value)
  emit('update:checkout-data', modelCheckoutAddressDataLocal.value)
}

const nextStep = () => {
  updateAddressData()
  emit('update:currentStep', props.currentStep ? props.currentStep + 1 : 1)
}

// watch(() => props.currentStep, updateAddressData)

const reload = () => {
  var container = document.getElementById("model-viewer");

  if (container) {  // Verifica si el contenedor existe
    var content = "";
    container.innerHTML = content;  // Recarga el contenido del contenedor
    
    // Esta línea es para ver el resultado en la consola, puedes eliminarla después
    console.log("Refreshed");
  } else {
    console.error("El contenedor no se encuentra en el DOM.");
  }
}

const initModels = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  const camera = new THREE.PerspectiveCamera(75, 1000 / 600, 0.1, 1000);
  camera.position.set(300, 300, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  // renderer.setSize(1000, 600);
  document.getElementById('model-viewer')?.appendChild(renderer.domElement);

  // Redimensiona el renderizador según el tamaño del contenedor
  function resizeRenderer() {
    const container = document.getElementById('model-viewer');
    if (!container) {
      console.log("not container");
      return;
    }

    let width = container.clientWidth;
    let height = container.clientHeight;

    if (width === 0 || height === 0) {
      console.log("Tamaño 0, reintentando...");
      setTimeout(resizeRenderer, 200); // Reintenta después de 100ms
      return;
      
    }
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  nextTick(() => {
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);333
  });

  setTimeout(() => {
    resizeRenderer();  // Llamar a resizeRenderer después de un pequeño retraso
  }, 100);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Agrega un evento para detectar cambios en el control de la cámara
  controls.addEventListener('change', () => {
    
  });

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

  // Agregar la plataforma de referencia (220x220 mm)
  const platformGeometry = new THREE.PlaneGeometry(220, 220);
  const platformMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.rotation.x = -Math.PI / 2; // Ponerlo en el suelo
  platform.position.y = 0;
  scene.add(platform);

  // Crear material para las líneas y el marco superior
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x58A6DA });

  // Coordenadas de las cuatro esquinas de la base
  const corners = [
      new THREE.Vector3(-110, 0, -110), // Esquina trasera izquierda
      new THREE.Vector3(110, 0, -110),  // Esquina trasera derecha
      new THREE.Vector3(110, 0, 110),   // Esquina frontal derecha
      new THREE.Vector3(-110, 0, 110)   // Esquina frontal izquierda
  ];

  // Crear líneas verticales de 270 mm de alto
  const height = 270;
  const verticalLines: THREE.Line[] = [];

  corners.forEach(corner => {
      const points = [corner, new THREE.Vector3(corner.x, height, corner.z)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
      verticalLines.push(line);
  });

  // Crear el marco superior conectando las cuatro líneas verticales
  const topFramePoints = [
      verticalLines[0].geometry.attributes.position.array.slice(3, 6), // Top de la primera línea
      verticalLines[1].geometry.attributes.position.array.slice(3, 6), // Top de la segunda línea
      verticalLines[2].geometry.attributes.position.array.slice(3, 6), // Top de la tercera línea
      verticalLines[3].geometry.attributes.position.array.slice(3, 6), // Top de la cuarta línea
      verticalLines[0].geometry.attributes.position.array.slice(3, 6)  // Volver al inicio para cerrar
  ].map(arr => new THREE.Vector3(arr[0], arr[1], arr[2]));

  const topFrameGeometry = new THREE.BufferGeometry().setFromPoints(topFramePoints);
  const topFrame = new THREE.LineLoop(topFrameGeometry, lineMaterial);
  scene.add(topFrame);

  let loadedModels: THREE.Object3D[] = [];
  let selectedModel: THREE.Object3D | null = null;
  let isDragging = false;
  let isRotating = false;  // Variable para controlar si el modelo seleccionado debe rotar

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const offset = new THREE.Vector3();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  function loadModel(item: ModelItem) {
    let loader: any;
    let fileType = item.fileName.split('.').pop()?.toLowerCase();

    switch (fileType) {
      case 'glb':
      case 'gltf':
        loader = new GLTFLoader();
        loader.load(item.octetStreamContent, (gltf) => {
          addModelToScene(gltf.scene);
          console.log("gltf: ", gltf.scene.uuid);
          models.push({ id: id++, uuid: gltf.scene.uuid, parent_uuid: gltf.scene.parent.uuid });

          item.price = calculatePrintCost(gltf.scene, inFill.value, 1.7, 69.15);
          updateOrderAmount(); // Función para recalcular el total
        });
        break;

      case 'obj':
        loader = new OBJLoader();
        loader.load(item.octetStreamContent, (obj) => {
          addModelToScene(obj);
          console.log('obj: ', obj.uuid);
          models.push({ id: id++, uuid: obj.uuid, parent_uuid: obj.parent.uuid });

          item.price = calculatePrintCost(obj, inFill.value, 1.7, 69.15);
          updateOrderAmount();
        });
        break;

      case 'fbx':
        loader = new FBXLoader();
        loader.load(item.octetStreamContent, (fbx) => {
          addModelToScene(fbx);
          console.log('fbx: ', fbx.uuid);
          models.push({ id: id++, uuid: fbx.uuid, parent_uuid: fbx.parent.uuid });

          item.price = calculatePrintCost(fbx, inFill.value, 1.7, 69.15);
          updateOrderAmount();
        });
        break;

      case 'stl':
        loader = new STLLoader();
        loader.load(item.octetStreamContent, (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
          const mesh = new THREE.Mesh(geometry, material);
          addModelToScene(mesh);
          console.log('stl: ', mesh.uuid);
          models.push({ id: id++, uuid: mesh.uuid, parent_uuid: mesh.parent?.uuid });

          item.price = calculatePrintCost(mesh, inFill.value, 1.7, 69.15);
          updateOrderAmount();
        });
        break;

      default:
        console.error('Unsupported model format');
    }
  }

  // Función para recalcular el total
  function updateOrderAmount() {
    modelCheckoutAddressDataLocal.value.orderAmount = modelCheckoutAddressDataLocal.value.modelItems
      .reduce((total, model) => total + (model.price || 0), 0);
    
    console.log('Total Order Amount:', modelCheckoutAddressDataLocal.value.orderAmount);
    // Emitir el cambio para actualizar en los demás componentes
    emit("update:checkout-data", { ...modelCheckoutAddressDataLocal.value });
  }

  // Inicializar el total en 0 antes de empezar
  modelCheckoutAddressDataLocal.value.orderAmount = 0;

  // Cargar todos los modelos
  modelCheckoutAddressDataLocal.value.modelItems.forEach(loadModel);


  function addModelToScene(model: THREE.Object3D) {
    model.scale.set(0.5, 0.5, 0.5);
    
    // Asegurar que el modelo esté en la posición y=0 antes de calcular su altura
    model.position.set(0, 0, 0);
    scene.add(model);

    // Recalcular el tamaño del modelo después de agregarlo a la escena
    const box = new THREE.Box3().setFromObject(model);
    box.expandByScalar(0.1); // Expande un poco la caja para evitar errores

    const height = box.max.y - box.min.y;
    const modelBottom = box.min.y; // Altura del punto más bajo del modelo

    // Ajustar posición para que el modelo quede sobre la plataforma
    model.position.y = model.position.y - modelBottom + (height / 2);

    loadedModels.push(model);
  }

  function selectAndDragModel(event: MouseEvent) {
    if (event.button !== 0) return; // Solo clic izquierdo

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
                ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(0xffff00); 
            }
        });

        // Calcular la posición inicial del modelo
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersection);
        offset.copy(intersection).sub(selectedModel.position);

        isDragging = true;
        controls.enabled = false; // 🔴 Disable OrbitControls
    }
  }

  function moveModel(event: MouseEvent) {
    if (!isDragging || !selectedModel) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersection = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(plane, intersection)) {
      selectedModel.position.copy(intersection.sub(offset));

      // Obtener límites de la plataforma
      // const minX = -110, maxX = 110;
      // const minZ = -110, maxZ = 110;

      // // Verificar si el modelo está fuera de los límites
      // const isOutside =
      //   selectedModel.position.x < minX ||
      //   selectedModel.position.x > maxX ||
      //   selectedModel.position.z < minZ ||
      //   selectedModel.position.z > maxZ;

      // Cambiar el color si está fuera de la plataforma
      selectedModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(
            /*isOutside ? 0xff0000 : */0x555555
          );
        }
      });
    }
  }

  function releaseModel() {
    isDragging = false;
    controls.enabled = true; // ✅ Re-enable OrbitControls
  }

  function removeModel() {
    if (!selectedModel) {
      isSnackbarVisible.value = true
      InfoMessage.value = '🙂 Debe de seleccionar el modelo 3D a eliminar!'
      return;
    }

    scene.remove(selectedModel);
    loadedModels = loadedModels.filter(model => model.uuid !== uuid);
    
    // modelCheckoutAddressDataLocal.value.modelItems.forEach(model => {
    //   console.log("model: ", model)
    // });

    selectedModel.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });

    console.log("Modelo eliminado:", uuid);
    selectedModel = null;
  }

  function rotatebutton (){
    if (!selectedModel)  // Si no hay un modelo seleccionado, no hacer nada 
    {
      isSnackbarVisible.value = true
      InfoMessage.value = '😄 Debe de seleccionar el modelo 3D para rotar!'
      return;
    }

    // Cambiar el estado de rotación
    isRotating = !isRotating;

    if (isRotating){
      rotateButtonColor.value = 'outlined'
      rotateButtonText.value = 'Rotacion Activada'
    }
    else {
      rotateButtonColor.value = 'primary'
      rotateButtonText.value = 'Rotacion Desactivada'
    }
  }

  function resetModels() {
    // Restablecer todos los modelos cargados a la posición original, rotación y escala
    // loadedModels.forEach(model => {
    //   model.position.set(0, 0, modelZ); // Restablecer posición
    //   model.rotation.set(0, 0, 0); // Restablecer rotación
    //   // model.scale.set(0.5, 0.5, 0.5); // Restablecer escala a valor original
    // });
  }

  function calculatePrintCost(model: THREE.Object3D, infill: number, scale: number, costPerGram: number) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    // Volumen estimado en cm³ (Aproximado usando la caja delimitadora)
    const volumeCm3 = (size.x * scale) * (size.y * scale) * (size.z * scale) / 1000; 

    // Ajustar por infill (Ej: 20% infill usa solo 20% del material sólido)
    const effectiveVolume = volumeCm3 * (infill / 100);

    // Peso estimado en gramos (Asumiendo densidad de N g/cm³ para PLA)
    const density = filament.value[0].density; // g/cm³ (Varía según material)
    const weightGrams = effectiveVolume * density;

    // Precio total
    return weightGrams * costPerGram;
  }

  renderer.domElement.addEventListener('mousedown', selectAndDragModel);
  renderer.domElement.addEventListener('mousemove', moveModel);
  renderer.domElement.addEventListener('mouseup', releaseModel);

  function animate() {
    if (isRotating && selectedModel && checkboxString.value === 'Rotacion Automatica') {
      // Rota el modelo alrededor del eje Y
      selectedModel.rotation.y += 0.01;  // Puedes ajustar el valor para cambiar la velocidad de rotación
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Aquí el botón de eliminación
  const removeButton = document.getElementById("removeButton");
  removeButton?.addEventListener("click", removeModel); // Añadir evento al botón

  // Aquí el botón de eliminación
  const rotateButton = document.getElementById("rotateButton");
  rotateButton?.addEventListener("click", rotatebutton); // Añadir evento al botón

  const resetButton = document.getElementById("resetButton");
  resetButton?.addEventListener("click", resetModels); // Añadir evento al botón de restaurar

  animate();
}

onMounted(() => {
  initModels()
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
          <VExpansionPanels
            v-model="panelStatus"
            variant="accordion"
            class="expansion-panels-width-border"
          >
            <template
              v-for="(section, index) in instructions"
              :key="index"
            >
              <VExpansionPanel
                elevation="0"
                :value="index"
                expand-icon="tabler-chevron-right"
                collapse-icon="tabler-chevron-down"
              >
                <template #title>
                  <div>
                    <h5 class="text-h5 mb-1">
                      {{ section.title }}
                    </h5> 
                  </div>
                </template>
                <template #text>
                  <VList class="card-list">
                    <VListItem
                      v-for="(topic, id) in section.topics"
                      :key="id"
                      class="py-4"
                    >
                      <!-- <template #prepend>
                        <VCheckbox
                          :model-value="topic.isCompleted"
                          class="me-1"
                        />
                      </template> -->
                      <VListItemTitle class="text-high-emphasis font-weight-medium">
                        {{ id + 1 }} . {{ topic.title }} 
                        <VIcon
                          size="24"
                          :icon="topic.icon"
                        />
                      </VListItemTitle>
                      <VListItemSubtitle>
                        <div class="text-body-2">
                          {{ topic.instruction1 }}
                        </div>
                      </VListItemSubtitle>
                      <VListItemSubtitle>
                        <div class="text-body-2">
                          {{ topic.instruction2 }}
                        </div>
                      </VListItemSubtitle>
                    </VListItem>
                  </VList>
                </template>
              </VExpansionPanel>
            </template>
          </VExpansionPanels>

          <div class="px-2 pt-2">
            <div id="model-viewer" class="w-100 rounded" style=" block-size: 600px;inline-size: 800px;"></div>
          </div>

          <br>

          <v-container>
            <v-row>
              <v-col>
                <div style="display: flex; gap: 30px;">
                  <VBtn
                    rounded="pill"
                    :color="rotateButtonColor"
                    id="rotateButton"
                  >
                    <VTooltip
                      location="top"
                      transition="scale-transition"
                      activator="parent"
                    >
                      <span>Boton para Rotar el Modelo</span>
                    </VTooltip>
                    <VIcon size="34" icon="tabler-arrows-move" />
                    {{ rotateButtonText }}
                  </VBtn>
                  <VCheckbox
                    v-model="checkboxString"
                    true-value="Rotacion Automatica"
                    false-value="Rotacion Manual"
                    color="success"
                    :label="`${checkboxString.toString()}`"
                  />
                  <VBtn
                    rounded="pill"
                    id="removeButton"
                    color="error"
                  >
                    <VTooltip
                      location="top"
                      transition="scale-transition"
                      activator="parent"
                    >
                      <span>Boton para Eliminar el Modelo</span>
                    </VTooltip>
                    <VIcon size="34" icon="tabler-x" />
                    Eliminar
                  </VBtn>
                  <VBtn
                    rounded="pill"
                    id="resetButton"
                    color="success"
                  >
                    <VTooltip
                      location="top"
                      transition="scale-transition"
                      activator="parent"
                    >
                      <span>Boton para Reposicionar todos los Modelos</span>
                    </VTooltip>
                    <VIcon size="34" icon="tabler-x" />
                    Reposicionar
                  </VBtn>
                  
                  <AppTextField
                    v-model="inFill"
                    label="Relleno"
                    placeholder="50"
                    type="number"
                  >
                    <template #append-inner>
                      <VTooltip
                        text="El rellenado en impresión 3D es el soporte interno del objeto para dar estabilidad y reducir material. Sera aplicado a todos estos modelos"
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
                </div>
              </v-col>
            </v-row>
          </v-container>
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
  <!-- Snackbar -->
  <VSnackbar
    v-model="isSnackbarVisible"
    :timeout="5000"
  >
    {{ InfoMessage }}
  </VSnackbar>
</template>

<style lang="scss">
#model-viewer {
  block-size: 600px;
  inline-size: 800%;
}

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
