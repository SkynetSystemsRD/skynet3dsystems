<script setup lang="ts">
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import axios from 'axios'
import { jwtDecode } from "jwt-decode"

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const form = ref({
  userName: '',
  userEmail: '',
  password: '',
  privacyPolicies: false,
})

const messageinfo = ref('¡Registro exitoso! 🎉 ¡Anímate a innovar con nuestra impresión 3D! 🚀🖨️')
const isSnackbarScrollReverseVisible = ref(false)

const emailRule = value => !!value && /\S+@\S+\.\S+/.test(value) || 'Correo electrónico no válido';
const strongPasswordRule = value => 
  !!value && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) || 
  'La contraseña debe tener al menos 8 caracteres, un número y un carácter especial';
const required = value => !! value || 'Campo requerido'; 
const userExists = async (value) => {
  const exists = await checkIfExists(value);
  return exists ? 'Este usuario ya existe' : true;
};
const noSpecialCharsRule = value => !!value && /^[a-zA-Z0-9]+$/.test(value) || 'El nombre de usuario solo puede contener letras y números';

const checkIfExists = async (value: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/userExists`, {
      userName: value,
      userEmail: value
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.exists
  } catch (error) {
    console.error('checkIfExists: ', error.response?.data?.message || error.message)
    return false
  }
}

const validateForm = async () => {
  if (!form.value.userName || !form.value.userEmail || !form.value.password) {
    console.log('Errores en el formulario');
    return;
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/newUser`, {
      userName: form.value.userName,
      userEmail: form.value.userEmail,
      password: form.value.password,
      userType: 'client',
      userCreatedDate: new Date().toLocaleString(),
      userStatus: true
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.user) {
      const result = jwtDecode(response.data.user);
      if (result.validRegister){
        isSnackbarScrollReverseVisible.value = true
        resetForm()
      }
    } else {
      console.error("El campo 'user' no está presente en la respuesta");
    }
  } catch (error) {
    console.log('validateForm: ', error.response?.data?.message || error.message);
  }
};

const resetForm = () => {
  form.value = {
    userName: null,
    userEmail: null,
    password: null,
    privacyPolicies: false,
  }
}

const isPasswordVisible = ref(false)
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

      <!-- 👉 Auth card -->
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
            La aventura empieza aqui🏗️
          </h4>
          <p class="mb-0">
            Regístrate y empieza a imprimir el futuro con Skynet 3D Systems 
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="validateForm">
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.userName"
                  autofocus
                  label="Usuario"
                  placeholder="juanperez"
                  :rules="[required, noSpecialCharsRule, userExists]"
                />
              </VCol>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.userEmail"
                  label="Email"
                  type="email"
                  placeholder="juanperez@email.com"
                  :rules="[required, emailRule, userExists]"
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

                <div class="d-flex align-center my-6">
                  <VCheckbox
                    id="privacy-policy"
                    v-model="form.privacyPolicies"
                    inline
                  />
                  <VLabel
                    for="privacy-policy"
                    style="opacity: 1;"
                  >
                    <span class="me-1 text-high-emphasis">Estoy de acuerdo con</span>
                    <a
                      href="javascript:void(0)"
                      class="text-primary"
                    >Política de priv. y términos</a>
                  </VLabel>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Registrarse
                </VBtn>
              </VCol>

              <!-- login instead -->
              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>Ya tienes una cuenta?</span>
                <RouterLink
                  class="text-primary ms-1"
                  :to="{ name: 'pages-authentication-login-v1' }"
                >
                  Iniciar sesión en su lugar
                </RouterLink>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4">or</span>
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
