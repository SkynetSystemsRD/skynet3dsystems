<template>
  <div class="credit-card">
    <div
      class="credit-card__inner"
      :class="{
        'show-back': showBack
      }"
    >
      <card-front
        :backgroundImage="backgroundImage"
        :symbolImage="symbolImage"
        :cardNumber="cardNumber"
        :expireMonth="expireMonth"
        :expireYear="expireYear"
        :name="name"
      />
      <card-back :cvv="cvv" :backgroundImage="backgroundImage" />
    </div>
  </div>
</template>

<script>
import cardBack from './card-back.vue';
import cardFront from './card-front.vue';

export default {
  components: {
    cardFront,
    cardBack
  },
  data() {
    return {
      backgroundImage: this.randomCard()
    };
  },
  methods: {
    randomCard() {
      return `/images/card-${Math.floor(Math.random() * 5) + 1}.jpg`;
    }
  },
  props: {
    cardNumber: String,
    expireMonth: String,
    expireYear: String,
    cvv: String,
    name: String,
    showBack: Boolean,
    symbolImage: String
  }
};
</script>

<style scoped lang="scss">
.credit-card {
  display: inline-block;
  background-color: transparent;
  block-size: 204px;  /* Height of a credit card */
  color: white;
  font-family: "Source Code Pro", monospace;
  inline-size: 323px; /* Width of a credit card */
  max-inline-size: 420px;  /* Ensure it doesn't stretch too far */
  perspective: 1000px;

  &:hover &__inner {
    transform: rotateY(180deg);
  }

  &__inner {
    position: relative;
    block-size: 100%;
    inline-size: 100%;
    text-align: center;
    transform-style: preserve-3d;
    transition: transform 0.6s;
  }

  @media screen and (max-width: 480px) {
    block-size: 170px; /* Adjusted size for smaller screens */
  }

  @media screen and (max-width: 360px) {
    block-size: 150px; /* Adjusted size for very small screens */
  }
}

.show-back {
  transform: rotateY(180deg);

  &:hover {
    transform: rotateY(0deg);
  }
}
</style>
