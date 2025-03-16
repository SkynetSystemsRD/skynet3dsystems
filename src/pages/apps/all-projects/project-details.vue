<script setup lang="ts">
import axios from 'axios';
import { register } from 'swiper/element/bundle';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

import 'video.js/dist/video-js.css';
import { onMounted, ref } from 'vue';
import { VBtn, VIcon } from 'vuetify/components';

register();

interface ModelItem {
  id: number
  fileName: string
  filePath: string
  format: string
  size: number
  octetStreamContent: string
  uuid: string
  dimentions: xyz;
  weight: number;
}

interface xyz {
  x: number | undefined,
  y: number | undefined,
  z: number | undefined,
}

interface image {
  alt: string;
  imagePath: string;
  fileExtention: string;
}

interface projectDetails {
  title: string | undefined;
  about: string;
  client: string;
  modelCheckoutCartDataLocal: ModelItem[];
  format: string;
  fileName: string,
  dimentions: xyz[];
  materials: string;
  totalPrints: number;
  weight: number;
  time: string;
  description: string;
  images: image[];
}

const route = useRoute()
const projectId = ref(route.query.projectId)
const projectNumber = ref(route.query.projectNumber)

const panelStatus = ref(0);
const selectedElement = ref('image')
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
      // {
      //   title: "Rotacion Manual/Automatica del modelo 3D",
      //   instruction1: "Seleccione el modelo que desea rotar luego presione el boton de rotar y el check",
      //   instruction2: "de rotacion automatica, lo mismo para la rotacion manual.",
      //   icon: "tabler-rotate-2"
      // },
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
    ]
  }
]

const projectDetails = ref<projectDetails>({
  title: `Projecto ${projectNumber.value}`,
  about: "Este proyecto muestra un Cubo XYZ en formato GLTF, utilizado para calibrar y verificar la orientación de los ejes en entornos 3D. Permite analizar la alineación, escala y rotación del modelo en un visor interactivo.",
  client: "John Doe",
  modelCheckoutCartDataLocal: [
    // {
    //   id: 1,
    //   format: getFileExtention('/xyzCalibration_cube.gltf'),
    //   filePath: '/xyzCalibration_cube.gltf',
    //   fileName: 'xyzCalibration_cube.gltf',
    //   size: 235654,
    //   octetStreamContent: '',
    //   uuid: '',
    //   dimentions: {
    //     x: 42,
    //     y: 42,
    //     z: 42
    //   },
    //   weight: 250
    // },
    // {
    //   id: 2,
    //   format: getFileExtention('/xyzCalibration_cube.gltf'),
    //   filePath: '/xyzCalibration_cube.gltf',
    //   fileName: 'xyzCalibration_cube.gltf',
    //   size: 235654,
    //   octetStreamContent: '',
    //   uuid: '',
    //   dimentions: {
    //     x: 42,
    //     y: 42,
    //     z: 42
    //   },
    //   weight: 250
    // },
    // {
    //   id: 3,
    //   format: getFileExtention('/xyzCalibration_cube.gltf'),
    //   filePath: '/xyzCalibration_cube.gltf',
    //   fileName: 'xyzCalibration_cube.gltf',
    //   size: 235654,
    //   octetStreamContent: '',
    //   uuid: '',
    //   dimentions: {
    //     x: 42,
    //     y: 42,
    //     z: 42
    //   },
    //   weight: 250
    // }
  ],
  fileName: '',
  format: '',
  dimentions: [{
    x: 0,
    y: 0,
    z: 0
  },
  ],
  weight: 0,
  materials: "PLA, ABS, PETG, Resina, etc.",
  totalPrints: 56,
  time: "4h 30m",
  description: "Este proyecto presenta un Cubo XYZ en formato GLTF, diseñado para la calibración y verificación de los ejes en entornos 3D. Facilita la evaluación de la alineación, escala y rotación del modelo mediante un visor interactivo, asegurando una correcta orientación en el espacio tridimensional.",
  images: [
    // { alt: "1", imagePath: main3dImage1, fileExtention: "png" },
    // { alt: "2", imagePath: main3dImage2, fileExtention: "png" },
    // { alt: "3", imagePath: main3dImage3, fileExtention: "png" },
    // { alt: "4", imagePath: main3dImage4, fileExtention: "png" },
    // { alt: "5", imagePath: main3dImage5, fileExtention: "png" },
    // { alt: "6", imagePath: main3dImage6, fileExtention: "png" },
  ]
});

