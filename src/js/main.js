// script.js - Stripe & Livestream UI Logic

document.addEventListener("DOMContentLoaded", function () {
  const amountInput = document.getElementById("donation-amount");
  const amountDisplay = document.getElementById("amount-display");
  const donateButton = document.getElementById("donate-button");

  if (amountInput && amountDisplay) {
    amountInput.addEventListener("input", (e) => {
      amountDisplay.textContent = e.target.value || "0";
    });
  }

  if (typeof Stripe !== "undefined") {
    const stripe = Stripe("pk_live_your_key_here");
    const elements = stripe.elements();

    const style = {
      base: {
        color: "#32325d",
        fontFamily: '"Segoe UI", sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };

    const card = elements.create("card", { style });
    card.mount("#card-element");

    card.addEventListener("change", function (event) {
      const errorDisplay = document.getElementById("card-errors");
      if (event.error) {
        errorDisplay.textContent = event.error.message;
      } else {
        errorDisplay.textContent = "";
      }
    });

    const form = document.getElementById("donation-form");

    if (form) {
      form.addEventListener("submit", async function (event) {
        event.preventDefault();
        donateButton.disabled = true;
        donateButton.textContent = "Processing...";

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: card,
          billing_details: {
            name: document.getElementById("name")?.value || "Anonymous",
            email: document.getElementById("email")?.value || ""
          }
        });

        if (error) {
          document.getElementById("card-errors").textContent = error.message;
          donateButton.disabled = false;
          donateButton.textContent = `Donate $${amountInput.value}`;
        } else {
          const response = await fetch("/process-donation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              payment_method_id: paymentMethod.id,
              amount: parseInt(amountInput.value) * 100,
              currency: "usd"
            })
          });

          const paymentIntent = await response.json();

          if (paymentIntent.error) {
            showError(paymentIntent.error);
          } else if (paymentIntent.requires_action) {
            const result = await stripe.handleCardAction(paymentIntent.client_secret);
            if (result.error) {
              showError(result.error);
            } else {
              confirmPayment(paymentIntent.id);
            }
          } else {
            window.location.href = "/thank-you";
          }
        }
      });
    }

    function showError(error) {
      document.getElementById("card-errors").textContent = error.message;
      donateButton.disabled = false;
      donateButton.textContent = `Donate $${amountInput.value}`;
    }
  }

  // Display Bible verse via YouVersion API (mocked)
  fetch("https://labs.bible.org/api/?passage=random&type=json")
    .then(res => res.json())
    .then(data => {
      if (data && data[0]) {
        document.querySelector(".bible-verse").textContent =
          `"${data[0].text}" — ${data[0].bookname} ${data[0].chapter}:${data[0].verse}`;
      }
    })
    .catch(() => {
      document.querySelector(".bible-verse").textContent =
        "“The grass withers and the flowers fall, but the word of our God endures forever.” — Isaiah 40:8";
    });
});
