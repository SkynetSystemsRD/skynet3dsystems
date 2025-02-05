<script setup lang="ts">
// import boyWithLogo from '@images/main-pages/landing-page/faq-boy-with-logos.png';
import video from '@images/main-pages/landing-page/main-page-video1.mp4';

const faqData = [
  {
    question: '¿Ofrecen servicios de escaneo 3D?',
    answer: 'Sí, en Skynet 3D Systems ofrecemos servicios de escaneo 3D de alta precisión para piezas de diferentes tamaños, ideal para ingeniería inversa, prototipado y más.',
  },
  {
    question: '¿Pueden realizar impresiones 3D en diferentes materiales?',
    answer: 'Ofrecemos impresiones en una variedad de materiales, incluyendo PLA, ABS, PETG y resina, adaptándonos a las necesidades específicas de cada proyecto.',
  },
  {
    question: '¿Cómo solicito una cotización personalizada?',
    answer: 'Puedes solicitar una cotización personalizada completando nuestro formulario en línea. Solo necesitas subir tu archivo 3D o describir tu proyecto y te responderemos rápidamente.',
  },
  {
    question: '¿Ofrecen servicios de diseño 3D desde cero?',
    answer: 'Sí, contamos con un equipo especializado en diseño 3D que puede crear modelos personalizados según tus especificaciones y requerimientos.',
  },
  {
    question: '¿Cuál es el tiempo de entrega para una impresión 3D?',
    answer: 'El tiempo de entrega depende del tamaño y la complejidad de la pieza. Generalmente, los proyectos pequeños se entregan en 2-3 días hábiles, mientras que los más grandes pueden tardar más.',
  },
]

</script>

<template>
  <div id="preguntas">
    <VContainer>
      <!-- 👉 Header  -->
      <div class="faq-section">
        <div class="headers d-flex justify-center flex-column align-center">
          <VChip
            label
            color="primary"
            size="small"
            class="mb-4"
          >
            Preguntas Frecuentes
          </VChip>
          <h4 class="d-flex align-center text-h4 mb-1 flex-wrap justify-center">
            Preguntas Frecuentes
            <div class="position-relative ms-2">
              <div class="section-title">
                Skynet 3D Systems
              </div>
            </div>
          </h4>
          <p class="text-body-1 mb-0">
            Explora estas preguntas frecuentes para encontrar respuestas a dudas comunes sobre nuestros servicios 3D.
          </p>
        </div>
        <VRow>
          <VCol
            cols="12"
            md="5"
          >
            <div class="pt-10 d-flex align-center justify-center h-100">
              <!-- <VImg
                :src="boyWithLogo"
                height="330"
                width="330"
              /> -->

              <video  
                :src="video" 
                height="330" 
                width="330" 
                autoplay 
                muted 
                loop 
                playsinline
              ></video>
            </div>
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <VExpansionPanels class="pt-16">
              <VExpansionPanel
                v-for="faq in faqData"
                :key="faq.question"
              >
                <VExpansionPanelTitle>
                  {{ faq.question }}
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                  {{ faq.answer }}
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
video {
  overflow: hidden;
  border: 4px solid #2a9d8f;
  block-size: 300px; /* Amplificado el tamaño */
  border-end-end-radius: 40px;
  border-start-start-radius: 40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 20%);
  inline-size: 600px; /* Amplificado el tamaño */
}

.faq-section {
  margin-block: 5.25rem;
}

@media (max-width: 600px) {
  .faq-section {
    margin-block: 4rem;
  }
}

#faq {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgba(var(--v-theme-background));
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
  font-weight: 800;
  inline-size: 130%;
  inset-block-end: 12%;
  inset-inline-start: -12%;
}
</style>
