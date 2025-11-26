import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import enHome from "./en/home.json";
import viHome from "./vi/home.json";
import enLogin from "./en/login.json";
import viLogin from "./vi/login.json";
import enHeader from "./en/header.json";
import viHeader from "./vi/header.json";
import enRegister from "./en/register.json";
import viRegister from "./vi/register.json";
import enAdmin from "./en/admin.json";
import viAdmin from "./vi/admin.json";
import enMenu from "./en/menu.json";
import viMenu from "./vi/menu.json";
import enPricing from "./en/pricing.json";
import viPricing from "./vi/pricing.json";
import enSettings from "./en/settings.json";
import viSettings from "./vi/settings.json";
import enTokens from "./en/tokens.json";
import viTokens from "./vi/tokens.json";
import enPayment from "./en/payment.json";
import viPayment from "./vi/payment.json";
import enSidebar from "./en/sidebar.json";
import viSidebar from "./vi/sidebar.json";

const savedLang = localStorage.getItem("lang") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        home: enHome,
        login: enLogin,
        header: enHeader,
        register: enRegister,
        admin: enAdmin,
        menu: enMenu,
        pricing: enPricing,
        settings: enSettings,
        tokens: enTokens,
        payment: enPayment,
        sidebar: enSidebar,
      },
      vi: {
        home: viHome,
        login: viLogin,
        header: viHeader,
        register: viRegister,
        admin: viAdmin,
        menu: viMenu,
        pricing: viPricing,
        settings: viSettings,
        tokens: viTokens,
        payment: viPayment,
        sidebar: viSidebar,
      }
    },
    lng: savedLang,
    fallbackLng: "en",
    ns: [
      "home",
      "login",
      "header",
      "register",
      "admin",
      "menu",
      "pricing",
      "settings",
      "tokens",
      "payment",
      "sidebar"
    ],
    defaultNS: "home",
    interpolation: { escapeValue: false }
  });

export default i18n;
