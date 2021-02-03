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
  // isAdmin must be a boolen avlue (ex: false)
  isAdmin: Joi.boolean().required(),
});

const valUserForUpdate = Joi.object().keys({
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
  // isAdmin must be a boolen avlue (ex: false)
  isAdmin: Joi.boolean(),
});

const valProperty = Joi.object().keys({
  // Property label must be a 3 to 30 long string (ex: Super-Net @gency 2000 !)
  label: Joi.string().min(3).max(30).required(),
  // Property lat & longmust be 6 to 9 long string (ex: -100.0000)
  lat: Joi.string().min(6).max(8).required(),
  long: Joi.string().min(6).max(9).required(),
  // Property picture must be a valid url (ex: "https://test.com/test.jpg")
  pictureUrl: Joi.string().uri().required(),
  // Property label must be a 3 to 60 long string (ex: Wow incredible castle !)
  pictureAlt: Joi.string().min(3).max(60).required(),
});

const valPropertyForUpdate = Joi.object().keys({
  // Property label must be a 3 to 30 long string (ex: Super-Net @gency 2000 !)
  label: Joi.string().min(3).max(30).required(),
  // Property lat & long must be 6 to 9 long string (ex: -100.0000)
  lat: Joi.string().min(6).max(8).required(),
  long: Joi.string().min(6).max(9).required(),
});

const valFamily = Joi.object().keys({
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
  // Linkedin url must be must be a valid url (ex: "https://www.linkedin.com/in/test/")
  linkedin: Joi.string().uri(),
  // Family member github page must be a valid url (ex: "https://github.com/test/")
  github: Joi.string().uri(),
  // Property zone must be 3 to 60 long string (ex: "BAB")
  zone: Joi.string().min(3).max(60),
  // Family member picture must be a valid url (ex: "https://test.com/test.jpg")
  picture: Joi.string().uri().required(),
});

const valFamilyForUpdate = Joi.object().keys({
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
  // Linkedin url must be must be a valid url (ex: "https://www.linkedin.com/in/test/")
  linkedin: Joi.string().uri(),
  // Family member github page must be a valid url (ex: "https://github.com/test/")
  github: Joi.string().uri(),
  // Property zone must be 3 to 60 long string (ex: "BAB")
  zone: Joi.string().min(3).max(60),
  // Family member picture must be a valid url (ex: "https://test.com/test.jpg")
  picture: Joi.string().uri(),
});

const valPicture = Joi.object().keys({
  // Picture url must be valid (ex: "https://test.com/test.jpg")
  url: Joi.string().uri().required(),
  // Picture alt text must be a 3 to 60 long string (ex: Wow incredible castle !)
  alt: Joi.string().min(3).max(60).required(),
  // Picture property id must be an integer
  property: Joi.number().required(),
});

const valPictureForUpdate = Joi.object().keys({
  // Picture url must be valid (ex: "https://test.com/test.jpg")
  url: Joi.string().uri().required(),
  // Picture alt text must be a 3 to 60 long string (ex: Wow incredible castle !)
  alt: Joi.string().min(3).max(60).required(),
  // Picture property id must be an integer
  property: Joi.number(),
});

const valRes = Joi.object().keys({
  // Reservation property id must be an integer
  property: Joi.number().required(),
  // Reservation user id must be an integer
  user: Joi.number().required(),
  // Reservation start date must be a 24 long datetime format (ex: "2021-01-01T00:00:00.000Z")
  start_date: Joi.string().length(24).required(),
  // Reservation end date must be a 24 long datetime format (ex: "2021-01-01T00:00:00.000Z")
  end_date: Joi.string().length(24).required(),
});

const valResForUpdate = Joi.object().keys({
  // Reservation property id must be an integer
  property: Joi.number(),
  // Reservation user id must be an integer
  user: Joi.number(),
  // Reservation start date must be a 24 long datetime format (ex: "2021-01-01T00:00:00.000Z")
  start_date: Joi.string().length(24).required(),
  // Reservation end date must be a 24 long datetime format (ex: "2021-01-01T00:00:00.000Z")
  end_date: Joi.string().length(24).required(),
});

module.exports = {
  valUser,
  valUserForUpdate,
  valProperty,
  valPropertyForUpdate,
  valFamily,
  valFamilyForUpdate,
  valPicture,
  valPictureForUpdate,
  valRes,
  valResForUpdate,
};
