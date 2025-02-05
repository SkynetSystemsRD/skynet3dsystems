<script setup lang="ts">
import paperPlane from '@images/main-pages/icons/paper-airplane.png'
import plane from '@images/main-pages/icons/plane.png'
import pricingPlanArrow from '@images/main-pages/icons/pricing-plans-arrow.png'
import shuttleRocket from '@images/main-pages/icons/shuttle-rocket.png'

const annualMonthlyPlanPriceToggler = ref(true)

// REPARAR EL ESPACIO ENTRE CADA SERVICIO O TECHNOLOGIA
const technologies = [
{
  title: 'Impresión 3D',
  image: paperPlane, // Puedes cambiar esta imagen por la que prefieras para la impresión 3D
  monthlyPrice: 19,
  yearlyPrice: 168,
  features: [
    'Impresión de piezas personalizadas',
    'Variedad de materiales (PLA, ABS, PETG, etc)',
    'Resolución alta para detalles finos',
    'Soporte de diferentes tamaños de piezas',
    'Diseño personalizado por encargo',
    'Entrega rápida',
  ],
  supportType: 'Básico',
  supportMedium: 'Solo Email',
  respondTime: 'Tiempo promedio: 24h',
  current: false,
},
{
  title: 'Escaneo 3D',
  image: plane, // Cambia la imagen por una relacionada con el escaneo 3D
  monthlyPrice: 29,
  yearlyPrice: 264,
  features: [
    'Escaneo 3D de alta precisión',
    'Escaneo de objetos de diferentes tamaños',
    'Modelado en 3D a partir del escaneo',
    'Formato de archivo compatible con impresión 3D',
    'Mejoras en la calidad de los modelos escaneados',
    'Reparación de mallas 3D',
  ],
  supportType: 'Estándar',
  supportMedium: 'Email y Chat',
  respondTime: 'Tiempo promedio: 6h',
  current: true,
},
{
  title: 'Grabado/Corte Láser',
  image: shuttleRocket, // Cambia la imagen por una relacionada con el grabado/corte láser
  monthlyPrice: 49,
  yearlyPrice: 444,
  features: [
    'Grabado y corte láser de alta precisión',
    'Grabado en materiales como madera, acrílico, metal y más',
    'Personalización de diseños',
    'Corte de piezas en diferentes grosores',
    'Diseños personalizados para grabado',
    'Soporte para proyectos industriales y personales',
  ],
  supportType: 'Exclusivo',
  supportMedium: 'Email, Chat y Google Meet',
  respondTime: 'Soporte en vivo',
  current: false,
},
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
            Pricing Plans
          </VChip>
          <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2">
              <div class="section-title">
                Tailored design plans
              </div>
            </div>
            designed for you
          </h4>
          <div class="text-center text-body-1">
            <p class="mb-0">
              All plans include 40+ advanced tools and features to boost your product.
            </p>
            <p class="mb-0">
              Choose the best plan to fit your needs.
            </p>
          </div>
        </div>
        <!-- 👉 Annual and monthly price toggler -->
        <div class="d-flex align-center justify-center mx-auto mt-6 mb-16">
          <VLabel
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
          </div>
        </div>
        <VRow>
          <VCol
            v-for="(plan, index) in technologies"
            :key="index"
          >
            <VCard :style="plan.current ? 'border:2px solid rgb(var(--v-theme-primary))' : ''">
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
                  <div class="d-flex align-end">
                    <div class="pricing-title text-primary me-1">
                      ${{ annualMonthlyPlanPriceToggler ? Math.floor(plan.yearlyPrice) / 12 : plan.monthlyPrice }}
                    </div>
                    <span class="text-disabled mb-2">/mo</span>
                  </div>

                  <!-- 👉 Annual Price -->
                  <span
                    v-show="annualMonthlyPlanPriceToggler"
                    class="annual-price-text position-absolute text-sm text-disabled"
                  >
                    {{ plan.yearlyPrice === 0 ? 'free' : `USD ${plan.yearlyPrice}/Year` }}
                  </span>
                </div>
                <VList class="card-list">
                  <VListItem
                    v-for="(item, i) in plan.features"
                    :key="i"
                  >
                    <template #prepend>
                      <VAvatar
                        size="16"
                        :variant="!plan.current ? 'tonal' : 'elevated'"
                        color="primary"
                        class="me-3"
                      >
                        <VIcon
                          icon="tabler-check"
                          size="12"
                          :color="!plan.current ? 'primary' : 'white'"
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
                  :variant="plan.current ? 'elevated' : 'tonal'"
                  class="mt-8"
                  :to="{ name: 'main-pages-payment' }"
                >
                  Get Started
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
