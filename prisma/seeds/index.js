/* eslint-disable no-console */
const prisma = require('../../src/prismaClient');
const { hashPassword } = require('../../src/util');

(async () => {
  // DATA RESET (Delete all data and set id incremenent back to initial value)
  await prisma.$executeRaw('DELETE FROM user;');
  await prisma.$executeRaw('ALTER TABLE user AUTO_INCREMENT = 1;');
  await prisma.family.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE family AUTO_INCREMENT = 1;');
  await prisma.property.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE property AUTO_INCREMENT = 1;');
  await prisma.picture.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE picture AUTO_INCREMENT = 1;');
  await prisma.reservation.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE reservation AUTO_INCREMENT = 1;');

  // FAMILY SEEDS (Add all 15 members, 16th is admin)
  const family = [
    [
      'Raphaël',
      'Lefevre',
      'test@test.com',
      'https://github.com/test',
      'BAB',
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    ],
    [
      'Nelly',
      'Chieng',
      'test2@test.com',
      'https://github.com/test2',
      'BAB',
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    ],
    [
      'Laura ',
      'Glutron',
      'test3@test.com',
      'https://github.com/test3',
      'BAB',
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    ],
    [
      'Renaud ',
      'Fournet',
      'test4@test.com',
      'https://github.com/test4',
      'BAB',
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    ],
    [
      'Diane ',
      'Casanova',
      'test5@test.com',
      'https://github.com/test5',
      'BAB',
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    ],
  ];
  const familySeeds = family.map((el) => {
    return prisma.family.create({
      data: {
        firstname: el[0],
        lastname: el[1],
        mail: el[2],
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
