<script setup lang="ts">
import academyCourseIllustration2Dark from '@images/pages/app-academy-tutor-1.png';
import { computed, ref, watch } from 'vue';

interface Props {
  searchQuery: string;
}
const props = defineProps<Props>();

// Data table options
const itemsPerPage = ref(6);
const page = ref(1);
const sortBy = ref();
const orderBy = ref();
const hideCompleted = ref(true);
const label = ref('All Projects');

// Simulación de los datos de la API
const coursesData = ref({
  total: 21,
  currentPage: 1,
  itemsPerPage: 10,
  courses: Array.from({ length: 21 }, (_, i) => ({
    id: i + 1,
    title: `Proyecto ${i + 1}`,
    description: "Descripción del proyecto.",
    completed: i % 2 === 0,
    label: "Programación",
    instructor: "Instructor X",
    rating: (Math.random() * (5 - 4) + 4).toFixed(1),
    projectImg: academyCourseIllustration2Dark,
  })),
});

const paginatedCourses = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return coursesData.value.courses.slice(start, end);
});

const totalCourse = computed(() => coursesData.value.total);

watch([hideCompleted, label, () => props.searchQuery], () => {
  page.value = 1;
});
</script>

<template>
  <VCard class="mb-6">
    <VCardText>
      <div class="d-flex justify-space-between align-center flex-wrap gap-4 mb-6">
        <div>
          <h5 class="text-h5">Proyectos de nuestros clientes ya realizados</h5>
          <div class="text-body-1">{{ totalCourse }} proyectos</div>
        </div>
        <!-- <VSwitch v-model="hideCompleted" label="Hide Completed" /> -->
      </div>

      <div v-if="paginatedCourses.length" class="mb-6">
        <VRow>
          <!-- <RouterLink>

          </RouterLink> -->
          <VCol v-for="course in paginatedCourses" :key="course.id" cols="12" md="4" sm="6">
            <RouterLink
              :to="{ name: 'apps-all-projects-projects' }"
            >
              <VCard flat border>
              <VImg :src="course.projectImg" class="cursor-pointer" />
              <VCardText>
                <h5 class="text-h5 mb-1">{{ course.title }}</h5>
                <p>{{ course.description }}</p>
                <!-- SE PUEDE USAR EL PROGRESS BAR EN UN FUTURO -->
                <!-- <VProgressLinear :model-value="course.completed ? 100 : 0" rounded color="primary" height="8" class="mb-4" /> -->
              </VCardText>
            </VCard>
            </RouterLink>
          </VCol>
        </VRow>
      </div>

      <VPagination
        v-model="page"
        :length="Math.ceil(totalCourse / itemsPerPage)"
        active-color="primary"
        first-icon="tabler-chevrons-left"
        last-icon="tabler-chevrons-right"
        show-first-last-page
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

.mega-menu-item {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

</style>
