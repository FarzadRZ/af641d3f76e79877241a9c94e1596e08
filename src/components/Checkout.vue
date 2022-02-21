<template>
  <div class="checkout">
    <div class="checkout__main">
      <PayCard></PayCard>
      <div class="checkout__hotel">
        <h2 class="checkout__hotel-name">
          {{ hotelName }}
          <span> ({{ cityName }}) </span>
        </h2>
        <div class="checkout__hotel-details">
          <div class="checkout__hotel-box">
            <b> Entrance Date:</b>
            <span>{{ reservationDetails.start_date }}</span>
          </div>
          <div class="checkout__hotel-box">
            <b>Exit Date:</b>
            <span>{{ reservationDetails.end_date }}</span>
          </div>
          <div class="checkout__hotel-box">
            <b>Adults: </b>
            <span>{{ reservationDetails.adult }}</span>
          </div>
          <div class="checkout__hotel-box">
            <b>Child: </b>
            <span>{{ reservationDetails.child }}</span>
          </div>
          <div class="checkout__hotel-box">
            <b>Room Detail: </b>
            <span>{{ roomTitle }}</span>
          </div>
          <div class="checkout__hotel-box">
            <b>View Detail: </b>
            <span>{{ scenicTitle }}</span>
          </div>
        </div>
        <div class="checkout__hotel-coupon">
          <v-text-field
            outlined
            hide-details
            dark
            class="checkout__coupon"
            label="Coupon Code"
            v-model="userCoupon"
          ></v-text-field>
          <v-btn class="btn btn__coupon" @click="getCoupon"> Use Code </v-btn>
        </div>
        <div class="checkout__hotel-details">
          <div class="checkout__hotel-box">
            <b>Room Price:</b>
            <span>{{ $helpers.formatCurrency(roomUnitPrice) }}</span>
          </div>
          <div class="checkout__hotel-box">
            <b>Price Impact Ratio:</b>
            <span>%{{ rate }} </span>
          </div>
          <div class="checkout__hotel-box">
            <b>Guesting ({{ days }} Day):</b>
            <span>{{ $helpers.formatCurrency(roomPriceWithDays) }}</span>
          </div>
          <div class="checkout__hotel-box" v-if="coupon">
            <b>Discount ({{ coupon.code }}):</b>
            <span>-{{ $helpers.formatCurrency(coupon.discount_ammount) }}</span>
          </div>
          <div class="checkout__hotel-box">
            <b>Toatal Amount:</b>
            <b> {{ $helpers.formatCurrency(reservationDetails.price) }} </b>
          </div>
        </div>
      </div>
    </div>
    <div class="checkout__btn">
      <v-btn class="btn btn__prev" elevation="2" @click="$emit('toStep', 2)">
        Go Back</v-btn
      >
      <v-btn class="btn btn__next" elevation="2" @click="submit"
        >Pay & Book</v-btn
      >
    </div>
  </div>
</template>

<script>
import PayCard from "./PayCard";
import { mapGetters, mapState } from "vuex";
import request from "../api-request/request";

export default {
  components: {
    PayCard,
  },

  data: () => ({
    userCoupon: "",
  }),

  computed: {
    ...mapGetters([
      "hotelName",
      "cityName",
      "roomTypes",
      "roomScenics",
      "days",
      "roomTitle",
      "scenicTitle",
      "roomUnitPrice",
      "rate",
      "roomPriceWithDays",
    ]),
    ...mapState(["reservationDetails", "coupon", "reservedId", "isUpdate"]),
  },

  methods: {
    submit() {
      let details = this.$store.state.reservationDetails;
      let messages = [];
      for (let detail in details) {
        if (!details[detail]) {
          switch (detail) {
            case "card_number":
              messages.unshift("Please enter account number!");
              break;
            case "card_name":
              messages.push("Please enter your account name & surname!");
              break;
            case "card_date_month" || "card_date_year":
              messages.push("Please enter your account month/year!");
              break;
            case "card_cvv":
              messages.push("Please enter your CVV number!");
              break;
            default:
              break;
          }
        }
      }

      if (details.card_number && details.card_number.length !== 13) {
        messages.unshift("Please enter a valid account number!");
      }

      if (messages.length === 0) {
        localStorage.setItem(
          "reservationDetails",
          JSON.stringify(this.reservationDetails)
        );
        if (this.isUpdate) {
          request
            .updateReservation(this.reservationDetails, this.reservedId)
            .then((response) => {
              this.$store.commit("reservedId", parseInt(response.data.id));
              this.$store.commit("finishReservation", true);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          request
            .submitReservation(this.reservationDetails)
            .then((response) => {
              this.$store.commit("reservedId", parseInt(response.data.id));
              this.$store.commit("finishReservation", true);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        this.$emit("showDialog", { messages: messages });
      }
    },

    getCoupon() {
      if (this.userCoupon == "") {
        this.$emit("showDialog", {
          messages: ["Please enter coupon number"],
        });
      } else if (this.coupon) {
        this.$emit("showDialog", {
          messages: ["This Coupon is already used!"],
        });
      } else {
        request
          .getCoupons(this.userCoupon)
          .then((response) => {
            if (response.data.length == 0) {
              this.$emit("showDialog", {
                messages: [
                  "This Code is not found! Please check your Coupon Code again!",
                ],
              });
            } else {
              const validCoupon = response.data.filter((coupon) => {
                return new Date(coupon.expiration_at) > Date.now();
              });
              if (validCoupon.length > 0) {
                const priceAfterCoupon =
                  this.reservationDetails.price -
                  validCoupon[0].discount_ammount;
                this.$store.commit("reservationDetails", {
                  price: priceAfterCoupon,
                  coupon_code: validCoupon[0].code,
                });
                this.$store.commit("coupon", validCoupon[0]);
              } else {
                this.$emit("showDialog", {
                  messages: ["This coupon code promotion is finished!"],
                });
              }
            }
          })
          .catch(() => {
            this.$emit("showDialog", {
              messages: ["Something went wrong please try again later!"],
            });
          });
      }
    },
  },
};
</script>
