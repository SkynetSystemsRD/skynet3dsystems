<script setup lang="ts">
import check from '@images/svg/Check.svg'
import keyboard from '@images/svg/keyboard.svg'
import laptop from '@images/svg/laptop.svg'
import paper from '@images/svg/paper-send.svg'
import rocket from '@images/svg/rocket.svg'
import user from '@images/svg/user.svg'

const featuresData = [
  { title: 'Impresión 3D Personalizada', desc: 'Creamos modelos 3D únicos adaptados a tus ideas y necesidades.', icon: check },
  { title: 'Prototipado Rápido', desc: 'Desarrolla prototipos funcionales en menos tiempo con alta precisión.', icon: keyboard },
  { title: 'Modelado 3D Profesional', desc: 'Diseños digitales detallados listos para impresión o simulación.', icon: laptop },
  { title: 'Asesoría Técnica', desc: 'Consultoría experta en materiales, técnicas de impresión y optimización de modelos.', icon: paper },
  { title: 'Producción en Serie', desc: 'Capacidad de producción de piezas en grandes volúmenes con calidad constante.', icon: rocket },
  { title: 'Galería de Proyectos', desc: 'Explora nuestros trabajos anteriores para inspirarte y conocer nuestra experiencia.', icon: user }
]
</script>

<template>
  <VContainer id="features">
    <div class="feature-cards">
      <div class="headers d-flex justify-center flex-column align-center mb-12">
        <VChip
          label
          color="primary"
          class="mb-4"
          size="small"
        >
        Servicios de Skynet 3D Systems
        </VChip>
        <div class="d-flex text-h4 mb-1 align-center flex-wrap justify-center">
          <div class="position-relative me-2">
            <div class="section-title">
              Impresiones 3D de Alta Calidad
            </div>
          </div>
          para llevar tus ideas al siguiente nivel
        </div>
        <p class="text-body-1 mb-0">
          En Skynet 3D Systems ofrecemos soluciones innovadoras en impresión 3D, personalizadas para tus necesidades.
        </p>
      </div>
      <VRow>
        <VCol
          v-for="(data, index) in featuresData"
          :key="index"
          cols="12"
          md="4"
          sm="6"
        >
          <div class="d-flex flex-column align-center justify-center gap-4 mx-auto">
            <VIcon
              :icon="data.icon"
              size="64"
              color="primary"
            />
            <div class="text-center">
              <h5 class="text-h5 mb-2">
                {{ data.title }}
              </h5>
              <p
                class="text-body-1 mb-6"
                style="max-inline-size: 310px;"
              >
                {{ data.desc }}
              </p>
            </div>
          </div>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.feature-cards {
  margin-block: 3.75rem;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/front-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.feature {
  .v-avatar {
    &.v-avatar--variant-outlined {
      border: 2px solid rgba(var(--v-theme-primary), 0.32);

      &:hover {
        background: rgba(var(--v-theme-primary), 0.16);
        cursor: pointer;
      }
    }
  }
}
</style>
