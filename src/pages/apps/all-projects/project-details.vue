<script setup lang="ts">
import main3dImage1 from '@images/projects/image-project1.png';
import main3dImage2 from '@images/projects/image-project2.png';
import main3dImage3 from '@images/projects/image-project3.png';
import main3dImage4 from '@images/projects/image-project4.png';
import main3dImage5 from '@images/projects/image-project5.png';
import main3dImage6 from '@images/projects/image-project6.png';
import { register } from 'swiper/element/bundle';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

import 'video.js/dist/video-js.css';
import { onMounted, ref } from 'vue';
import { VBtn } from 'vuetify/components';

register();
 
interface modelInstructionsMovements {
  title: string;
  topics: { 
    title: string; 
    instruction1: string; 
    instruction2: string; 
    icon: string;  // You can use icon names or paths to icon images
  }[];
}

interface xyz {
  x: number,
  y: number,
  z: number
}

interface image {
  alt: string;
  imagePath: string;
  fileExtention: string;
}

interface projectDetails {
  title: string;
  about: string;
  client: string;
  fileExtention: string;
  filePath: string;
  materials: string;
  totalPrints: number;
  dimentions: xyz;
  weight: number;
  time: string;
  instructions: modelInstructionsMovements[];
  description: string;
  images: image[];
}

const panelStatus = ref(0);
const selectedElement = ref('image')

const projectDetails = ref<projectDetails>({
  title: "Modelo 3D Cubo XYZ Test",
  about: "Este proyecto muestra un Cubo XYZ en formato GLTF, utilizado para calibrar y verificar la orientación de los ejes en entornos 3D. Permite analizar la alineación, escala y rotación del modelo en un visor interactivo.",
  client: "John Doe",
  fileExtention: getFileExtention('/xyzCalibration_cube.gltf'),
  filePath: '/xyzCalibration_cube.gltf',
  materials: "PLA, ABS, PETG, Resina, etc.",
  totalPrints: 56,
  dimentions: {
      x: 42,
      y: 42,
      z: 42
    },
  weight: 250,
  time: "4h 30m",
  description: "Este proyecto presenta un Cubo XYZ en formato GLTF, diseñado para la calibración y verificación de los ejes en entornos 3D. Facilita la evaluación de la alineación, escala y rotación del modelo mediante un visor interactivo, asegurando una correcta orientación en el espacio tridimensional.",
  instructions: [
    {
      title: "Manipulación del Modelo 3D",
      topics: [
        { 
          title: "Rotar el Modelo", 
          instruction1: "Mantén presionado el botón izquierdo del ratón y mueve el ratón ",
          instruction2: "y mueve el ratón para rotar el modelo.",
          icon: "tabler-rotate"
        },
        { 
          title: "Acercar/Lejar el Modelo", 
          instruction1: "Usa la rueda del ratón para acercar o alejar el modelo.",
          instruction2: "",
          icon: "tabler-zoom"
        },
        { 
          title: "Mover el Modelo", 
          instruction1: "Mantén presionado el botón derecho del ratón y arrastra para ",
          instruction2: "mover el modelo.",
          icon: "tabler-mouse"
        }
      ]
    },
  ],
  images: [
    { alt: "1", imagePath: main3dImage1, fileExtention: "png" },
    { alt: "2", imagePath: main3dImage2, fileExtention: "png" },
    { alt: "3", imagePath: main3dImage3, fileExtention: "png" },
    { alt: "4", imagePath: main3dImage4, fileExtention: "png" },
    { alt: "5", imagePath: main3dImage5, fileExtention: "png" },
    { alt: "6", imagePath: main3dImage6, fileExtention: "png" },
  ]
});

const selectOption = (option: string) => {
  selectedElement.value = option;

  if (selectedElement.value == 'model'){
    reload()
    initializeModel()
  }
}

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

