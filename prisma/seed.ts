import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = 'Yanis_123456';
const saltOrRounds = 10;

async function createAdminUser() {
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@prestaswim.com',
      password: await bcrypt.hash(DEFAULT_PASSWORD, saltOrRounds),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      isVerified: true,
      admin: {
        create: {
          permissionLevel: 0, // Super admin
        },
      },
    },
  });
  console.log(`Created admin user with id: ${adminUser.id}`);
  return adminUser;
}

async function createServiceProviders(count: number) {
  for (let i = 0; i < count; i++) {
    // First create an address for this provider
    const address = await prisma.address.create({
      data: {
        addressLine1: faker.location.streetAddress(),
        addressLine2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        commune: faker.location.county(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
    });

    // Then create the user with this address
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: await bcrypt.hash(DEFAULT_PASSWORD, saltOrRounds),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatar: faker.image.avatar(),
        birthDate: faker.date.birthdate({
          min: 18,
          max: 65,
          mode: 'age',
        }),
        role: 'PROVIDER',
        gender: faker.helpers.arrayElement([
          'MALE',
          'FEMALE',
          'OTHER',
        ]),
        phoneNumber: faker.phone.number(),
        accountStatus: 'ACTIVE',
        isVerified: faker.datatype.boolean(),
        addressId: address.id,
      },
    });

    // Finally create the service provider profile
    await prisma.serviceProvider.create({
      data: {
        userId: user.id,
        specialty: faker.helpers.arrayElement([
          'Swimming Instructor',
          'Lifeguard',
          'Pool Maintenance',
        ]),
        bio: faker.person.bio(),
        hourlyRate: faker.number.float({
          min: 15,
          max: 50,
          fractionDigits: 2,
        }),
        availability: faker.datatype.boolean(),
      },
    });
  }
  console.log(
    `Created ${count} service providers with their users and addresses`,
  );
}

async function createProfessionals(count: number) {
  for (let i = 0; i < count; i++) {
    // First create an address for this professional
    const address = await prisma.address.create({
      data: {
        addressLine1: faker.location.streetAddress(),
        addressLine2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        commune: faker.location.county(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
    });

    // Then create the user with this address
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: await bcrypt.hash(DEFAULT_PASSWORD, saltOrRounds),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        avatar: faker.image.avatar(),
        birthDate: faker.date.birthdate({
          min: 18,
          max: 65,
          mode: 'age',
        }),
        role: 'PROFESSIONAL',
        gender: faker.helpers.arrayElement([
          'MALE',
          'FEMALE',
          'OTHER',
        ]),
        phoneNumber: faker.phone.number(),
        accountStatus: 'ACTIVE',
        isVerified: faker.datatype.boolean(),
        addressId: address.id,
      },
    });

    // Finally create the professional profile
    const professional = await prisma.professional.create({
      data: {
        userId: user.id,
        currentPosition: faker.person.jobTitle(),
        contactEmail: user.email,
        contactPhone: user.phoneNumber || faker.phone.number(),
        workingAt: faker.company.name(),
        experienceYears: faker.number.int({ min: 1, max: 20 }),
        industry: 'Aquatics',
        linkedinProfile: `https://linkedin.com/in/${faker.string.alphanumeric(10)}`,
        accountantEmail: faker.internet.email(),
      },
    });

    // Create pools for this professional (1-3 pools per professional)
    const poolCount = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < poolCount; j++) {
      const poolAddress = await prisma.address.create({
        data: {
          addressLine1: faker.location.streetAddress(),
          addressLine2: faker.location.secondaryAddress(),
          city: faker.location.city(),
          commune: faker.location.county(),
          postalCode: faker.location.zipCode(),
          country: faker.location.country(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        },
      });

      await prisma.pool.create({
        data: {
          professionalId: professional.id,
          companyName: faker.company.name(),
          poolName: `${faker.word.adjective()} ${faker.word.noun()} Pool`,
          poolDescription: faker.lorem.paragraph(),
          poolAddressId: poolAddress.id,
        },
      });
    }
  }
  console.log(
    `Created ${count} professionals with their users, addresses, and pools`,
  );
}

async function main() {
  // Create admin (always 1)
  await createAdminUser();
  // Create service providers (each with their user and address)
  await createServiceProviders(20);
  // Create professionals (each with their user, address, and pools)
  await createProfessionals(20);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
