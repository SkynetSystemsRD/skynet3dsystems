<template>
  <div class="card-front">
    <img class="card-front__image" :src="backgroundImage" />
    <img class="card-front__symbol" :src="symbolImage" />
    <img class="card-front__chip" :src="'/images/chip.png'" />
    <p class="card-front__number value">{{ cardNumber }}</p>
    <div class="card-front__info">
      <p>Expira</p>
      <p class="card-front__expires value">
        {{ expireMonth || "MM" }} /
        {{ (expireYear && sliceYear) || "YY" }}
      </p>
    </div>
    <div class="card-front__info left">
      <p>Nombre Propietario</p>
      <p class="value">{{ name || "nombre" }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    backgroundImage: String,
    symbolImage: String,
    cardNumber: String,
    expireMonth: String,
    expireYear: String,
    name: String
  },
  computed: {
    sliceYear() {
      return this.expireYear.toString().slice(2);
    }
  }
};
</script>

<style scoped lang="scss">
$x-space: 24px;
$y-space: 16px;

.card-front {
  position: absolute;
  z-index: 100;
  backface-visibility: hidden;
  block-size: 100%;
  inline-size: 100%;

  &__image {
    border-radius: 16px;
    block-size: 100%;
    inline-size: 100%;
  }

  &__number {
    position: absolute;
    font-size: 26px;
    inset-block-start: 35%;
    inset-inline-start: x-space;
  }

  &__chip {
    position: absolute;
    block-size: 44px;
    inset-block-start: $y-space;
    inset-inline-start: $x-space;
  }

  &__symbol {
    position: absolute;
    block-size: 48px;
    inset-block-start: $y-space;
    inset-inline-end: $x-space;
  }

  &__info {
    position: absolute;
    margin: 0;
    color: white;
    inset-block-end: $y-space;
    inset-inline-end: $x-space;
    text-align: start;

    &.left {
      inset-inline-start: $x-space;
    }

    .value {
      font-weight: bold;
    }

    p {
      margin: 0;
    }
  }

  &__expires {
    inset-inline: $x-space auto;
  }

  @media screen and (max-width: 480px) {
    &__number {
      font-size: 22px;
    }

    &__info {
      font-size: 12px;
    }

    &__chip {
      block-size: 34px;
    }

    &__symbol {
      block-size: 38px;
    }
  }

  @media screen and (max-width: 360px) {
    &__number {
      font-size: 18px;
    }
  }
}
</style>
