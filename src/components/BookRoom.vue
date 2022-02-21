<template>
  <div class="room">
    <div class="room__checkin">
      <h3 class="room__checkin-title">
        {{ hotelName }}
        <small>( {{ cityName }} )</small>
      </h3>
      <div class="room__checkin-info">
        <span> <b>Entrance Date:</b> {{ reservationDetails.start_date }} </span>
        <span> <b>Exit Date:</b> {{ reservationDetails.end_date }} </span>
        <span> <b>Adult:</b> {{ reservationDetails.adult }} </span>
        <span> <b>Child:</b> {{ reservationDetails.child }} </span>
      </div>
    </div>
    <div class="room__detail-title">Select Room:</div>
    <div class="room__detail-container">
      <label v-for="type in roomTypes" :key="type.id" class="room__card">
        <div class="room__card-title">
          <h4>{{ type.title }}</h4>
          <div class="room__card-checkbox">
            <input
              type="radio"
              name="roomType"
              v-model="reservationDetails.room_type"
              :value="type.id"
            />
            <span class="checkmark"></span>
          </div>
        </div>
        <figure>
          <div class="room__card-image">
            <img :src="type.photo" :alt="type.title" />
          </div>
          <figcaption class="room__card-detail">
            <p>
              <span>{{ days }} Day</span>
              <span>{{ reservationDetails.adult }} Adult</span>
            </p>
            <strong>{{
              $helpers.formatCurrency(getRoomTypePrice(type.price))
            }}</strong>
          </figcaption>
        </figure>
      </label>
    </div>
    <div class="room__detail-title">Select View:</div>
    <div class="room__detail-container">
      <label v-for="type in roomScenics" :key="type.id" class="room__card">
        <div class="room__card-title">
          <h4>{{ type.title }}</h4>
          <div class="room__card-checkbox">
            <input
              type="radio"
              name="roomScenic"
              v-model="reservationDetails.room_scenic"
              :value="type.id"
            />
            <span class="checkmark"></span>
          </div>
        </div>
        <figure>
          <div class="room__card-image">
            <img :src="type.photo" :alt="type.title" />
          </div>
          <figcaption class="room__card-detail">
            <p>
              <span>Price Average</span>
            </p>
            <strong>+{{ type.price_rate }}%</strong>
          </figcaption>
        </figure>
      </label>
    </div>
    <div class="room__btn d-flex justify-space-between">
      <v-btn class="btn btn__prev" elevation="2" @click="$emit('toStep', 1)"
        >Go Back</v-btn
      >
      <v-btn class="btn btn__next" elevation="2" @click="roomValidation"
        >Save & Proceed</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "BookRoom",

  computed: {
    ...mapGetters([
      "hotelName",
      "cityName",
      "roomTypes",
      "roomScenics",
      "days",
      "roomPriceWithDays",
      "rate",
      "roomPriceWithScenic",
    ]),
    ...mapState(["reservationDetails"]),
  },

  methods: {
    getRoomTypePrice(typePrice) {
      return typePrice * this.days * this.reservationDetails.adult;
    },

    roomValidation() {
      if (
        this.reservationDetails.room_type != null &&
        this.reservationDetails.room_scenic != null
      ) {
        let details = {
          room_type: this.reservationDetails.room_type,
          room_scenic: this.reservationDetails.room_scenic,
          price: this.roomPriceWithScenic,
        };
        this.$store.commit("reservationDetails", details);
        localStorage.setItem(
          "reservationDetails",
          JSON.stringify(this.reservationDetails)
        );
        this.$emit("toStep", 3);
      } else {
        this.$emit("showDialog", {
          messages: [
            !this.reservationDetails.room_type
              ? "Please choose a room!"
              : !this.reservationDetails.room_scenic
              ? "Please choose a view!"
              : "",
          ],
        });
      }
    },
  },
};
</script>
