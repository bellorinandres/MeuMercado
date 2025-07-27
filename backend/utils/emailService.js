export const sendRecoveryEmail = async (name, to, link) => {
  console.log(`🟢 Simulando envío de correo a: ${to}`);
  console.log(`Hola ${name}, usa este link para recuperar tu contraseña:`);
  console.log(link);
};
