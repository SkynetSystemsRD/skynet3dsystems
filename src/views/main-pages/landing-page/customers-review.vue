<script setup lang="ts">
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import logo1dark from '@images/main-pages/branding/logo-1-dark.png'
import logo1light from '@images/main-pages/branding/logo-1-light.png'
import logo1 from '@images/main-pages/branding/logo-1.png'
import logo2dark from '@images/main-pages/branding/logo-2-dark.png'
import logo2light from '@images/main-pages/branding/logo-2-light.png'
import logo2 from '@images/main-pages/branding/logo-2.png'
import logo3dark from '@images/main-pages/branding/logo-3-dark.png'
import logo3light from '@images/main-pages/branding/logo-3-light.png'
import logo3 from '@images/main-pages/branding/logo-3.png'
import logo4dark from '@images/main-pages/branding/logo-4-dark.png'
import logo4light from '@images/main-pages/branding/logo-4-light.png'
import logo4 from '@images/main-pages/branding/logo-4.png'
import logo5dark from '@images/main-pages/branding/logo-5-dark.png'
import logo5light from '@images/main-pages/branding/logo-5-light.png'
import { register } from 'swiper/element/bundle'

import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'

register()

const brandLogo1 = useGenerateImageVariant(logo1light, logo1dark)
const brandLogo2 = useGenerateImageVariant(logo2light, logo2dark)
const brandLogo3 = useGenerateImageVariant(logo3light, logo3dark)
const brandLogo4 = useGenerateImageVariant(logo4light, logo4dark)
const brandLogo5 = useGenerateImageVariant(logo5light, logo5dark)

// Customer Review Data
const reviewData = [
  {
    desc: 'El servicio de impresión 3D de Skynet 3D Systems superó mis expectativas. La precisión en los detalles es impresionante.',
    img: logo1,
    rating: 5,
    name: 'Luis Rodríguez',
    position: 'Ingeniero en Santo Domingo',
    avatar: avatar1,
  },
  {
    desc: 'La calidad de las piezas impresas es excelente y la atención al cliente fue muy profesional. ¡Recomendado!',
    img: logo2,
    rating: 5,
    name: 'María Gómez',
    position: 'Diseñadora Industrial en Santiago',
    avatar: avatar2,
  },
  {
    desc: 'Skynet 3D Systems me ayudó a materializar un prototipo complejo con gran precisión. Sin duda volveré a trabajar con ellos.',
    img: logo3,
    rating: 4,
    name: 'José Martínez',
    position: 'Emprendedor en La Romana',
    avatar: avatar3,
  },
  {
    desc: 'El proceso de cotización fue rápido y sencillo. La entrega de mis modelos 3D fue puntual y de alta calidad.',
    img: logo4,
    rating: 5,
    name: 'Ana Pérez',
    position: 'Arquitecta en Punta Cana',
    avatar: avatar4,
  },
  {
    desc: 'Excelente servicio al cliente. Siempre atentos a los detalles y abiertos a resolver cualquier duda sobre el proceso de impresión.',
    img: logo3,
    rating: 5,
    name: 'Carlos Fernández',
    position: 'Empresario en Puerto Plata',
    avatar: avatar5,
  },
  {
    desc: 'Gracias a Skynet 3D Systems, pude obtener piezas personalizadas con un acabado profesional. ¡Muy satisfecho!',
    img: logo1,
    rating: 5,
    name: 'Daniela Torres',
    position: 'Estudiante de Ingeniería en Santo Domingo',
    avatar: avatar1,
  },
  {
    desc: 'La variedad de materiales y tecnologías que ofrecen me permitió elegir la mejor opción para mi proyecto.',
    img: logo2,
    rating: 5,
    name: 'Juan Castillo',
    position: 'Técnico Mecánico en San Cristóbal',
    avatar: avatar2,
  },
  {
    desc: 'Un servicio completo, desde el diseño hasta la impresión. La calidad final del producto fue impecable.',
    img: logo3,
    rating: 4,
    name: 'Gabriela Méndez',
    position: 'Freelancer en Barahona',
    avatar: avatar3,
  },
  {
    desc: 'Skynet 3D Systems ofrece un servicio rápido y confiable. La precisión en las dimensiones fue perfecta.',
    img: logo4,
    rating: 4,
    name: 'Roberto Jiménez',
    position: 'Desarrollador de Productos en Higüey',
    avatar: avatar4,
  },
  {
    desc: 'Muy satisfecho con el soporte técnico y la calidad de las impresiones. Definitivamente seguiré trabajando con ellos.',
    img: logo2,
    rating: 5,
    name: 'Paola Sánchez',
    position: 'Diseñadora Gráfica en Bonao',
    avatar: avatar5,
  },
];

const customerReviewSwiper = ref(null)

const slide = (dir: string) => {
  const swiper = customerReviewSwiper.value?.swiper

  if (dir === 'prev')
    swiper.slidePrev()

  swiper.slideNext()
}
</script>

