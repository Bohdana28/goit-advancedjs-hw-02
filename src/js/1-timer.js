import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateInputField = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: validateDate,
};

flatpickr(dateInputField, options);

const timer = {
  deadline: null,
  intervalId: null,
  refs: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },

  start() {
    this.deadline = userSelectedDate;
    this.disableUI();
    this.intervalId = setInterval(this.updateTimer.bind(this), 1000);
  },

  stop() {
    clearInterval(this.intervalId);
    dateInputField.disabled = false;
  },

  updateTimer() {
    const diff = this.deadline - Date.now();
    if (diff <= 0) {
      this.stop();
      this.resetTimerDisplay();
      return;
    }

    const { days, hours, minutes, seconds } = this.convertMs(diff);
    this.updateTimerDisplay(days, hours, minutes, seconds);
  },

  updateTimerDisplay(days, hours, minutes, seconds) {
    this.refs.days.textContent = this.pad(days);
    this.refs.hours.textContent = this.pad(hours);
    this.refs.minutes.textContent = this.pad(minutes);
    this.refs.seconds.textContent = this.pad(seconds);
  },

  resetTimerDisplay() {
    this.refs.days.textContent = '00';
    this.refs.hours.textContent = '00';
    this.refs.minutes.textContent = '00';
    this.refs.seconds.textContent = '00';
  },

  disableUI() {
    startBtn.disabled = true;
    dateInputField.disabled = true;
  },

  convertMs(ms) {
    const units = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
    };

    const days = Math.floor(ms / units.day);
    const hours = Math.floor((ms % units.day) / units.hour);
    const minutes = Math.floor(((ms % units.day) % units.hour) / units.minute);
    const seconds = Math.floor((((ms % units.day) % units.hour) % units.minute) / units.second);

    return { days, hours, minutes, seconds };
  },

  pad(value) {
    return String(value).padStart(2, '0');
  },
};

function validateDate(selectedDates) {
  const selectedDateMs = selectedDates[0].getTime();
  if (selectedDateMs <= Date.now()) {
    iziToast.error({
      title: '',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
  } else {
    startBtn.disabled = false;
    userSelectedDate = selectedDateMs;
  }
}

startBtn.addEventListener('click', () => {
  timer.start();
});