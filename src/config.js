global.SALT_KEY = 'k90o08h6-90909-esd45-5454-0090909099898ej';
global.EMAIL_TMPL = 'Olá, <strong>{0}</strong>, seja bem vindo à plataforma IOT E-Cattle!';

module.exports = {

    db: {
        production: "mongodb://localhost:27017/ecattle-kernel",
        development: "mongodb://localhost:27017/ecattle-kernel",
        test: "mongodb://localhost:27017/ecattle-kernel",
      }
   
}