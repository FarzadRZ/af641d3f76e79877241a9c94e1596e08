<template>
  <header class="header">
    <div class="header__title">
      <div class="header__logo">
        <img src="../assets/icons/red-reception-icon.png" alt="Hotel logo" />
      </div>
      <h1 class="header__text">Hotel Reservation</h1>
    </div>
    <button @click="newReservation" class="btn btn__add">Book New Place</button>
  </header>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Header",

  computed: {
    ...mapState([, "reservationDetails", "reservedId"]),
  },

  methods: {
    // cleare the local storage and go back to start
    newReservation() {
      localStorage.removeItem("reservationDetails");
      localStorage.removeItem("step");
      this.$store.dispatch("setForms", {
        hotel_id: null,
        start_date: null,
        end_date: null,
        adult: 0,
        child: 0,
        room_type: null,
        room_scenic: null,
        card_name: "",
        card_number: "",
        card_date_month: "",
        card_date_year: "",
        card_cvv: "",
        price: 0,
        coupon_code: "",
      });
      this.$store.commit("finishReservation", false);
      this.$store.commit("isUpdate", false);
      this.$store.commit("reservedId", null);
      window.location.href = "/";
    },
  },
};
</script>