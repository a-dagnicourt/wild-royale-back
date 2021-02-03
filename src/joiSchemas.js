const Joi = require('joi');

const valUser = Joi.object().keys({
  // Password must be 8 character long atleast and contain 1 lowercase, 1 uppercase, 1 special char and 1 number (ex : P@ssw0rdÿ1234)
  password: Joi.string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/
    )
    .required(),
  // Firstname can can be 3 to 30 char long, contain multiple words separated by whitespace, ', -, must end by a letter and be 3 to 30 char long (ex: Jean-Noêl)
  firstname: Joi.string()
    .regex(/^[A-zÀ-ÿ]+((\s)?(('|-|)?([A-zÀ-ÿ])+))*$/)
    .min(3)
    .max(30)
    .required(),
  // Lastname can can be 3 to 30 char long, contain multiple words separated by whitespace, ', -, must end by a letter and be 3 to 30 char long (ex: O'Connor de-la Bath)
  lastname: Joi.string()
    .regex(/^[A-zÀ-ÿ]+((\s)?(('|-|)?([A-zÀ-ÿ])+))*$/)
    .min(3)
    .max(30)
    .required(),
  // Email must be in email@email.com format (ex: contact@ftm.fr)
  email: Joi.string().email().required(),
  // Phone number must begin by +xx calling code and can be 6 to 14 char long (ex: +33601020304)
  phone_number: Joi.string()
    .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/)
    .required(),
  // Job title can be 3 to 30 char long, contain multiple words separated by whitespace, ' or - and must end by a letter (ex: Bêta-Tester)
  job_title: Joi.string()
    .regex(/^[A-zÀ-ÿ]+((\s)?(('|-|)?([A-zÀ-ÿ])+))*$/)
    .min(3)
    .max(50)
    .required(),
  // Language can be 6 or 7 char long, contain only letters and must end by a letter (cases : french or english)
  language: Joi.string()
    .regex(/^[A-zÀ-ÿ]*$/)
    .min(6)
    .max(7)
    .required(),
  // Product must be a 1 to 6 long string (cases : ftmkt, ftd, ftmall, ftmap)
  productsOwned: Joi.string().min(1).max(6),
  // Contract start date must be in datetime format (ex: 2021-01-01T10:00:00.000Z)
  productStartDate: Joi.string().length(24),
  // Contract end date must be in datetime format (ex: 2021-01-01T10:00:00.000Z)
  productEndDate: Joi.string().length(24),
  // Role can be 4 to 15 char long, contain multiple words separated by whitespace, ' or - and must end by a letter (cases: superadmin, admin, user, prospect)
  role: Joi.string().min(4).max(15),
  // Company label must be a 3 to 30 long string (ex: Super-Net @gency 2000 !)
  companyLabel: Joi.string().min(3).max(30),
  // Company SIRET number must contain 14 numbers (ex: 12345678912345)
  companySIRET: Joi.string()
    .regex(/^[0-9]{14}$/)
    .required(),
  // Company VAT number must contain FR followed by 11 numbers (ex: FR12123456789) /!\ Would need update for international market /!\
  companyVAT: Joi.string().regex(/^(FR)[0-9]{11}$/),
  // Comapny city can be 3 to 30 char long, contain multiple words separated by whitespace, ' or - and must end by a letter (ex: Scharrachbergheim – Irmstett)
  companyCity: Joi.string()
    .regex(/^[A-zÀ-ÿ]+((?:. |-| |')*[A-zÀ-ÿ])*$/)
    .min(3)
    .max(30),
  // Company Zip Code must be 5 numbers long (ex: 59000)
  companyZip: Joi.string().length(5),
  // Company street address must be a 5 to 80 char long string
  companyStreet: Joi.string().min(5).max(80),
  // Company country must be a valid ISO 3166-1 alpha-2 code (ex: FR)
  companyCountry: Joi.string().regex(
    /^A[^ABCHJKNPVY]|B[^CKPUX]|C[^BEJPQST]|D[EJKMOZ]|E[CEGHRST]|F[IJKMOR]|G[^CJKOVXZ]|H[KMNRTU]|I[DELMNOQRST]|J[EMOP]|K[EGHIMNPRWYZ]|L[ABCIKRSTUVY]|M[^BIJ]|N[ACEFGILOPRUZ]|OM|P[^BCDIJOPQUVXZ]|QA|R[EOSUW]|S[^FPQUW]|T[^ABEIPQSUXY]|U[AGMSYZ]|V[ACEGINU]|WF|WS|YE|YT|Z[AMW]$/
  ),
});

const valUserForPutRoute = Joi.object().keys({
  // Password must be 8 character long atleast and contain 1 lowercase, 1 uppercase, 1 special char and 1 number (ex : P@ssw0rdÿ1234)
  password: Joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/
  ),
  // Firstname can can be 3 to 30 char long, contain multiple words separated by whitespace, ', -, must end by a letter and be 3 to 30 char long (ex: Jean-Noêl)
  firstname: Joi.string()
    .regex(/^[A-zÀ-ÿ]+((\s)?(('|-|)?([A-zÀ-ÿ])+))*$/)
    .min(3)
    .max(30),
  // Lastname can can be 3 to 30 char long, contain multiple words separated by whitespace, ', -, must end by a letter and be 3 to 30 char long (ex: O'Connor de-la Bath)
  lastname: Joi.string()
    .regex(/^[A-zÀ-ÿ]+((\s)?(('|-|)?([A-zÀ-ÿ])+))*$/)
    .min(3)
    .max(30),
  // Email must be in email@email.com format (ex: contact@ftm.fr)
  email: Joi.string().email(),
  // Phone number must begin by +xx calling code and can be 6 to 14 char long (ex: +33601020304)
  phone_number: Joi.string().regex(/^\+(?:[0-9] ?){6,14}[0-9]$/),
  // Job title can be 3 to 30 char long, contain multiple words separated by whitespace, ' or - and must end by a letter (ex: Bêta-Tester)
  job_title: Joi.string()
    .regex(/^[A-zÀ-ÿ]+((\s)?(('|-|)?([A-zÀ-ÿ])+))*$/)
    .min(3)
    .max(50),
  // Language can be 6 or 7 char long, contain only letters and must end by a letter (cases : french or english)
  language: Joi.string()
    .regex(/^[A-zÀ-ÿ]*$/)
    .min(6)
    .max(7),
  // Product must be a 1 to 6 long string (cases : ftmkt, ftd, ftmall, ftmap)
  productsOwned: Joi.string().min(1).max(6),
  // Contract start date must be in datetime format (ex: 2021-01-01T10:00:00.000Z)
  productStartDate: Joi.string().length(24),
  // Contract end date must be in datetime format (ex: 2021-01-01T10:00:00.000Z)
  productEndDate: Joi.string().length(24),
  // Role can be 4 to 15 char long, contain multiple words separated by whitespace, ' or - and must end by a letter (cases: superadmin, admin, user, prospect)
  role: Joi.string().min(4).max(15),
  // Company label must be a 3 to 30 long string (ex: Super-Net @gency 2000 !)
  companyLabel: Joi.string().min(3).max(30),
  // Company SIRET number must contain 14 numbers (ex: 12345678912345)
  companySIRET: Joi.string()
    .regex(/^[0-9]{14}$/)
    .required(),
  // Company VAT number must contain FR followed by 11 numbers (ex: FR12123456789) /!\ Would need update for international market /!\
  companyVAT: Joi.string().regex(/^(FR)[0-9]{11}$/),
  // Comapny city can be 3 to 30 char long, contain multiple words separated by whitespace, ' or - and must end by a letter (ex: Scharrachbergheim – Irmstett)
  companyCity: Joi.string()
    .regex(/^[A-zÀ-ÿ]+((?:. |-| |')*[A-zÀ-ÿ])*$/)
    .min(3)
    .max(30),
  // Company Zip Code must be 5 numbers long (ex: 59000)
  companyZip: Joi.string().length(5),
  // Company street address must be a 5 to 80 char long string
  companyStreet: Joi.string().min(5).max(80),
  // Company country must be a valid ISO 3166-1 alpha-2 code (ex: FR)
  companyCountry: Joi.string().regex(
    /^A[^ABCHJKNPVY]|B[^CKPUX]|C[^BEJPQST]|D[EJKMOZ]|E[CEGHRST]|F[IJKMOR]|G[^CJKOVXZ]|H[KMNRTU]|I[DELMNOQRST]|J[EMOP]|K[EGHIMNPRWYZ]|L[ABCIKRSTUVY]|M[^BIJ]|N[ACEFGILOPRUZ]|OM|P[^BCDIJOPQUVXZ]|QA|R[EOSUW]|S[^FPQUW]|T[^ABEIPQSUXY]|U[AGMSYZ]|V[ACEGINU]|WF|WS|YE|YT|Z[AMW]$/
  ),
});

const valRole = Joi.object().keys({
  // Role can be 4 to 15 char long, contain multiple words separated by whitespace, ' or - and must end by a letter (cases: superadmin, admin, user, prospect)
  label: Joi.string().min(4).max(15).required(),
});

const valProduct = Joi.object().keys({
  // Product must be a 1 to 6 long string (cases : ftmkt, ftd, ftmall, ftmap)
  label: Joi.string().min(1).max(6).required(),
});

const valNotif = Joi.object().keys({
  // Zone must be a 3 to 30 long string (ex: Centre d'affaires LILLE REPUBLIQUE)
  zone: Joi.string().min(3).max(30).required(),
  // Vertical trade must be a 3 to 30 long string (ex: Product Data Marketing)
  vertical_trade: Joi.string().min(3).max(30).required(),
  // SMS preference must be a boolean (ex: false)
  sms: Joi.boolean().required(),
  // Email preference must be a boolean (ex: true)
  email: Joi.boolean().required(),
  // ID of user must be an integer (ex: 12)
  id_user: Joi.number().integer().required(),
});

const valCompany = Joi.object().keys({
  // Company label must be a 3 to 30 long string (ex: Super-Net @gency 2000 !)
  label: Joi.string().min(3).max(30).required(),
  // Company SIRET number must contain 14 numbers (ex: 12345678912345)
  SIRET_number: Joi.string()
    .regex(/^[0-9]{14}$/)
    .required(),
  // Company VAT number must contain FR followed by 11 numbers (ex: FR12123456789) /!\ Would need update for international market /!\
  VAT_number: Joi.string()
    .regex(/^(FR)[0-9]{11}$/)
    .required(),
  // Company city can be 3 to 30 char long, contain multiple words separated by whitespace, ' or - and must end by a letter (ex: Scharrachbergheim – Irmstett)
  city: Joi.string()
    .regex(/^[A-zÀ-ÿ]+((?:. |-| |')*[A-zÀ-ÿ])*$/)
    .min(3)
    .max(30)
    .required(),
  // Company Zip Code must be 5 numbers long (ex: 59000)
  zip_code: Joi.string().length(5).required(),
  // Company street address must be a 5 to 80 char long string
  street: Joi.string().min(5).max(80).required(),
  // Company country must be a valid ISO 3166-1 alpha-2 code (ex: FR)
  country: Joi.string()
    .regex(
      /^A[^ABCHJKNPVY]|B[^CKPUX]|C[^BEJPQST]|D[EJKMOZ]|E[CEGHRST]|F[IJKMOR]|G[^CJKOVXZ]|H[KMNRTU]|I[DELMNOQRST]|J[EMOP]|K[EGHIMNPRWYZ]|L[ABCIKRSTUVY]|M[^BIJ]|N[ACEFGILOPRUZ]|OM|P[^BCDIJOPQUVXZ]|QA|R[EOSUW]|S[^FPQUW]|T[^ABEIPQSUXY]|U[AGMSYZ]|V[ACEGINU]|WF|WS|YE|YT|Z[AMW]$/
    )
    .required(),
});

module.exports = {
  valUser,
  valUserForPutRoute,
  valRole,
  valProduct,
  valNotif,
  valCompany,
};