const selectOption = (option: string) => {
  selectedElement.value = option;

  if (selectedElement.value == 'model') {
    reload()
    initModels()
  }
}

const storedData = localStorage.getItem('userData');
const userData = storedData ? JSON.parse(storedData) : null;

const getModelsByProjectId = async (projectId: string) => {
  try {
    // Await the response from axios
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/models/getModelsByProjectId`, {
      projectId: projectId
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const models = response.data.models
    return models
  } catch (error) {
    console.log('Error in getModelsByProjectId: ', error.response?.data?.message || error.message);
    return null
  }
}

const getProjectById = async () => {
  try {

    console.log(projectId.value)
    // Await the response from axios
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/projects/getProjectById`, {
      projectId: projectId.value
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const project = response.data.project
    if (response.data.result) {

      const models = await getModelsByProjectId(project._id)
      let index = 1;

      for (const m of models) {
        projectDetails.value.images.push({
          alt: (index).toString(),
          imagePath: `data:image/png;base64,${m.fileImageContent}` || '',
          fileExtention: "png"
        })

        projectDetails.value.modelCheckoutCartDataLocal.push({
          id: index,
          format: m.format,
          filePath: `data:application/octet-stream;base64,${m.fileModelContent}`,
          fileName: m.fileName,
          size: m.size,
          octetStreamContent: `data:application/octet-stream;base64,${m.fileModelContent}`,
          uuid: m.uuid,
          dimentions: {
            x: m.dimentions.x,
            y: m.dimentions.y,
            z: m.dimentions.z
          },
          weight: m.weight
        })

        index++
      }
    }
  } catch (error) {
    console.log('Error in getProjectById: ', error.response?.data?.message || error.message);
  }
};

// {
//       id: 1,
//       format: getFileExtention('/xyzCalibration_cube.gltf'),
//       filePath: '/xyzCalibration_cube.gltf',
//       fileName: 'xyzCalibration_cube.gltf',
//       size: 235654,
//       octetStreamContent: '',
//       uuid: '',
//       dimentions: {
//         x: 42,
//         y: 42,
//         z: 42
//       },
//       weight: 250
//     },

function reload() {
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

function getFileExtention(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';  // Returns the extension or an empty string if no extension
}

const initModels = () => {
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
    const imageViewer = document.getElementById('image-viewer');

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

    // Ajustar tamaño de la imagen
    if (imageViewer) {
      imageViewer.style.width = `${width}px`;
      imageViewer.style.height = `${height}px`;
    }
  }

  nextTick(() => {
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer); 333
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

  let loadedModels: THREE.Object3D[] = [];
  let selectedModel: THREE.Object3D | null = null;
  let isDragging = false;
  let isRotating = false;  // Variable para controlar si el modelo seleccionado debe rotar

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const offset = new THREE.Vector3();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  function loadModel(item: any) {
    let loader: any;
    let fileType = item.fileName.split('.').pop()?.toLowerCase();

    console.log(item.format)

    switch (item.format) {
      case 'glb':
      case 'gltf':
        loader = new GLTFLoader();
        loader.load(item.filePath, (gltf) => {
          addModelToScene(gltf.scene);
          console.log("gltf: ", gltf.scene.uuid)
        });
        break;

      case 'obj':
        loader = new OBJLoader();
        loader.load(item.filePath, (obj) => {
          addModelToScene(obj);
          console.log('obj: ', obj.uuid)
        });
        break;

      case 'fbx':
        loader = new FBXLoader();
        loader.load(item.filePath, (fbx) => {
          addModelToScene(fbx);
          console.log('fbx: ', fbx.uuid)
        });
        break;

      case 'stl':
        loader = new STLLoader();
        loader.load(item.filePath, (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
          const mesh = new THREE.Mesh(geometry, material);
          addModelToScene(mesh);
          console.log('stl: ', mesh.uuid)
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

  projectDetails.value.modelCheckoutCartDataLocal.forEach(loadModel);

  const originalColors = new Map<THREE.Object3D, THREE.Color>(); // Guardar colores originales


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
            const mesh = child as THREE.Mesh;
            const material = mesh.material as THREE.MeshStandardMaterial;
            if (originalColors.has(mesh)) {
              material.color.copy(originalColors.get(mesh)!); // Restaurar color original
            }
          }
        });
      }

      selectedModel = intersects[0].object;
      console.log("Modelo seleccionado:", selectedModel);

      // Guardar el color original antes de cambiarlo
      selectedModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;

          if (!originalColors.has(mesh)) {
            originalColors.set(mesh, material.color.clone()); // Guardar el color original
          }

          material.color.set(0xffff00); // Cambiar a amarillo
        }
      });

      // Calcular la posición inicial del modelo
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      offset.copy(intersection).sub(selectedModel.position);

      isDragging = true;
      controls.enabled = false; // 🔴 Disable OrbitControls
    }

    projectDetails.value.dimentions[0].x = selectedModel?.scale.x
    projectDetails.value.dimentions[0].y = selectedModel?.scale.y
    projectDetails.value.dimentions[0].z = selectedModel?.scale.z

    projectDetails.value.name = selectedModel?.name
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
    }
  }

  function releaseModel() {
    isDragging = false;
    controls.enabled = true; // ✅ Re-enable OrbitControls
  }

  renderer.domElement.addEventListener('mousedown', selectAndDragModel);
  renderer.domElement.addEventListener('mousemove', moveModel);
  renderer.domElement.addEventListener('mouseup', releaseModel);

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

