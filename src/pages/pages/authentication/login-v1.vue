<script setup lang="ts">
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useRoute } from 'vue-router'

const route = useRoute();
const router = useRouter()

const pendingToGo = route.query.pending_to_go || '/main-pages/landing-page'; // Default fallback

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const emailRule = value => !!value && /\S+@\S+\.\S+/.test(value) || 'Correo electrónico no válido';
const strongPasswordRule = value => 
  !!value && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) || 
  'La contraseña debe tener al menos 8 caracteres, un número y un carácter especial';
const required = value => !! value || 'Campo requerido'; 

const form = ref({
  userEmailOrUserName: '',
  password: '',
  remember: false,
})

const messageinfo = ref(`🚨 ¡Oops! Parece que esas credenciales no son correctas. 🤔
Verifica tu usuario y contraseña, o tal vez tu teclado está jugando una broma. ⌨️😆
¡Inténtalo de nuevo! 🚀`)
const isSnackbarScrollReverseVisible = ref(false)
const isPasswordVisible = ref(false)

const login = async () => {
  if (!form.value.userEmailOrUserName || !form.value.password) {
    console.log('Errores en el formulario');
    return;
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/userLogin`, {
      userName: form.value.userEmailOrUserName,
      userEmail: form.value.userEmailOrUserName,
      password: form.value.password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.validLogin) {
      localStorage.setItem('userData', JSON.stringify(jwtDecode(response.data.token)));
      console.log(pendingToGo)
      // CORREGIR ESTO PARA QUE SI PENDINGTOGO NO ES INDEFINO O VACIO QUE VAYA A SU RUTA, DE LO CONTRARIO A LA PAGINA PRINCIPAL
      // if (pendingToGo){
      //   await router.push(pendingToGo)
      // }
      // else {
      //   await router.push('/main-pages/landing-page')
      // }
      
    } else {
      console.error("El campo 'user' no está presente en la respuesta");
      isSnackbarScrollReverseVisible.value = true
    }
  } catch (error) {
    console.log('validateForm: ', error.response?.data?.message || error.message);
    isSnackbarScrollReverseVisible.value = true
  }
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <VCardTitle>
            <RouterLink to="/main-pages/landing-page">
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title">
                  {{ themeConfig.app.title }}
                </h1>
              </div>
            </RouterLink>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">
            <!-- Bienvenido a <span class="text-capitalize">{{ themeConfig.app.title }}</span>! 👋🏻 -->
          </h4>
          <p class="mb-0">
            Inicia sesión en tu cuenta y comienza la aventura. 👋🏻
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="login">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.userEmailOrUserName"
                  autofocus
                  label="Email o Usuario"
                  type="email"
                  :rules="[required]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  label="Contraseña"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :rules="[required, strongPasswordRule]"
                />

                <!-- remember me checkbox -->
                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox
                    v-model="form.remember"
                    label="Recordarme"
                  />

                  <RouterLink
                    class="text-primary"
                    :to="{ name: 'pages-authentication-forgot-password-v1' }"
                  >
                    Has olvidado tu contraseña?
                  </RouterLink>
                </div>

                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                >
                  Acceso
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-body-1 text-center"
              >
                <span class="d-inline-block">
                  Eres nuevo en la plataforma?
                </span>
                <RouterLink
                  class="text-primary ms-1 d-inline-block text-body-1"
                  :to="{ name: 'pages-authentication-register-v1' }"
                >
                  Crear una cuenta
                </RouterLink>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4 text-high-emphasis">o también</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
  <VSnackbar
    v-model="isSnackbarScrollReverseVisible"
    transition="scroll-y-reverse-transition"
    location="top end"
  >
    {{ messageinfo }}
  </VSnackbar>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
