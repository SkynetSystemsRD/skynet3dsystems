<template>
  <div class="card-back">
     <img class="card-back__image" :src="backgroundImage" />
     <div class="card-back__stripe"></div>
     <div class="card-back__cvv">
       {{ cvv }}
     </div>
   </div>
 </template>
 
 <script>
 export default {
   props: {
     cvv: String,
     backgroundImage: String
   }
 };
 </script>
 
 <style scoped lang="scss">
  .card-back {
    position: absolute;
    z-index: 100;
    backface-visibility: hidden;
    block-size: 100%;
    inline-size: 100%;
    transform: rotateY(180deg);

    &__image {
      border-radius: 16px;
      block-size: 100%;
      inline-size: 100%;
    }

    &__stripe {
      position: relative;
      padding: 24px;
      background-color: black;
      inline-size: 100%;
      inset-block-end: 90%;
      opacity: 0.8;
    }

    &__cvv {
      position: absolute;
      padding: 8px;
      border-radius: 4px;
      background-color: white;
      color: black;
      font-size: 22px;
      inline-size: 92%;
      inset-block-end: 35%;
      inset-inline-start: 50%;
      min-block-size: 45px;
      text-align: end;
      transform: translateX(-50%);
    }

    @media screen and (max-width: 360px) {
      &__stripe {
        padding: 18px;
      }

      &__cvv {
        padding: 4px;
        min-block-size: 36px;
      }
    }
  }
 </style>
