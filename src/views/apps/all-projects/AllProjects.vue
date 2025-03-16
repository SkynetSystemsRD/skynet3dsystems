<script setup lang="ts">
import axios from 'axios';
import { computed, ref, watch } from 'vue';

interface Props {
  searchQuery: string;
}
const props = defineProps<Props>();

const route = useRoute()
const from = ref(route.query.from)

// Data table options
const itemsPerPage = ref(6);
const page = ref(1);
const sortBy = ref();
const orderBy = ref();
const hideCompleted = ref(true);
const label = ref('All Projects');
const fullLoadProjects = ref(true)

interface Project {
  id: string;
  userId: string
  title: string;
  description: string;
  completed: boolean;
  instructor: string;
  rating: string;
  projectImg: any;
}

// Simulación de los datos de la API
const projectsData = ref({
  total: 0,
  currentPage: 1,
  itemsPerPage: 10,
  projects: [] as Project[],
  // [{
  //   id: 1,
  //   title: `Proyecto ${1}`,
  //   description: "Descripción del proyecto.",
  //   completed: 1 % 2 === 0,
  //   instructor: "Instructor X",
  //   rating: (Math.random() * (5 - 4) + 4).toFixed(1),
  //   projectImg: academyCourseIllustration2Dark,
  // }],
});

const paginatedProjects = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return projectsData.value.projects.slice(start, end);
});

const storedData = localStorage.getItem('userData');
const userData = storedData ? JSON.parse(storedData) : null;

const totalProjects = computed(() => projectsData.value.total);
const messageInfo = ref('Proyectos de nuestros clientes ya realizados')

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

const getAllProjects = async () => {
  try {
    // Await the response from axios
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/projects/getAllProjects`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });

    const projects = response.data.projects
    console.log(response.data)
    if (response.data.result) {
      projectsData.value.total = projects.length
      let indexProject = 1

      for (const p of projects) {
        const models = await getModelsByProjectId(p._id)
        const randomIndex = getRandomNumber(projects.length)

        // Ensure all fields are present when pushing a new project
        projectsData.value.projects.push({
          id: p._id,
          userId: p.userId,
          title: `Proyecto ${indexProject++}` || '',
          description: models.map(model => model.fileName).join(", ") || '',
          completed: 1 % 2 === 0,
          instructor: '',
          rating: (Math.random() * (5 - 4) + 4).toFixed(1),
          projectImg: `data:image/png;base64,${models[randomIndex].fileImageContent}` || '',
        });
      }

      setTimeout(() => {
        fullLoadProjects.value = false
      }, 700)
    }
  } catch (error) {
    console.log('Error in getAllProjects: ', error.response?.data?.message || error.message);

    setTimeout(() => {
      fullLoadProjects.value = false
    }, 700)
  }
};

const getProjectsByUserId = async () => {
  try {
    // Await the response from axios
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/projects/getProjectsByUserId`, {
      userId: userData.id
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const project = response.data.project
    if (response.data.result) {
      projectsData.value.total = project.length
      let indexProject = 1

      for (const p of project) {
        const models = await getModelsByProjectId(p._id)
        const randomIndex = getRandomNumber(models.length - 1)

        // Ensure all fields are present when pushing a new project
        projectsData.value.projects.push({
          id: p._id,
          title: `Proyecto ${indexProject++}` || '',
          description: models[randomIndex].fileName || '',
          completed: 1 % 2 === 0,
          instructor: '',
          rating: (Math.random() * (5 - 4) + 4).toFixed(1),
          projectImg: `data:image/png;base64,${models[randomIndex].fileImageContent}` || '',
        });
      }

      setTimeout(() => {
        fullLoadProjects.value = false
      }, 700)
    }
  } catch (error) {
    console.log('Error in getProjectsByUserId: ', error.response?.data?.message || error.message);

    setTimeout(() => {
      fullLoadProjects.value = false
    }, 700)
  }
};

function getRandomNumber(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

if (from.value === 'main-pages') {
  messageInfo.value = 'Proyectos de nuestros clientes ya realizados'
  getAllProjects()
}
else if (from.value === 'project-details') {
  messageInfo.value = 'Proyectos de nuestros clientes ya realizados'
  getAllProjects()
}
else if (userData && from.value === 'my-projects') {
  messageInfo.value = 'Tus Projectos'
  getProjectsByUserId()
}
else if (userData && from.value === 'project-details') {
  messageInfo.value = 'Tus Projectos'
  getProjectsByUserId()
}

watch([hideCompleted, label, () => props.searchQuery], () => {
  page.value = 1;
});
</script>

<template>
  <VCard class="mb-6">
    <VCardText>
      <div class="d-flex justify-space-between align-center flex-wrap gap-4 mb-6">
        <div>
          <h5 class="text-h5"> {{ messageInfo }} 🚀</h5>
          <div class="text-body-1">{{ totalProjects }} proyectos</div>
        </div>
        <!-- <VSwitch v-model="hideCompleted" label="Hide Completed" /> -->
      </div>

      <div v-if="paginatedProjects.length" class="mb-6">
        <VRow>
          <!-- <RouterLink>

          </RouterLink> -->
          <VCol v-for="projects in paginatedProjects" :key="projects.id" cols="12" md="4" sm="6">
            <RouterLink
              :to="{ name: 'apps-all-projects-project-details', query: { projectId: projects.id, projectNumber: projects.title.split(' ')[1] } }">
              <VCard flat border>
                <VImg :src="projects.projectImg" class="cursor-pointer" />
                <VCardText>
                  <h5 class="text-h5 mb-1">{{ projects.title }}</h5>
                  <p>{{ projects.description }}</p>
                  <VChip v-if="projects.userId === userData.id" variant="tonal" size="small">
                    Mi Proyecto
                  </VChip>
                  <!-- SE PUEDE USAR EL PROGRESS BAR EN UN FUTURO -->
                  <!-- <VProgressLinear :model-value="project.completed ? 100 : 0" rounded color="primary" height="8" class="mb-4" /> -->
                </VCardText>
              </VCard>
            </RouterLink>
          </VCol>
        </VRow>
      </div>

      <VProgressLinear v-if="fullLoadProjects" indeterminate color="primary" />
      <br>

      <VPagination v-model="page" :length="Math.ceil(totalProjects / itemsPerPage)" active-color="primary"
        first-icon="tabler-chevrons-left" last-icon="tabler-chevrons-right" show-first-last-page />
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.projects-title {
  &:not(:hover) {
    color: rgba(var(--v-theme-on-surface), var(--v-text-high-emphasis));
  }
}

.mega-menu-item {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}
</style>