getProjectById()

onMounted(() => {
  initModels();
});
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <VBtn color="secondary" variant="text"
        :to="{ name: 'apps-all-projects-projects', query: { from: 'project-details' } }">
        <VIcon icon="tabler-arrow-left"></VIcon> Todos mis Projectos
      </VBtn>
      <br>
      <br>
      <VCard>
        <VCardItem :title="projectDetails.title" class="pb-6">
          <template #subtitle>
            <!-- <div class="text-body-1">
              Cliente <span class="text-h6 d-inline-block">{{ projectDetails?.client }}</span>
            </div> -->
          </template>
          <template #append>
            <div class="d-flex gap-4 align-center">
              <VChip variant="tonal" color="info" size="small">
                {{ projectDetails.modelCheckoutCartDataLocal.length > 1 ?
                  'Formatos de los Modelos: ' :
                  'Formato del Modelo: ' }}
              </VChip>
              <VChip variant="tonal" size="small">
                {{[...new Set(projectDetails.modelCheckoutCartDataLocal.map(model =>
                  model.format.toUpperCase()))].join(", ")}}
              </VChip>
              <!-- <VIcon
                size="24"
                class="cursor-pointer"
                icon="tabler-share"
              />
              <VIcon
                size="24"
                class="cursor-pointer"
                icon="tabler-bookmarks"
              /> -->
            </div>
          </template>
        </VCardItem>
        <VCardText>
          <VCard flat border>
            <swiper-container id="swiperContainer" v-show="selectedElement === 'image'" class="mySwiper w-100 rounded"
              thumbs-swiper=".mySwiper2" loop="true" space-between="10" navigation="false" centered-slides="true"
              events-prefix="swiper-">
              <swiper-slide v-for="swiperImg in projectDetails?.images" :key="swiperImg.alt">
                <VImg v-if="selectedElement === 'image'" id="image-viewer" :src="swiperImg.imagePath" cover
                  class="swiper-img1" />
              </swiper-slide>
            </swiper-container>
            <div v-show="selectedElement === 'model'" class="px-2 pt-2">
              <div id="model-viewer" class="w-100 rounded" style=" block-size: 600px;inline-size: 800px;"></div>
            </div>
            <swiper-container class="mySwiper2" loop="true" free-mode="false" events-prefix="swiper-"
              slides-per-view="4">
              <swiper-slide v-for="(swiperImg) in projectDetails?.images" :key="swiperImg.alt"
                @click="selectOption('image')">
                <VImg :src="swiperImg.imagePath" cover class="swiper-img2" />
              </swiper-slide>
            </swiper-container>

            <div style="display: flex; justify-content: end;">
              <VBtn @click="selectOption('model')">
                <div style="display: flex; gap: 10px;">
                  <VIcon icon="tabler-cube" size="20" />
                  Ver 3D
                </div>
              </VBtn>
            </div>

            <VCardText>
              <h5 class="text-h5 mb-4">
                📌 Acerca del Proyecto
              </h5>
              <p class="text-body-1">
                {{ projectDetails?.about }}
              </p>
              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Propiedades del Projecto
              </h5>
              <div class="d-flex gap-x-12 gap-y-5 flex-wrap">
                <div>
                  <VList class="card-list text-medium-emphasis">
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-atom" size="20" />
                      </template>
                      <VListItemTitle>Materiales: {{ projectDetails?.materials }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-cube" size="20" />
                      </template>
                      <VListItemTitle>Dimensiones: Altura: {{ projectDetails.dimentions[0].z }}mm, Ancho: {{
                        projectDetails?.dimentions[0].x }}mm, Profundidad: {{ projectDetails?.dimentions[0].y }}mm
                      </VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-weight" size="20" />
                      </template>
                      <VListItemTitle>
                        Peso: {{ projectDetails?.weight >= 1000
                          ? (projectDetails.weight / 1000).toFixed(2) + ' KG'
                          : projectDetails.weight + ' G' }}
                      </VListItemTitle>
                    </VListItem>
                    <!-- <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-file"
                          size="20"
                        />
                      </template>
                    </VListItem> -->
                  </VList>
                </div>

                <div>
                  <VList class="card-list text-medium-emphasis">
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-number" size="20" />
                      </template>
                      <VListItemTitle>Numero de impresiones: {{ projectDetails?.totalPrints }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-clock" size="20" />
                      </template>
                      <VListItemTitle>Tiempo Impresión: {{ projectDetails?.time }}</VListItemTitle>
                    </VListItem>
                  </VList>
                </div>
              </div>
              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                📌 Descripción
              </h5>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="projectDetails?.description" />

              <!-- <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Client
              </h5>
              <div class="d-flex align-center gap-x-4">
                <VAvatar
                  :image="projectDetails?.instructorAvatar"
                  size="38"
                />
                <div>
                  <h6 class="text-h6 mb-1">
                    {{ projectDetails?.client }}
                  </h6>
                  <div class="text-body-2">
                    {{ projectDetails?.instructorPosition }}
                  </div>
                </div>
              </div> -->
            </VCardText>
          </VCard>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="4">
      <div class="course-content">
        <VExpansionPanels v-model="panelStatus" variant="accordion" class="expansion-panels-width-border">
          <template v-for="(section, index) in instructions" :key="index">
            <VExpansionPanel elevation="0" :value="index" expand-icon="tabler-chevron-right"
              collapse-icon="tabler-chevron-down">
              <template #title>
                <div>
                  <h5 class="text-h5 mb-1">
                    {{ section.title }}
                  </h5>
                </div>
              </template>
              <template #text>
                <VList class="card-list">
                  <VListItem v-for="(topic, id) in section.topics" :key="id" class="py-4">
                    <!-- <template #prepend>
                      <VCheckbox
                        :model-value="topic.isCompleted"
                        class="me-1"
                      />
                    </template> -->
                    <VListItemTitle class="text-high-emphasis font-weight-medium">
                      {{ id + 1 }} . {{ topic.title }}
                      <VIcon size="24" :icon="topic.icon" />
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
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutsMixins;

body .v-layout .v-application__wrap {
  .course-content {
    .v-expansion-panels {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      border-radius: 6px;

      .v-expansion-panel {
        &--active {
          .v-expansion-panel-title--active {
            border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }
        }

        .v-expansion-panel-title {
          .v-expansion-panel-title__overlay {
            background-color: rgba(var(--v-theme-on-surface));
            opacity: var(--v-hover-opacity) !important;
          }

          &:hover {
            .v-expansion-panel-title__overlay {
              opacity: var(--v-hover-opacity) !important;
            }
          }

          &__icon {
            .v-icon {
              block-size: 1.5rem !important;
              color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
              font-size: 1.5rem !important;
              inline-size: 1.5rem !important;

              @include layoutsMixins.rtl {
                transform: scaleX(-1);
              }
            }
          }
        }

        .v-expansion-panel-text {
          &__wrapper {
            padding-block: 1rem;
            padding-inline: 0.75rem;
          }
        }
      }
    }
  }

  .card-list {
    .v-list-item__prepend {
      .v-list-item__spacer {
        inline-size: 8px !important;
      }
    }
  }

  swiper-container {
    background-color: #fff;
  }

  .mySwiper2 {
    swiper-slide {
      border: 5px solid whitesmoke;
      block-size: 50%;
      inline-size: 25%;
      opacity: 0.4;
    }

    .swiper-slide-thumb-active {
      opacity: 1;
    }
  }

  .swiper-img1 {
    block-size: 360px;
    inline-size: 795px;
  }

  .swiper-img2 {
    block-size: 75px;
    inline-size: 275px;
  }

  .swiper-svg2 {
    block-size: 65px;
    inline-size: 265px;
    margin-inline-start: -40px;

    /* Mueve 20px a la izquierda */
  }
}
</style>
