<script setup lang="ts">
interface Props {
  searchQuery: string
}
const props = defineProps<Props>()

// Data table options
const itemsPerPage = ref(6)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const hideCompleted = ref(true)
const label = ref('All Projects')

// Simulación de los datos de la API
const coursesData = {
  total: 42,
  currentPage: 1,
  itemsPerPage: 10,
  courses: [
    {
      id: 1,
      title: "Introducción a JavaScript",
      description: "Aprende los fundamentos de JavaScript desde cero.",
      completed: false,
      label: "Programación",
      instructor: "Juan Pérez",
      rating: 4.8,
    },
    {
      id: 2,
      title: "React para Principiantes",
      description: "Construye aplicaciones web modernas con React.",
      completed: false,
      label: "Desarrollo Web",
      instructor: "María García",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Python desde Cero",
      description: "Domina los conceptos básicos de Python.",
      completed: true,
      label: "Programación",
      instructor: "Carlos Ramírez",
      rating: 4.7,
    },
    {
      id: 4,
      title: "Bases de Datos SQL",
      description: "Aprende a manejar bases de datos con SQL.",
      completed: false,
      label: "Bases de Datos",
      instructor: "Laura Fernández",
      rating: 4.6,
    },
  ],
};

const courses = computed(() => coursesData.courses)
const totalCourse = computed(() => coursesData.total)

watch([hideCompleted, label, () => props.searchQuery], () => {
  page.value = 1
})

const resolveChipColor = (tags: string) => {
  if (tags === 'Web') return 'primary'
  if (tags === 'Art') return 'success'
  if (tags === 'UI/UX') return 'error'
  if (tags === 'Psychology') return 'warning'
  if (tags === 'Design') return 'info'
}
</script>

<template>
  <VCard class="mb-6">
    <VCardText>
      <!-- 👉 Header -->
      <div class="d-flex justify-space-between align-center flex-wrap gap-4 mb-6">
        <div>
          <h5 class="text-h5">
            My Courses
          </h5>
          <div class="text-body-1">
            Total 6 courses you have purchased
          </div>
        </div>

        <div class="d-flex flex-wrap gap-x-6 gap-y-4 align-center">
          <AppSelect
            v-model="label"
            :items="[ 
              { title: 'Web', value: 'web' },
              { title: 'Art', value: 'art' },
              { title: 'UI/UX', value: 'ui/ux' },
              { title: 'Psychology', value: 'psychology' },
              { title: 'Design', value: 'design' },
              { title: 'All Courses', value: 'All Courses' }
            ]"
            style="min-inline-size: 260px;"
          />
          <VSwitch
            v-model="hideCompleted"
            label="Hide Completed"
          />
        </div>
      </div>

      <!-- 👉 Course List -->
      <div v-if="courses.length" class="mb-6">
        <VRow>
          <template v-for="course in courses" :key="course.id">
            <VCol cols="12" md="4" sm="6">
              <VCard flat border>
                <div class="px-2 pt-2">
                  <VImg
                    :src="course.tutorImg"
                    class="cursor-pointer"
                    @click="() => $router.push({ name: '' })"
                  />
                </div>
                <VCardText>
                  <div class="d-flex justify-space-between align-center mb-4">
                    <VChip
                      variant="tonal"
                      :color="resolveChipColor(course.label)"
                      size="small"
                    >
                      {{ course.label }}
                    </VChip>
                    <div class="d-flex">
                      <h6 class="text-h6 text-medium-emphasis align-center me-1">
                        {{ course.rating }}
                      </h6>
                      <VIcon icon="tabler-star-filled" color="warning" size="24" class="me-2" />
                      <div class="text-body-1">({{ course.rating }})</div>
                    </div>
                  </div>
                  <h5 class="text-h5 mb-1">
                    <RouterLink :to="{ name: '' }" class="projects-title">
                      {{ course.title }}
                    </RouterLink>
                  </h5> 
                  <p>{{ course.description }}</p>
                  <div v-if="course.completed" class="mb-1">
                    <VIcon icon="tabler-check" size="20" color="success" class="me-1" />
                    <span class="text-success text-body-1">Completed</span>
                  </div>
                  <VProgressLinear :model-value="(course.completed ? 100 : 0)" rounded color="primary" height="8" class="mb-4" />
                  <div class="d-flex flex-wrap gap-4">
                    <VBtn variant="tonal" color="secondary" class="flex-grow-1" :to="{ name: '' }">
                      Start Over
                    </VBtn>
                    <VBtn v-if="!course.completed" variant="tonal" class="flex-grow-1" :to="{ name: '' }">
                      Continue
                    </VBtn>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </template>
        </VRow>
      </div>

      <div v-else>
        <h4 class="text-h4 text-center mb-6">
          No Course Found
        </h4>
      </div>

      <VPagination
        v-model="page"
        active-color="primary"
        first-icon="tabler-chevrons-left"
        last-icon="tabler-chevrons-right"
        show-first-last-page
        :length="Math.ceil(totalCourse / itemsPerPage)"
      />
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.projects-title {
  &:not(:hover) {
    color: rgba(var(--v-theme-on-surface), var(--v-text-high-emphasis));
  }
}
</style>
