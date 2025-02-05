<script setup lang="ts">
import main_icon1 from '@images/main-pages/icons/main-icon1.png';
import main_icon2 from '@images/main-pages/icons/main-icon2.png';
import main_icon3 from '@images/main-pages/icons/main-icon3.png';

const annualMonthlyPlanPriceToggler = ref(true)

// REPARAR EL ESPACIO ENTRE CADA SERVICIO O TECHNOLOGIA
const technologies = [
{
  title: 'Impresión 3D',
  image: main_icon1,
  monthlyPrice: 19,
  yearlyPrice: 168,
  features: [
    'Impresiones personalizadas',
    'Materiales variados',
    'Alta resolución',
    'Soporte para piezas',
    'Diseño personalizado',
    'Entrega rápida'
  ],
  supportType: 'Básico',
  supportMedium: 'Solo Email',
  respondTime: 'Promedio: 24h',
  current: false
},
{
  title: 'Escaneo 3D',
  image: main_icon2,
  monthlyPrice: 29,
  yearlyPrice: 264,
  features: [
    'Escaneo preciso',
    'Escaneo de varios tamaños',
    'Modelado en 3D',
    'Formato 3D estándar',
    'Alta calidad',
    'Reparación de mallas'
  ],
  supportType: 'Estándar',
  supportMedium: 'Email y Chat',
  respondTime: 'Promedio: 6h',
  current: true
},
{
  title: 'Grabado/Corte Láser',
  image: main_icon3,
  monthlyPrice: 49,
  yearlyPrice: 444,
  features: [
    'Grabado y corte',
    'Materiales como metal',
    'Personalización de diseños',
    'Corte en grosor',
    'Diseños grabados',
    'Soporte personalizado'
  ],
  supportType: 'Exclusivo',
  supportMedium: 'Email, Chat y Google Meet',
  respondTime: 'Soporte en vivo',
  current: false
}
]
</script>

<template>
  <div id="technologies">
    <VContainer>
      <div class="technologies">
        <!-- 👉 Headers  -->
        <div class="headers d-flex justify-center flex-column align-center flex-wrap">
          <VChip
            label
            color="primary"
            class="mb-4"
            size="small"
          >
            Variedad de Servicios
          </VChip>
          <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2">
              <div class="section-title">
                Impresión 3D, Escaneo 3D
              </div>
            </div>
            y Soluciones de Grabado/Corte Láser
          </h4>
          <div class="text-center text-body-1">
            <p class="mb-0">
              Descubre nuestra variedad de servicios para dar vida a tus ideas.
            </p>
            <p class="mb-0">
              Elige el servicio que mejor se adapte a las necesidades de tu proyecto.
            </p>
          </div>
        </div>
        <!-- 👉 Annual and monthly price toggler -->
        <div class="d-flex align-center justify-center mx-auto mt-6 mb-16">
          <!-- <VLabel
            for="pricing-plan-toggle"
            class="me-3"
          >
            Pay Monthly
          </VLabel>
          <div class="position-relative">
            <VSwitch
              id="pricing-plan-toggle"
              v-model="annualMonthlyPlanPriceToggler"
            >
              <template #label>
                <div class="text-body-1">
                  Pay Annually
                </div>
              </template>
            </VSwitch>
            <div class="position-absolute pricing-plan-arrow d-md-flex d-none">
              <VImg
                :src="pricingPlanArrow"
                class="flip-in-rtl"
                width="60"
                height="42"
              />
              <div class="text-no-wrap text-body-1 font-weight-medium">
                Save 25%
              </div>
            </div>
          </div> -->
        </div>
        <VRow>
          <VCol
            v-for="(plan, index) in technologies"
            :key="index"
          >
          <VCard :style="'border:2px solid rgb(var(--v-theme-primary))'">
            <VCardText class="pa-8 pt-12">
              <VImg
                :src="plan.image"
                width="88"
                height="88"
                class="mx-auto mb-8"
              />
              <h4 class="text-h4 text-center">
                {{ plan.title }}
              </h4>
              <div class="d-flex justify-center mb-8 position-relative">
                <!-- <div class="d-flex align-end">
                  <div class="pricing-title text-primary me-1">
                    ${{ annualMonthlyPlanPriceToggler ? Math.floor(plan.yearlyPrice) / 12 : plan.monthlyPrice }}
                  </div>
                  <span class="text-disabled mb-2">/mo</span>
                </div> -->

                <!-- 👉 Annual Price -->
                <!-- <span
                  v-show="annualMonthlyPlanPriceToggler"
                  class="annual-price-text position-absolute text-sm text-disabled"
                >
                  {{ plan.yearlyPrice === 0 ? 'free' : `USD ${plan.yearlyPrice}/Year` }}
                </span> -->
              </div>
              <VList class="card-list">
                <VListItem
                  v-for="(item, i) in plan.features"
                  :key="i"
                >
                  <template #prepend>
                    <VAvatar
                      size="16"
                      variant="elevated"
                      color="primary"
                      class="me-3"
                    >
                      <VIcon
                        icon="tabler-check"
                        size="12"
                        color="white"
                      />
                    </VAvatar>
                    <h6 class="text-h6">
                      {{ item }}
                    </h6>
                  </template>
                </VListItem>
              </VList>
              <VBtn
                block
                variant="elevated"
                class="mt-8"
                :to="{ name: 'main-pages-payment' }"
              >
                Explorar
              </VBtn>
            </VCardText>
          </VCard>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 12px;
}

#pricing-plan {
  border-radius: 3.75rem;
  background-color: rgb(var(--v-theme-background));
}

.pricing-title {
  font-size: 38px;
  font-weight: 800;
  line-height: 52px;
}

.pricing-plans {
  margin-block: 5.25rem;
}

@media (max-width: 600px) {
  .pricing-plans {
    margin-block: 4rem;
  }
}

.save-upto-chip {
  inset-block-start: -1.5rem;
  inset-inline-end: -7rem;
}

.pricing-plan-arrow {
  inset-block-start: -0.5rem;
  inset-inline-end: -8rem;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/main-pages/icons/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.annual-price-text {
  inset-block-end: -40%;
}
</style>
