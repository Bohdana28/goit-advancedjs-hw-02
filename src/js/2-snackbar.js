import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
form.addEventListener("submit", onSubmit);

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

}

function onSubmit(event) {
  event.preventDefault();

  const delay = Number(event.target.elements.delay.value);
  const state = event.target.elements.state.value;

  createPromise(delay, state)
    .then((result) => {
      iziToast.success({
        title: "OK",
        message: `✅ Fulfilled promise in ${result}ms`,
        position: "topRight",
      });
    })
    .catch((error) => {
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${error}ms`,
        position: "topRight",
      });

    });

  form.reset();

}