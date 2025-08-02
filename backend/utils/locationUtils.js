// src/utils/locationUtils.js
import geoip from "geoip-lite";

/**
 * Intenta determinar el idioma y la moneda por defecto basándose en la IP del cliente.
 * Si la IP es localhost o la geolocalización falla, usa valores por defecto.
 * @param {string} clientIp La dirección IP del cliente.
 * @returns {{language: string, currency: string}} Un objeto con el idioma y la moneda sugeridos.
 */
export const getDefaultSettingsByIp = (clientIp) => {
  let defaultLanguage = "en";
  let defaultCurrency = "USD";

  // Excluir IPs de localhost
  if (clientIp && clientIp !== "::1" && clientIp !== "127.0.0.1") {
    const geo = geoip.lookup(clientIp);

    if (geo) {
      const countryCode = geo.country;
      console.log("País determinado por IP:", countryCode);
      
      // Aquí puedes expandir tu lógica para mapear códigos de país a idioma/moneda.
      // Puedes hacer esto más sofisticado con un objeto de mapeo si tienes muchos países.
      switch (countryCode) {
        case "BR": // Brasil
          defaultLanguage = "pt";
          defaultCurrency = "BRL";
          break;
        case "ES": // España
          defaultLanguage = "es";
          defaultCurrency = "EUR"; // O 'EUR' si es para España específicamente
          break;
        case "MX": // México
          defaultLanguage = "es";
          defaultCurrency = "MXN";
          break;
        case "AR": // Argentina
          defaultLanguage = "es";
          defaultCurrency = "ARS";
          break;
        case "CO": // Colombia
          defaultLanguage = "es";
          defaultCurrency = "COP";
          break;
        case "CL": // Chile
          defaultLanguage = "es";
          defaultCurrency = "CLP";
          break;
        // Agrega más casos para otros países de habla hispana/latina o los que necesites
        // Por ejemplo, para otros países de habla hispana que no tienen un caso específico,
        // podrías agruparlos o dejar que caigan en el default.
        default:
          defaultLanguage = "en";
          defaultCurrency = "USD";
          break;
      }
    }
  } else {
    console.log(
      "IP es localhost, usando valores por defecto para idioma/moneda."
    );
  }

  return { language: defaultLanguage, currency: defaultCurrency };
};
