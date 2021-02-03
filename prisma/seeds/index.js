/* eslint-disable no-console */
const prisma = require('../../src/prismaClient');
const { hashPassword } = require('../../src/util');

(async () => {
  // DATA RESET (Delete all data and set id incremenent back to initial value)
  await prisma.$executeRaw('DELETE FROM user;');
  await prisma.$executeRaw('ALTER TABLE user AUTO_INCREMENT = 1;');
  await prisma.role.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE role AUTO_INCREMENT = 1;');
  await prisma.product.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE product AUTO_INCREMENT = 1;');
  await prisma.notification.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE notification AUTO_INCREMENT = 1;');
  await prisma.company.deleteMany({});
  await prisma.$executeRaw('ALTER TABLE company AUTO_INCREMENT = 1;');

  // ROLES SEEDS (Add all 4 roles)
  const roles = [
    // FTM Team Admins
    { label: 'superadmin' },
    // Client Admins
    { label: 'admin' },
    // Clients
    { label: 'user' },
    // Temp role for clients waiting role attribution by FTM Team
    { label: 'prospect' },
  ];
  const rolesSeeds = roles.map((el) => {
    return prisma.role.create({
      data: {
        label: el.label,
      },
    });
  });
  await Promise.all(rolesSeeds)
    .then((res) => console.log(res))
    .catch((err) => console.log(err.message));

  // PRODUCTS SEEDS
  const products = [
    // Follow The Market product
    { label: 'ftmkt' },
    // Follow The Data product
    { label: 'ftd' },
    // Follow The Mall product
    { label: 'ftmall' },
    // Follo The Map product
    { label: 'ftmap' },
  ];
  const productsSeeds = products.map((el) => {
    return prisma.product.create({
      data: {
        label: el.label,
      },
    });
  });
  await Promise.all(productsSeeds)
    .then((res) => console.log(res))
    .catch((err) => console.log(err.message));

  // USERS SEEDS
  await prisma.user.create({
    data: {
      // Creates 1 superdamin user
      password: hashPassword('P@ssw0rd'),
      firstname: 'Nicolas',
      lastname: 'Blicq',
      email: 'nblicq@followthemarket.fr',
      phone_number: '+33660877678',
      job_title: 'Co-founder',
      language: 'french',
      // Creates 1 notification preferences
      notification: {
        create: {
          zone: 'Lille',
          vertical_trade: 'Product performance data',
          sms: false,
          email: true,
        },
      },
      // Attributes superdamin role
      role: {
        connect: {
          label: 'superadmin',
        },
      },
      // Creates 1 product contract
      productsOwned: {
        create: {
          product: {
            // Connects to the Follow The Market product
            connect: {
              label: 'ftmkt',
            },
          },
          // Add start and end dates of the contract
          start_date: '2021-01-01T10:00:00.000Z',
          end_date: '2021-12-01T10:00:00.000Z',
        },
      },
      // Creates 1 company the user will be attached to
      company: {
        create: {
          label: 'Follow The Market',
          SIRET_number: '12345678912345',
          VAT_number: 'FR12123456789',
          city: 'Lille',
          zip_code: '59000',
          street: '165 avenue de Bretagne Euratechnologies',
          country: 'FR',
        },
      },
    },
  });
})().finally(async () => {
  await prisma.$disconnect();
});
