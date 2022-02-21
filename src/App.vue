<template>
  <v-app>
    <div class="container">
      <Header />
      <v-stepper class="steps" v-model="steps" v-if="!finishReservation">
        <v-stepper-header>
          <v-stepper-step class="steps__item" :editable="steps > 0" step="1">
            <v-icon class="steps__item-icon"> mdi-bed-outline </v-icon>
            <span class="steps__item-text">Hotel & Date</span>
          </v-stepper-step>

          <v-divider class="steps__divider"></v-divider>

          <v-stepper-step class="steps__item" :editable="steps > 1" step="2">
            <v-icon class="steps__item-icon"> mdi-room-service </v-icon>
            <span class="steps__item-text">Room & View</span>
          </v-stepper-step>

          <v-divider class="steps__divider"></v-divider>

          <v-stepper-step class="steps__item" :editable="steps > 2" step="3">
            <v-icon class="steps__item-icon"> mdi-credit-card-outline </v-icon>
            <span class="steps__item-text">Payment & Preview</span>
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <BookHotel @showDialog="showDialog" @toStep="changeStep" />
          </v-stepper-content>

          <v-stepper-content class="room__container" step="2">
            <BookRoom @showDialog="showDialog" @toStep="changeStep" />
          </v-stepper-content>

          <v-stepper-content class="checkout__container" step="3">
            <Checkout @showDialog="showDialog" @toStep="changeStep" />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <Preview v-else @showDialog="showDialog" @toStep="changeStep" />
    </div>

    <v-dialog class="dialog" v-model="dialog" width="500">
      <v-card id="dialog__reset" :class="{ 'dialog-success': dialogSuccess }">
        <div class="dialog-header d-flex justify-center py-3 mb-8">
          <h2 class="dialog-header-title">UYARI</h2>
        </div>
        <v-card-text>
          <p class="dialog-text" v-for="(message, i) in dialogMessage" :key="i">
            <v-icon
              class="dialog-icons mr-2"
              :color="dialogSuccess ? 'success' : 'error'"
              >{{
                dialogSuccess
                  ? "mdi-checkbox-marked-circle-outline"
                  : "mdi-alert-circle-outline"
              }}</v-icon
            >{{ message }}
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <div class="d-flex justify-end pa-4">
          <v-btn class="pa-3" color="secondary" @click="dialog = false"
            >Got it</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import BookHotel from "./components/BookHotel";
import BookRoom from "./components/BookRoom";
import Checkout from "./components/Checkout";
import Preview from "./components/Preview";
import { mapState } from "vuex";

export default {
  name: "App",

  components: {
    Header,
    BookHotel,
    BookRoom,
    Checkout,
    Preview,
  },

  data: () => ({
    steps: 1,
    dialog: false,
    dialogMessage: [],
    dialogSuccess: false,
  }),

  methods: {
    changeStep(step) {
      this.steps = step;
    },

    showDialog(payload) {
      this.dialogMessage = payload.messages;
      this.dialogSuccess = payload.dialogState ? payload.dialogState : false;
      this.dialog = true;
    },
  },

  computed: {
    ...mapState(["finishReservation"]),
  },

  watch: {
    steps(n) {
      localStorage.setItem("step", n);
    },
  },

  created() {
    let defaultData = {
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
    };
    let storagedData = localStorage.getItem("reservationDetails");
    if (storagedData) {
      defaultData = JSON.parse(storagedData);
    }
    this.$store.dispatch("setForms", defaultData);
    let storagedStep = localStorage.getItem("step");
    if (storagedStep) {
      this.steps = Number(storagedStep);
    }
  },
};
</script>

<style lang="scss">
@import "./styles/app.scss";
</style>
