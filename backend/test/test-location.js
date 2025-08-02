// test-location.js

import { getDefaultSettingsByIp } from "../utils/locationUtils.js";

// --- IPs de prueba ---
// IP de Argentina (Buenos Aires) - debería dar 'es' y 'ARS'
const ipArgentina = '181.169.130.0';
// IP de Brasil (São Paulo) - debería dar 'pt' y 'BRL'
const ipBrazil = '177.105.61.189';
// IP de España (Madrid) - debería dar 'es' y 'EUR'
const ipSpain = '185.15.56.0';
// IP de Estados Unidos (California) - debería dar 'en' y 'USD'
const ipUSA = '204.79.197.200';
// IP de Localhost IPv4
const ipLocalhostIPv4 = '127.0.0.1';
// IP de Localhost IPv6
const ipLocalhostIPv6 = '::1';
// IP desconocida/no mapeable
const ipUnknown = '0.0.0.0';


console.log('--- Probando getDefaultSettingsByIp ---');

let settings;

settings = getDefaultSettingsByIp(ipArgentina);
console.log(`IP: ${ipArgentina} ->`, settings); // Esperado: { language: 'es', currency: 'ARS' }

settings = getDefaultSettingsByIp(ipBrazil);
console.log(`IP: ${ipBrazil} ->`, settings); // Esperado: { language: 'pt', currency: 'BRL' }

settings = getDefaultSettingsByIp(ipSpain);
console.log(`IP: ${ipSpain} ->`, settings); // Esperado: { language: 'es', currency: 'EUR' }

settings = getDefaultSettingsByIp(ipUSA);
console.log(`IP: ${ipUSA} ->`, settings); // Esperado: { language: 'en', currency: 'USD' }

settings = getDefaultSettingsByIp(ipLocalhostIPv4);
console.log(`IP: ${ipLocalhostIPv4} ->`, settings); // Esperado: { language: 'en', currency: 'USD' } (por defecto)

settings = getDefaultSettingsByIp(ipLocalhostIPv6);
console.log(`IP: ${ipLocalhostIPv6} ->`, settings); // Esperado: { language: 'en', currency: 'USD' } (por defecto)

settings = getDefaultSettingsByIp(ipUnknown);
console.log(`IP: ${ipUnknown} ->`, settings); // Esperado: { language: 'en', currency: 'USD' } (por defecto)

settings = getDefaultSettingsByIp(null); // Prueba con null
console.log(`IP: null ->`, settings); // Esperado: { language: 'en', currency: 'USD' } (por defecto)

settings = getDefaultSettingsByIp(''); // Prueba con string vacío
console.log(`IP: '' ->`, settings); // Esperado: { language: 'en', currency: 'USD' } (por defecto)

console.log('--- Fin de pruebas ---');