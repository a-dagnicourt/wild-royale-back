/* eslint-disable no-console */

const prisma = require('../../src/prismaClient');
const { hashPassword } = require('../../src/util');

const { PORT } = process.env;

(async () => {
  // DATA RESET (Delete all data and set id incremenent back to initial value)
  await prisma.reservation.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE reservation AUTO_INCREMENT = 1;');
  await prisma.picture.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE picture AUTO_INCREMENT = 1;');
  await prisma.property.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE property AUTO_INCREMENT = 1;');
  await prisma.family.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE family AUTO_INCREMENT = 1;');
  await prisma.$executeRaw('DELETE FROM user;');
  await prisma.$executeRaw('ALTER TABLE user AUTO_INCREMENT = 1;');

  // FAMILY SEEDS (Add all 15 members, 16th is admin)
  const family = [
    [
      'Albin',
      'Marchand',
      'https://www.linkedin.com/in/albinmarchand/',
      'https://github.com/Albin-Marchand',
      'BAB',
      `http://localhost:${PORT}/media/3CC2DE2D-F6EA-4B23-93E6-98F490D0BE01_1_105_c.jpeg`,
    ],
    [
      'Alexandre',
      'Dagnicourt',
      'https://www.linkedin.com/in/alexandre-dagnicourt/',
      'https://github.com/a-dagnicourt',
      'BAB',
      `http://localhost:${PORT}/media/F48D56B8-4A94-42B8-9149-884A0AF06F15_1_105_c.jpeg`,
    ],
    [
      'David',
      'Mosca',
      'https://www.linkedin.com/in/david-mosca-b0464459/',
      'https://github.com/DavidDvpt',
      'BAB',
      `http://localhost:${PORT}/media/9F4E4640-F174-4304-8CA5-B24AEE74D778_1_105_c.jpeg`,
    ],
    [
      'Laura',
      'Glutron',
      'https://www.linkedin.com/in/diane-casanova-8916a4198/',
      'https://github.com/dianecasanova',
      'BAB',
      `http://localhost:${PORT}/media/FDAF9B1E-3D54-450B-9B2E-A95BBD94A8BA_1_105_c.jpeg`,
    ],
    [
      'Diane',
      'Casanova',
      'https://www.linkedin.com/in/laura-glutron/',
      'https://github.com/lauraglutron',
      'BAB',
      `http://localhost:${PORT}/media/34A46313-7C2D-4712-BF51-320EFA04452C_1_105_c.jpeg`,
    ],
  ];
  const familySeeds = family.map((el) => {
    return prisma.family.create({
      data: {
        firstname: el[0],
        lastname: el[1],
        linkedin: el[2],
        github: el[3],
        zone: el[4],
        picture: el[5],
      },
    });
  });
  await Promise.all(familySeeds)
    .then((res) => console.log(res))
    .catch((err) => console.log(err.message));

  // PROPERTY SEEDS (Add all 15 members, 16th is admin)
  const property = [
    [
      'Property 1',
      '83.0773',
      '-150.4348',
      'https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg',
      'Superb castle !',
    ],
    [
      'Property 2',
      '83.0773',
      '-150.4348',
      'https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg',
      'Superb castle !',
    ],
    [
      'Property 3',
      '83.0773',
      '-150.4348',
      'https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg',
      'Superb castle !',
    ],
    [
      'Property 4',
      '83.0773',
      '-150.4348',
      'https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg',
      'Superb castle !',
    ],
    [
      'Property 5',
      '83.0773',
      '-150.4348',
      'https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_Neuschwanstein.jpg',
      'Superb castle !',
    ],
  ];
  const propertySeeds = property.map((el) => {
    return prisma.property.create({
      data: {
        label: el[0],
        lat: el[1],
        long: el[2],
        reservation: undefined,
        picture: {
          create: {
            url: el[3],
            alt: el[4],
          },
        },
      },
    });
  });
  await Promise.all(propertySeeds)
    .then((res) => console.log(res))
    .catch((err) => console.log(err.message));

  // ADMIN SEED
  await prisma.user.create({
    data: {
      // Creates 1 damin user
      email: 'admin@wildroyale.fr',
      password: hashPassword('P@ssw0rd'),
      firstname: 'Alexandre',
      lastname: 'Dagnicourt',
      isAdmin: true,
      reservation: undefined,
    },
  });
})().finally(async () => {
  await prisma.$disconnect();
});
