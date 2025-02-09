<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import 'video.js/dist/video-js.css';
import { onMounted, ref } from 'vue';
 
interface modelInstructions {
  title: string;
  topics: { 
    title: string; 
    instruction: string; 
    icon: string;  // You can use icon names or paths to icon images
  }[];
}

interface projectDetails {
  title: string;
  about: string;
  instructor: string;
  instructorAvatar: string;
  instructorPosition: string;
  skillLevel: string;
  totalLectures: number;
  totalStudents: number;
  isCaptions: boolean;
  language: string;
  length: string;
  instructions: modelInstructions[];
  description: string;
}

const projectDetails = ref<projectDetails>({
  title: "UI/UX Basic Fundamentals",
  about: "This course covers the fundamentals of UI/UX design, including wireframing, prototyping, and usability testing.",
  instructor: "John Doe",
  instructorAvatar: "https://via.placeholder.com/150",
  instructorPosition: "Senior UI/UX Designer",
  skillLevel: "Beginner",
  totalLectures: 20,
  totalStudents: 1200,
  isCaptions: true,
  language: "English",
  length: "4h 30m",
  description: "<p>Learn the essential skills for UI/UX design. This course is perfect for beginners and covers all the fundamental principles.</p>",
  instructions: [
    {
      title: "Manipulación del Modelo 3D",
      topics: [
        { 
          title: "Rotar el Modelo", 
          instruction: "Mantén presionado el botón izquierdo del ratón\ny mueve el ratón para rotar el modelo.",
          icon: "tabler-rotate"
        },
        { 
          title: "Acercar/Lejar el Modelo", 
          instruction: "Usa la rueda del ratón para acercar\n o alejar el modelo.",
          icon: "tabler-zoom"
        },
        { 
          title: "Mover el Modelo", 
          instruction: "Mantén presionado el botón derecho del ratón\n y arrastra para mover el modelo.",
          icon: "tabler-mouse"
        }
      ]
    },
  ]
});

const panelStatus = ref(0);

onMounted(() => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  // Configuración de la cámara
  const camera = new THREE.PerspectiveCamera(
    75, 440 / 250, 0.1, 1000
  );
  camera.rotation.y = 45 / 180 * Math.PI;
  camera.position.set(18, 14, 5);  // Ajusta la posición de la cámara para un buen ángulo de visión
  camera.fov = 75;  // Ajuste del FOV para un zoom moderado

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(795, 350);
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
  const directionalLight_z_up = new THREE.DirectionalLight(0xFFFFFF, 3);  // Luz más intensa desde arriba
  directionalLight_z_up.position.set(5, 5, 5);  // Aseguramos que la luz venga de arriba
  directionalLight_z_up.castShadow = true;
  scene.add(directionalLight_z_up);

  // Luz direccional ejes negativos
  const directionalLight_z_down = new THREE.DirectionalLight(0xFFFFFF, 2);  // Luz más intensa desde arriba
  directionalLight_z_down.position.set(-5, -5, -5);  // Aseguramos que la luz venga de arriba
  directionalLight_z_down.castShadow = true;
  scene.add(directionalLight_z_down);

  // Carga el modelo
  const loader = new GLTFLoader();
  loader.load('/xyzCalibration_cube.gltf', (gltf) => {
    const model = gltf.scene.children[0];
    model.scale.set(0.5, 0.5, 0.5);  // Ajusta la escala del modelo
    model.position.set(0, 0, 0);  // Centra el modelo
    scene.add(gltf.scene);
    animate();
  });

  // Función de animación
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    // console.log("x:", camera.position.x);
    // console.log("y:", camera.position.y);
    // console.log("z:", camera.position.z);
  }
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
          title="UI/UX Basic Fundamentals"
          class="pb-6"
        >
          <template #subtitle>
            <div class="text-body-1">
              Prof. <span class="text-h6 d-inline-block">{{ projectDetails?.instructor }}</span>
            </div>
          </template>
          <template #append>
            <div class="d-flex gap-4 align-center">
              <VChip
                variant="tonal"
                color="error"
                size="small"
              >
                UI/UX
              </VChip>
              <VIcon
                size="24"
                class="cursor-pointer"
                icon="tabler-share"
              />
              <VIcon
                size="24"
                class="cursor-pointer"
                icon="tabler-bookmarks"
              />
            </div>
          </template>
        </VCardItem>
        <VCardText>
          <VCard
            flat
            border
          >
            <div class="px-2 pt-2">
              <div id="model-viewer" class="w-100 rounded"></div>
            </div>
            <VCardText>
              <h5 class="text-h5 mb-4">
                About this course
              </h5>
              <p class="text-body-1">
                {{ projectDetails?.about }}
              </p>
              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                By the numbers
              </h5>
              <div class="d-flex gap-x-12 gap-y-5 flex-wrap">
                <div>
                  <VList class="card-list text-medium-emphasis">
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-check"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Skill Level: {{ projectDetails?.skillLevel }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-users"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Students: {{ projectDetails?.totalStudents }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-world"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Languages: {{ projectDetails?.language }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-file"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Captions: {{ projectDetails?.isCaptions }}</VListItemTitle>
                    </VListItem>
                  </VList>
                </div>

                <div>
                  <VList class="card-list text-medium-emphasis">
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-video"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Lectures: {{ projectDetails?.totalLectures }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-clock"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Video: {{ projectDetails?.length }}</VListItemTitle>
                    </VListItem>
                  </VList>
                </div>
              </div>
              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Description
              </h5>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="projectDetails?.description" />

              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Instructor
              </h5>
              <div class="d-flex align-center gap-x-4">
                <VAvatar
                  :image="projectDetails?.instructorAvatar"
                  size="38"
                />
                <div>
                  <h6 class="text-h6 mb-1">
                    {{ projectDetails?.instructor }}
                  </h6>
                  <div class="text-body-2">
                    {{ projectDetails?.instructorPosition }}
                  </div>
                </div>
              </div>
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
                        {{ topic.instruction }}
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

<style lang="scss" scoped>
.course-content {
  position: sticky;
  inset-block: 4rem 0;
}

.card-list {
  --v-card-list-gap: 16px;
}
</style>

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
}
</style>