function initializeModel() {
  console.log('initializeModel')
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
  renderer.setSize(795, 350);
  document.getElementById('model-viewer')?.appendChild(renderer.domElement);

  // Redimensiona el renderizador según el tamaño del contenedor
  
  function resizeRenderer() {
    const mode_container = document.getElementById('model-viewer');
    if (mode_container) {
      const width = mode_container.clientWidth;
      const height = mode_container.clientHeight;
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

  let loader;

  switch (projectDetails?.value.fileExtention) {
    case 'glb':
    case 'gltf':
      loader = new GLTFLoader();
      loader.load(projectDetails?.value.filePath, (gltf) => {
        const model = gltf.scene.children[0];
        model.scale.set(0.5, 0.5, 0.5);  // Ajusta la escala del modelo
        model.position.set(0, 0, 0);  // Centra el modelo
        scene.add(gltf.scene);
        animate();
      });
      break;

    case 'obj':
      loader = new OBJLoader();
      loader.load(projectDetails?.value.filePath, (obj) => {
        obj.scale.set(0.5, 0.5, 0.5);  // Ajusta la escala del modelo
        obj.position.set(0, 0, 0);  // Centra el modelo
        scene.add(obj);
        animate();
      });
      break;

    case 'fbx':
      loader = new FBXLoader();
      loader.load(projectDetails?.value.filePath, (fbx) => {
        fbx.scale.set(0.5, 0.5, 0.5);  // Ajusta la escala del modelo
        fbx.position.set(0, 0, 0);  // Centra el modelo
        scene.add(fbx);
        animate();
      });
      break;

    case 'stl':
      loader = new STLLoader();
      loader.load(projectDetails?.value.filePath, (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(0.5, 0.5, 0.5);  // Ajusta la escala del modelo
        mesh.position.set(0, 0, 0);  // Centra el modelo
        scene.add(mesh);
        animate();
      });
      break;

    default:
      console.error('Unsupported model format');
  }

  // Función de animación
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}

onMounted(() => {
  initializeModel();
});
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="8"
    >
      <VCard>
        <VCardItem
          :title="projectDetails.title"
          class="pb-6"
        >
          <template #subtitle>
            <div class="text-body-1">
              Cliente <span class="text-h6 d-inline-block">{{ projectDetails?.client }}</span>
            </div>
          </template>
          <template #append>
            <div class="d-flex gap-4 align-center">
              <VChip
                variant="tonal"
                color="error"
                size="small"
              >
                Formato del Modelo: {{ projectDetails.fileExtention }}
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
          <VCard
            flat
            border
          >
            <swiper-container
              id="swiperContainer"
              v-show="selectedElement === 'image'"
              class="mySwiper w-100 rounded"
              thumbs-swiper=".mySwiper2"
              loop="true"
              space-between="10"
              navigation="false" 
              centered-slides="true"
              events-prefix="swiper-"
            >
              <swiper-slide
                v-for="swiperImg in projectDetails?.images"
                :key="swiperImg.alt"
              >
                <VImg v-if="selectedElement === 'image'" id="image-viewer" :src="swiperImg.imagePath" cover class="swiper-img1" />
              </swiper-slide>
            </swiper-container>
            <div v-show = "selectedElement === 'model'" class="px-2 pt-2">
              <div id="model-viewer" class="w-100 rounded"></div>
            </div>
            <swiper-container
              class="mySwiper2"
              loop="true"
              free-mode="false"
              events-prefix="swiper-"
              slides-per-view="4"
            >
              <swiper-slide
              v-for="(swiperImg) in projectDetails?.images"
              :key="swiperImg.alt"
              @click="selectOption('image')"
              >
                <VImg
                  :src="swiperImg.imagePath"
                  cover
                  class="swiper-img2"
                />
              </swiper-slide>
            </swiper-container>

            <VBtn
              @click="selectOption('model')"
            >
              En 3d
              <VIcon
                icon="tabler-cube"
                size="20"
              />
            </VBtn>

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
                        <VIcon
                          icon="tabler-atom"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Materiales: {{ projectDetails?.materials }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-cube"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Dimensiones: Altura: {{ projectDetails?.dimentions.z }}mm, Ancho: {{ projectDetails?.dimentions.x }}mm, Profundidad: {{ projectDetails?.dimentions.y }}mm</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-weight"
                          size="20"
                        />
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
                        <VIcon
                          icon="tabler-number"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Numero de impresiones: {{ projectDetails?.totalPrints }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-clock"
                          size="20"
                        />
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

    <VCol
      cols="12"
      md="4"
    >
      <div class="course-content">
        <VExpansionPanels
          v-model="panelStatus"
          variant="accordion"
          class="expansion-panels-width-border"
        >
          <template
            v-for="(section, index) in projectDetails?.instructions"
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
    margin-inline-start: -40px; /* Mueve 20px a la izquierda */
  }
}
</style>
