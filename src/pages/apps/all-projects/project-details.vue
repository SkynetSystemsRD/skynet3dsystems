<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import 'video.js/dist/video-js.css';
import { onMounted, ref } from 'vue';
 
interface CourseContent {
  title: string;
  status: string;
  time: string;
  topics: { title: string; time: string; isCompleted: boolean }[];
}

interface CourseDetails {
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
  content: CourseContent[];
  description: string;
}

const courseDetails = ref<CourseDetails>({
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
  content: [
    {
      title: "Introduction to UI/UX",
      status: "Completed",
      time: "30m",
      topics: [
        { title: "What is UI/UX?", time: "10m", isCompleted: true },
        { title: "Importance of UX", time: "20m", isCompleted: true }
      ]
    },
    {
      title: "Wireframing Basics",
      status: "In Progress",
      time: "45m",
      topics: [
        { title: "Tools for Wireframing", time: "15m", isCompleted: false },
        { title: "Best Practices", time: "30m", isCompleted: false }
      ]
    }
  ]
});

const panelStatus = ref(0);

onMounted(() => {
  // const scene = new THREE.Scene();
  // const camera = new THREE.PerspectiveCamera(75, 440 / 250, 0.1, 1000);
  // const renderer = new THREE.WebGLRenderer();
  // renderer.setSize(440, 250);
  // document.getElementById('model-viewer')?.appendChild(renderer.domElement);

  // // Carga del modelo STL
  // const loader = new STLLoader();
  // loader.load(
  //   '/xyzCalibration_cube.stl',
  //   (geometry) => {
  //     console.log('STL loaded', geometry);

  //     if (geometry) {
  //       const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  //       const mesh = new THREE.Mesh(geometry, material);
  //       mesh.scale.set(0.01, 0.01, 0.01); // Ajusta la escala si es necesario
  //       scene.add(mesh);
  //     } else {
  //       console.error('La geometría está vacía o no válida.');
  //     }
  //   },
  //   (progress) => {
  //     console.log('Cargando STL...', progress);
  //   },
  //   (error) => {
  //     console.error('Error al cargar STL:', error);
  //   }
  // );

  // // Iluminación
  // const light = new THREE.DirectionalLight(0xffffff, 1);
  // light.position.set(5, 5, 5).normalize(); // Posición de la luz
  // scene.add(light);


  // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // directionalLight.position.set(5, 5, 5).normalize();
  // scene.add(directionalLight);

  // // Cámara y renderizado
  // camera.position.z = 1;  // Aleja la cámara
  // function animate() {
  //   requestAnimationFrame(animate);
  //   renderer.render(scene, camera);
  // }
  // animate();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  const camera = new THREE.PerspectiveCamera(
    75, 440 / 250, 0.1, 1000
  );
  camera.rotation.y = 45 / 180 * Math.PI;
  camera.position.x = 800;
  camera.position.y = 100;
  camera.position.x = 1000;

  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(440, 250);
  document.getElementById('model-viewer')?.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Enable damping for smoother movements
  controls.dampingFactor = 0.25; // Set damping factor
  controls.screenSpacePanning = false; // Disable panning if desired

  const hlight = new THREE.AmbientLight(0x404040, 100);
  scene.add(hlight);

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 100);
  directionalLight.position.set(0, 1, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const light1 = new THREE.PointLight(0xC4C4C4, 10);
  light1.position.set(0, 300, 500);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xC4C4C4, 10);
  light2.position.set(500, 100, 0);
  scene.add(light2);

  const light3 = new THREE.PointLight(0xC4C4C4, 10);
  light3.position.set(0, 100, -500);
  scene.add(light3);

  const light4 = new THREE.PointLight(0xC4C4C4, 10);
  light4.position.set(-50, 300, 0);
  scene.add(light4);

  const loader = new GLTFLoader();
  loader.load('/xyzCalibration_cube.gltf', (gltf) => {
    const model = gltf.scene.children[0];
    model.scale.set(0.5, 0.5, 0.5);
    scene.add(gltf.scene);
    // renderer.render(scene, camera);
    animate();
  });

  function animate(){
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
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
              Prof. <span class="text-h6 d-inline-block">{{ courseDetails?.instructor }}</span>
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
                {{ courseDetails?.about }}
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
                      <VListItemTitle>Skill Level: {{ courseDetails?.skillLevel }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-users"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Students: {{ courseDetails?.totalStudents }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-world"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Languages: {{ courseDetails?.language }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-file"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Captions: {{ courseDetails?.isCaptions }}</VListItemTitle>
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
                      <VListItemTitle>Lectures: {{ courseDetails?.totalLectures }}</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon
                          icon="tabler-clock"
                          size="20"
                        />
                      </template>
                      <VListItemTitle>Video: {{ courseDetails?.length }}</VListItemTitle>
                    </VListItem>
                  </VList>
                </div>
              </div>
              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Description
              </h5>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="courseDetails?.description" />

              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                Instructor
              </h5>
              <div class="d-flex align-center gap-x-4">
                <VAvatar
                  :image="courseDetails?.instructorAvatar"
                  size="38"
                />
                <div>
                  <h6 class="text-h6 mb-1">
                    {{ courseDetails?.instructor }}
                  </h6>
                  <div class="text-body-2">
                    {{ courseDetails?.instructorPosition }}
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
            v-for="(section, index) in courseDetails?.content"
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
                  <div class="text-medium-emphasis font-weight-normal">
                    {{ section.status }} | {{ section.time }}
                  </div>
                </div>
              </template>
              <template #text>
                <VList class="card-list">
                  <VListItem
                    v-for="(topic, id) in section.topics"
                    :key="id"
                    class="py-4"
                  >
                    <template #prepend>
                      <VCheckbox
                        :model-value="topic.isCompleted"
                        class="me-1"
                      />
                    </template>
                    <VListItemTitle class="text-high-emphasis font-weight-medium">
                      {{ id + 1 }} . {{ topic.title }}
                    </VListItemTitle>
                    <VListItemSubtitle>
                      <div class="text-body-2">
                        {{ topic.time }}
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
