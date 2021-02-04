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
      'Anthony',
      'Verges',
      'https://www.linkedin.com/in/anthony-verg%C3%A8s-341344176/',
      'https://github.com/Anthony-Verges',
      'BAB',
      `http://localhost:${PORT}/media/8C26D7A7-0201-4FAA-ACB6-352FC5E2C022_1_105_c.jpeg`,
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
      'Diane',
      'Casanova',
      'https://www.linkedin.com/in/diane-casanova-8916a4198/',
      'https://github.com/dianecasanova',
      'BAB',
      `http://localhost:${PORT}/media/FDAF9B1E-3D54-450B-9B2E-A95BBD94A8BA_1_105_c.jpeg`,
    ],
    [
      'Laura',
      'Glutron',
      'https://www.linkedin.com/in/laura-glutron/',
      'https://github.com/lauraglutron',
      'BAB',
      `http://localhost:${PORT}/media/34A46313-7C2D-4712-BF51-320EFA04452C_1_105_c.jpeg`,
    ],
    [
      'Linda',
      'Resseguier',
      'https://www.linkedin.com/in/linda-resseguier-37015425/',
      'https://github.com/LindaRess',
      'BAB',
      `http://localhost:${PORT}/media/7F782788-A6DE-419A-9451-31017DE7D429_1_105_c.jpeg`,
    ],
    [
      'Malo',
      'Pivert',
      'https://www.linkedin.com/in/malo-pivert/',
      'https://github.com/00FuNkY',
      'BAB',
      `http://localhost:${PORT}/media/25B51DA3-5A39-493E-B413-FC5DE0616C10_1_105_c.jpeg`,
    ],
    [
      'Nelly',
      'Chieng',
      'https://www.linkedin.com/in/nelly-chieng/',
      'https://github.com/nelly-chieng',
      'BAB',
      `http://localhost:${PORT}/media/7BC607A2-9E6D-47B9-A4A1-5FE3882C697B_1_105_c.jpeg`,
    ],
    [
      'Raphaël',
      'Lefèvre',
      'https://www.linkedin.com/in/renaud-fournet/',
      'https://github.com/Raphael-Lefevre',
      'BAB',
      `http://localhost:${PORT}/media/AC1FB219-C2CE-421D-9927-03A9FFAD6F57_1_105_c.jpeg`,
    ],
    [
      'Renaud',
      'Fournet',
      'https://www.linkedin.com/in/rapha%C3%ABl-lef%C3%A8vre/',
      'https://github.com/renaudfournet',
      'BAB',
      `http://localhost:${PORT}/media/72803303-9396-45B8-9FC1-A66B687DD421_1_105_c.jpeg`,
    ],
    [
      'Romain',
      'Zucconi',
      'https://www.linkedin.com/in/romain-zucconi-4a28a2147',
      'https://github.com/RZucconi',
      'BAB',
      `http://localhost:${PORT}/media/463F5AF9-0250-48D0-8EBE-27A88A2A0668_1_105_c.jpeg`,
    ],
    [
      'Samuel',
      'De Zaldua',
      'https://www.linkedin.com/in/samuel-de-zaldua/',
      'https://github.com/Samdez',
      'BAB',
      `http://localhost:${PORT}/media/028EBFC6-02BC-437B-B1A9-5BABAEC0BA0E_1_105_c.jpeg`,
    ],
    [
      'Théodore',
      'Lefrançois',
      'https://www.linkedin.com/in/th%C3%A9odore-lefran%C3%A7ois-81b6891a1/',
      'https://github.com/TheodoreLefrancois',
      'BAB',
      `http://localhost:${PORT}/media/F7F0A9C8-DD18-4FA8-92B8-5F369C4E5D8F_1_105_c.jpeg`,
    ],
    [
      'Victor',
      'Salomon',
      'https://www.linkedin.com/in/victor-salomon-913166aa/',
      'https://github.com/Victor-Salomon',
      'BAB',
      `http://localhost:${PORT}/media/869B0F6A-E838-4002-ABAF-189E1E05A357_1_105_c.jpeg`,
    ],
    [
      'Yoan',
      'Marcos',
      'https://www.linkedin.com/in/yoan-marcos-73aa4b1b9/',
      'https://github.com/yoanmarcos',
      'BAB',
      `http://localhost:${PORT}/media/54A61EBC-4C54-495B-996E-D3C1D6ED39BE_1_105_c.jpeg`,
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
      'Citadelle Bergé',
      '43.4984',
      '-1.4731',
      `http://localhost:${PORT}/media/berge.jpg`,
      'Defender of Bayonne and France !',
    ],
    [
      'Cathédrale de Bayonne',
      '43.4904',
      '-1.4769',
      `http://localhost:${PORT}/media/cathedrale.jpg`,
      'The religious heart of the Basque Country',
    ],
    [
      'Fort de Socoa',
      '43.3960',
      '-1.6831',
      `http://localhost:${PORT}/media/fort-socoa.jpg`,
      'The prideful guardian of basque coasts !',
    ],
    [
      'Abbadia, le Château Observatoire',
      '43.3773',
      ' -1.7493',
      `http://localhost:${PORT}/media/abbadia.jpg`,
      'The scientific castle and eye of the Country',
    ],
    [
      'Château fort',
      '43.2194',
      '-0.8868',
      `http://localhost:${PORT}/media/mauleon.jpg`,
      'The ancient defender od the lands !',
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
