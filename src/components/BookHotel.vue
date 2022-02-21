<template>
  <div class="hotel">
    <v-select
      :items="hotels"
      outlined
      hide-details
      dark
      class="hotel__select"
      label="Please select the hotel"
      v-model="reservationDetails.hotel_id"
      item-text="hotel_name"
      item-value="id"
    >
    </v-select>
    <div class="hotel__options">
      <div class="hotel__options-item">
        <v-menu
          v-model="entranceDate"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="reservationDetails.start_date"
              label="Entrance Date"
              prepend-icon="mdi-calendar"
              readonly
              outlined
              hide-details
              dark
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="reservationDetails.start_date"
            dark
            @input="entranceDate = false"
            :allowed-dates="allowedDatesIn"
          ></v-date-picker>
        </v-menu>
      </div>
      <div class="hotel__options-item">
        <v-menu
          v-model="exitDate"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="reservationDetails.end_date"
              label="Exit Date"
              prepend-icon="mdi-calendar"
              readonly
              outlined
              hide-details
              dark
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="reservationDetails.end_date"
            dark
            @input="exitDate = false"
            :allowed-dates="allowedDatesOut"
          ></v-date-picker>
        </v-menu>
      </div>
      <div class="hotel__options-item">
        <v-text-field
          v-model="reservationDetails.adult"
          outlined
          hide-details
          dark
          type="number"
          min="0"
          :max="hotelDetail ? hotelDetail.max_adult_size : 0"
          label="Adult Count"
        ></v-text-field>
      </div>
      <div class="hotel__options-item">
        <v-text-field
          v-model="reservationDetails.child"
          outlined
          hide-details
          dark
          type="number"
          min="0"
          max="5"
          label="Child Count"
          :disabled="!child_status"
        ></v-text-field>
        <v-alert
          class="hotel__options-alert"
          type="warning"
          v-if="!child_status"
        >
          Child are not allowed!
        </v-alert>
      </div>
    </div>
    <div class="hotel__options-btn">
      <v-btn class="btn btn__next" @click="checkValidation"
        >Save & Proceed</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import request from "../api-request/request";

export default {
  name: "BookHotel",

  data: () => ({
    max_adult_size: 0,
    modal: false,
    entranceDate: false,
    exitDate: false,
  }),

  computed: {
    ...mapState({
      hotels: (state) => state.hotels,
      reservationDetails: (state) => state.reservationDetails,
    }),

    ...mapGetters(["hotelDetail"]),

    child_status() {
      return this.hotelDetail ? this.hotelDetail.child_status : true;
    },
  },

  methods: {
    checkValidation() {
      if (this.reservationDetails.hotel_id == null) {
        this.$emit("showDialog", { messages: ["Please select a Hotel!"] });
      } else if (
        this.reservationDetails.start_date == null ||
        this.reservationDetails.end_date == null
      ) {
        this.$emit("showDialog", {
          messages: ["Please enter your Entrance & Exit date!"],
        });
      } else if (this.reservationDetails.adult == 0) {
        this.$emit("showDialog", {
          messages: ["Please add Adult guest number!"],
        });
      } else {
        localStorage.setItem(
          "reservationDetails",
          JSON.stringify(this.reservationDetails)
        );
        this.$emit("toStep", 2);
      }
    },

    allowedDatesOut(val) {
      return new Date(val) > new Date(this.reservationDetails.start_date);
    },

    allowedDatesIn(val) {
      return new Date(val) >= Date.now();
    },
  },

  mounted() {
    request
      .getHotels()
      .then((response) => {
        this.$store.dispatch("getHotels", response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    request
      .getHotelDetails()
      .then((response) => {
        this.$store.dispatch("hotelDetails", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
