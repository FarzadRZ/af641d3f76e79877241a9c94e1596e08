<template>
  <div class="preview">
    <div class="preview__main">
      <div class="preview__header">
        <v-icon class="preview__header-icon"> mdi-check-all </v-icon>
        <h3 class="preview__header-title">your reservation is received</h3>
        <p class="preview__header-content">
          Reservation summury details are below, if you want to change or <br />
          create a new reservation please use these links below.
        </p>
        <div class="preview__header-btns">
          <v-btn class="btn btn__next" @click="newReservation"
            >Create New Reservation</v-btn
          >
          <v-btn class="btn btn__next" @click="updateReservation"
            >Update Reservation</v-btn
          >
          <v-btn class="btn btn__prev" @click="dialog = true"
            >Cancel Reservation</v-btn
          >
        </div>
      </div>
      <div class="preview__details">
        <h3 class="preview__details-title">
          {{ hotelName }}
          <span>({{ cityName }})</span>
        </h3>
        <div class="preview__details-box">
          <div class="preview__details-item">
            <b> Entrance Date:</b> <br />
            <span>{{ reservationDetails.start_date }}</span>
          </div>
          <div class="preview__details-item">
            <b>Exit Date:</b> <br />
            <span>{{ reservationDetails.end_date }}</span>
          </div>
          <div class="preview__details-item">
            <b>Adults: </b> <br />
            <span>{{ reservationDetails.adult }}</span>
          </div>
          <div class="preview__details-item">
            <b>Child: </b> <br />
            <span>{{ reservationDetails.child }}</span>
          </div>
          <div class="preview__details-item">
            <b>Room Detail: </b> <br />
            <span>{{ roomTitle }}</span>
          </div>
          <div class="preview__details-item">
            <b>View Detail: </b> <br />
            <span>{{ scenicTitle }}</span>
          </div>
        </div>
        <div class="preview__details-price">
          <div class="d-flex justify-space-between">
            <b>Room Price:</b>
            <span>{{ $helpers.formatCurrency(roomUnitPrice) }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <b>Price Impact Ratio:</b>
            <span>%{{ rate }} </span>
          </div>
          <div class="d-flex justify-space-between">
            <b>Guesting ({{ days }} Day):</b>
            <span>{{ $helpers.formatCurrency(roomPriceWithDays) }}</span>
          </div>
          <div class="d-flex justify-space-between" v-if="coupon">
            <b>Discount ({{ coupon.code }}):</b>
            <span>-{{ $helpers.formatCurrency(coupon.discount_ammount) }}</span>
          </div>
          <div class="total-price d-flex justify-space-between">
            <b>Toatal Amount</b>
            <b> {{ $helpers.formatCurrency(reservationDetails.price) }}</b>
          </div>
        </div>
      </div>
    </div>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card class="d-flex flex-column justify-center pa-12">
        Are you sure you want to cancel reservation?
        <div class="d-flex justify-space-between mt-4">
          <v-btn color="success" @click="deleteReservation">Yes</v-btn>
          <v-btn color="secondary" @click="dialog = false">No</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import request from "../api-request/request";

export default {
  name: "Preview",

  data() {
    return {
      dialog: false,
    };
  },

  computed: {
    ...mapGetters([
      "hotelName",
      "cityName",
      "roomTypes",
      "roomScenics",
      "cityName",
      "roomTitle",
      "scenicTitle",
      "roomUnitPrice",
      "rate",
      "days",
      "roomPriceWithDays",
    ]),
    ...mapState(["coupon", "reservationDetails", "reservedId"]),
  },

  methods: {
    //clear the local storage and go back to start
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
      this.$emit("toStep", 1);
    },

    updateReservation() {
      this.$store.commit("finishReservation", false);
      this.$store.commit("isUpdate", true);
      this.$emit("toStep", 1);
    },

    deleteReservation() {
      request.deleteReservation(this.reservedId).then(() => {
        this.$emit("showDialog", {
          messages: ["Reservation Canceled!"],
        });
        this.newReservation();
      });
    },
  },
};
</script>
