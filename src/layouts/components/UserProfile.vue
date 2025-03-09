<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const router = useRouter()
const ability = useAbility()

// TODO: Get type from backend
const storedData = localStorage.getItem('userData');
const userData = storedData ? JSON.parse(storedData) : null;

const logout = async () => {
  // Remove "accessToken" from cookie
  useCookie('accessToken').value = null;

  // Remove "userData" from localStorage
  localStorage.removeItem('userData');

  // Redirect to login page
  await router.push('/pages/authentication/login-v1');

  // Reset ability to initial ability
  ability.update([]);
};

const userProfileList = [
  { type: 'divider' },
  { type: 'navItem', icon: 'tabler-user', title: 'Perfil', to: { name: 'apps-user-view-id', params: { id: userData.id } } },
  { type: 'navItem', icon: 'tabler-settings', title: 'configuracion', to: { name: 'pages-account-settings-tab', params: { tab: 'account' } } },
  { type: 'divider' },
  { type: 'navItem', icon: 'tabler-book-2', title: 'Mis Projectos', to: { name: 'pages-pricing' } },
  // { type: 'navItem', icon: 'tabler-question-mark', title: 'FAQ', to: { name: 'pages-faq' } },
]
</script>

<template>
  <VBadge v-if="userData" dot bordered location="bottom right" offset-x="1" offset-y="2" color="success">
    <VAvatar size="38" class="cursor-pointer" :color="!(userData && userData.avatar) ? 'primary' : undefined"
      :variant="!(userData && userData.avatar) ? 'tonal' : undefined">
      <VImg v-if="userData && userData.avatar" :src="userData.avatar" />
      <VIcon v-else icon="tabler-user" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="240" location="bottom end" offset="12px">
        <VList>
          <VListItem>
            <div class="d-flex gap-2 align-center">
              <VListItemAction>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
                  <VAvatar :color="!(userData && userData.avatar) ? 'primary' : undefined"
                    :variant="!(userData && userData.avatar) ? 'tonal' : undefined">
                    <VImg v-if="userData && userData.avatar" :src="userData.avatar" />
                    <VIcon v-else icon="tabler-user" />
                    <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
                      <VAvatar :color="!(userData && userData.avatar) ? 'primary' : undefined"
                        :variant="!(userData && userData.avatar) ? 'tonal' : undefined">
                        <VImg v-if="userData && userData.avatar" :src="userData.avatar" />
                        <VIcon v-else icon="tabler-user" />
                      </VAvatar>
                    </VBadge>
              </VListItemAction>

              <div>
                <h6 class="text-h6 font-weight-medium">
                  {{ userData.userName }}
                </h6>
                <VListItemSubtitle class="text-capitalize text-disabled">
                  {{ userData.userType }}
                </VListItemSubtitle>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template v-for="item in userProfileList" :key="item.title">
              <VListItem v-if="item.type === 'navItem'" :to="item.to">
                <template #prepend>
                  <VIcon :icon="item.icon" size="22" />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template v-if="item.badgeProps" #append>
                  <VBadge rounded="sm" class="me-3" v-bind="item.badgeProps" />
                </template>
              </VListItem>

              <VDivider v-else class="my-2" />
            </template>

            <div class="px-4 py-2">
              <VBtn block size="small" color="error" append-icon="tabler-logout" @click="logout">
                Logout
                <VBtn block size="small" color="error" append-icon="tabler-logout" @click="logout">
                  Cerrar Sección
                </VBtn>
            </div>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