<template>
  <div
    id="customer-review"
    class="position-relative"
  >
    <div class="customer-reviews">
      <VContainer>
        <!-- 👉 Headers  -->
        <VRow>
          <VCol
            cols="12"
            md="3"
          >
            <div
              class="headers d-flex justify-center flex-column align-start h-100"
              style="max-inline-size: 275px;"
            >
              <VChip
                label
                color="primary"
                class="mb-4"
                size="small"
              >
                Reseñas de clientes reales
              </VChip>
              <div class="position-relative mb-1 me-2">
                <div class="section-title">
                  Que dicen los clientes
                </div>
              </div>
              <p class="text-body-1 mb-12">
                Vea lo que nuestros clientes tienen que decir sobre su experiencia.
              </p>
              <div class="position-relative">
                <IconBtn
                  class="reviews-button-prev rounded me-4"
                  variant="tonal"
                  color="primary"
                  @click="slide('prev')"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    class="flip-in-rtl"
                  />
                </IconBtn>

                <IconBtn
                  class="reviews-button-next rounded"
                  variant="tonal"
                  color="primary"
                  @click="slide('next')"
                >
                  <VIcon
                    icon="tabler-chevron-right"
                    class="flip-in-rtl"
                  />
                </IconBtn>
              </div>
            </div>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <!-- 👉 Customer Review Swiper -->
            <div class="swiper-reviews-carousel">
              <!-- eslint-disable vue/attribute-hyphenation -->
              <swiper-container
                ref="customerReviewSwiper"
                slides-per-view="1"
                space-between="20"
                loop="true"
                autoplay-delay="3000"
                autoplay-disable-on-interaction="false"
                events-prefix="swiper-"
                :injectStyles="[
                  `
                    .swiper{
                      padding-block: 12px;
                      padding-inline: 12px;
                      margin-inline: -12px;
                    }
                    .swiper-button-next, .swiper-button-prev{
                      visibility: hidden;
                    }
                  `,
                ]"
                navigation="{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }"
                :breakpoints="{
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  960: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  600: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                }"
              >
                <swiper-slide
                  v-for="(data, index) in reviewData"
                  :key="index"
                >
                  <VCard class="d-flex h-100 align-stretch">
                    <VCardText class="pa-6 d-flex flex-column justify-space-between align-start">
                      <img
                        :src="data.img"
                        style="block-size: 1.375rem;"
                        class="mb-3"
                      >
                      <p class="text-body-1">
                        {{ data.desc }}
                      </p>

                      <VRating
                        :model-value="data.rating"
                        color="warning"
                        density="compact"
                        class="mb-4"
                        readonly
                      />
                      <div class="d-flex align-center gap-x-3">
                        <VAvatar
                          :image="data.avatar"
                          size="32"
                        />
                        <div>
                          <h6 class="text-h6">
                            {{ data.name }}
                          </h6>

                          <div class="text-body-2 text-disabled">
                            {{ data.position }}
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </swiper-slide>
              </swiper-container>
            </div>
          </VCol>
        </VRow>
      </VContainer>

      <VDivider class="w-100 swiper-divider" />

      <VContainer>
        <!-- 👉 Brand-logo Swiper  -->
        <div class="swiper-brands-carousel">
          <swiper-container
            slides-per-view="2"
            :space-between="10"
            events-prefix="swiper-"
            :autoplay="{
              delay: 3000,
              disableOnInteraction: true,
            }"
            :breakpoints="{
              992: {
                slidesPerView: 5,
              },
              768: {
                slidesPerView: 3,
              },
            }"
          >
            <swiper-slide
              v-for="(img, index) in [brandLogo1, brandLogo2, brandLogo3, brandLogo4, brandLogo5]"
              :key="index"
            >
              <VImg
                :src="img"
                height="38"
              />
            </swiper-slide>
          </swiper-container>
        </div>
      </VContainer>
    </div>
  </div>
</template>

<style lang="scss">
@use "swiper/css/bundle";

swiper-container::part(bullet-active) {
  border-radius: 6px;
  background-color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  inline-size: 38px;
}

swiper-container::part(bullet) {
  background-color: rgba(var(--v-theme-on-background));
}

.swiper-divider {
  margin-block: 72px 1rem;
}

.swiper-reviews-carousel {
  swiper-container {
    .swiper {
      padding-block-end: 3rem;
    }

    .swiper-button-next {
      display: none;
    }
  }

  swiper-slide {
    block-size: auto;
    opacity: 1;
  }
}
</style>

<style lang="scss" scoped>
.customer-reviews {
  padding-block: 72px 84px;
}

@media (max-width: 600px) {
  .customer-reviews {
    padding-block: 4rem;
  }
}

#customer-review {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgb(var(--v-theme-background));
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("../../../assets/images/main-pages/icons/section-title-icon.png") no-repeat left bottom/contain;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}
</style>
