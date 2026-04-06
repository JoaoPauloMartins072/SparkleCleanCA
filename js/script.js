/**
 * SparkleClean — Client-side form validation
 * -----------------------------------------
 * This script runs on the contact page only. It intercepts form submission,
 * validates fields with custom rules (no HTML5 pattern alone), shows inline
 * errors, and displays a success message when everything passes — without
 * sending data to a server, as required for a static site assignment.
 */

(function () {
  "use strict";

  /**
   * Waits for DOM so elements exist before attaching listeners.
   * Why: Script is loaded at end of body, but defensive check avoids errors
   * if the file is ever included elsewhere.
   */
  document.addEventListener("DOMContentLoaded", initContactForm);

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (validateForm()) {
        showSuccessMessage();
        form.reset();
        clearAllErrors();
      }
    });
  }

  /**
   * Validates all fields and updates the UI with errors or clears them.
   * @returns {boolean} true if every rule passes
   */
  function validateForm() {
    var nameInput = document.getElementById("field-name");
    var phoneInput = document.getElementById("field-phone");
    var emailInput = document.getElementById("field-email");
    var messageInput = document.getElementById("field-message");

    var successBanner = document.getElementById("form-success");
    if (successBanner) {
      successBanner.classList.remove("visible");
    }

    clearAllErrors();

    var valid = true;

    // Name: required; letters and spaces only (no digits or symbols)
    if (!isNonEmpty(nameInput.value)) {
      setFieldError("name", "Please enter your name.");
      valid = false;
    } else if (!isLettersAndSpacesOnly(nameInput.value)) {
      setFieldError(
        "name",
        "Name may only contain letters and spaces (no numbers or symbols)."
      );
      valid = false;
    }

    // Phone: required; digits only; length 9 or 10
    if (!isNonEmpty(phoneInput.value)) {
      setFieldError("phone", "Please enter your phone number.");
      valid = false;
    } else if (!isValidPhone(phoneInput.value)) {
      setFieldError(
        "phone",
        "Phone must contain only digits and be 9 or 10 digits long."
      );
      valid = false;
    }

    // Email: required (basic non-empty check per assignment "all fields required")
    if (!isNonEmpty(emailInput.value)) {
      setFieldError("email", "Please enter your email address.");
      valid = false;
    } else if (!isReasonableEmail(emailInput.value)) {
      setFieldError("email", "Please enter a valid email address.");
      valid = false;
    }

    // Message: required
    if (!isNonEmpty(messageInput.value)) {
      setFieldError("message", "Please enter a message.");
      valid = false;
    }

    return valid;
  }

  /**
   * Trims and checks for content — empty or whitespace-only fails.
   */
  function isNonEmpty(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  /**
   * Name rule: letters (A–Z, a–z) and spaces only — no digits or punctuation.
   * Pattern: one or more words made of letters, separated by single spaces.
   */
  function isLettersAndSpacesOnly(value) {
    var trimmed = value.trim();
    if (trimmed.length === 0) {
      return false;
    }
    return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmed);
  }

  /**
   * Phone: ONLY digit characters, 9 or 10 digits (no spaces or dashes).
   */
  function isValidPhone(value) {
    return /^\d{9,10}$/.test(value);
  }

  /**
   * Minimal email shape check — not a full RFC parser, but catches obvious mistakes.
   */
  function isReasonableEmail(value) {
    var v = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  /**
   * Shows error message under the named field and adds error styling.
   */
  function setFieldError(fieldName, message) {
    var group = document.querySelector(
      '.form-group[data-field="' + fieldName + '"]'
    );
    if (!group) {
      return;
    }
    group.classList.add("has-error");
    var err = group.querySelector(".field-error");
    if (err) {
      err.textContent = message;
      err.classList.add("visible");
    }
  }

  /**
   * Clears all error states before re-validation or after success.
   */
  function clearAllErrors() {
    var groups = document.querySelectorAll(".form-group.has-error");
    for (var i = 0; i < groups.length; i++) {
      groups[i].classList.remove("has-error");
      var err = groups[i].querySelector(".field-error");
      if (err) {
        err.classList.remove("visible");
        err.textContent = "";
      }
    }
  }

  /**
   * Shows the green success banner — simulates successful submission locally.
   */
  function showSuccessMessage() {
    var el = document.getElementById("form-success");
    if (el) {
      el.classList.add("visible");
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
})();
