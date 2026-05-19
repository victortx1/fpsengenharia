"use strict";

/* FPS Engenharia — Proteção básica anti-spam / anti-injeção */

(function () {
  const FPS_SECURITY = {
    maxTextLength: 500,
    minSubmitDelay: 1200,
    blockedWords: [
      "<script",
      "</script",
      "javascript:",
      "onerror=",
      "onclick=",
      "onload=",
      "iframe",
      "document.cookie",
      "localStorage",
      "eval(",
      "fetch(",
      "XMLHttpRequest"
    ]
  };

  let lastSubmitTime = 0;

  function sanitizeText(value) {
    return String(value || "")
      .trim()
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .slice(0, FPS_SECURITY.maxTextLength);
  }

  function hasDangerousContent(value) {
    const text = String(value || "").toLowerCase();
    return FPS_SECURITY.blockedWords.some(word => text.includes(word.toLowerCase()));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  function isValidPhone(phone) {
    return String(phone || "").replace(/\D/g, "").length >= 10;
  }

  function canSubmitNow() {
    const now = Date.now();

    if (now - lastSubmitTime < FPS_SECURITY.minSubmitDelay) {
      return false;
    }

    lastSubmitTime = now;
    return true;
  }

  function protectForms() {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
      form.addEventListener("submit", function (event) {
        if (!canSubmitNow()) {
          event.preventDefault();
          alert("Aguarde um instante antes de enviar novamente.");
          return;
        }

        const inputs = form.querySelectorAll("input, textarea");

        for (const input of inputs) {
          const value = input.value;

          if (hasDangerousContent(value)) {
            event.preventDefault();
            alert("Mensagem bloqueada por segurança. Remova códigos ou caracteres suspeitos.");
            return;
          }

          if (input.type === "email" && value && !isValidEmail(value)) {
            event.preventDefault();
            alert("Digite um e-mail válido.");
            return;
          }

          if (
            input.name &&
            input.name.toLowerCase().includes("telefone") &&
            value &&
            !isValidPhone(value)
          ) {
            event.preventDefault();
            alert("Digite um telefone válido com DDD.");
            return;
          }

          input.value = sanitizeText(value);
        }
      });
    });
  }

  function blockConsoleTricks() {
    Object.defineProperty(window, "FPS_SECURITY_ACTIVE", {
      value: true,
      writable: false,
      configurable: false
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    protectForms();
    blockConsoleTricks();
  });

  window.FPSSecurity = {
    sanitizeText,
    isValidEmail,
    isValidPhone,
    hasDangerousContent
  };
})();