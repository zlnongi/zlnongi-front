<template>
  <div>userList</div>
  {{ $store.state.userData }}
  <div class="profile-container d-flex gap-2 flex-wrap">
    <div
      v-for="(item, i) in $store.state.userData"
      :key="i"
      class="gap-2 border rounded p-3 mb-3"
    >
      <!-- 얘가 뷰에서 쓰는 for문 반복 -> userData 0 1 2 돌린다 -->

      <div class="avata">
        <img :src="item.image" alt="" />
      </div>

      <div>
        <h5 class="mb-0">{{ item.userid }}</h5>
        <p class="mb-0">{{ item.username }}</p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.profile {
  flex-basis: 200px; /* 각 프로필의 기본 너비 설정 */
  .avata {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
