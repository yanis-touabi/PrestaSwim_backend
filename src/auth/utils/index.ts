const { hash } = require('bcryptjs');

const dayjs = require('dayjs');
const bcrypt = require('bcrypt');

const getAccessExpiry = () => dayjs().add(1, 'd').toDate();
const getRefreshExpiry = () => dayjs().add(30, 'd').toDate();

export async function getTokens(user, prisma, jwtService) {
  try {
    const { accessToken } = await getJwtAccessToken(
      user.id,
      user,
      user.email,
      user.role,
      jwtService,
    );

    const { refreshToken } = await getJwtRefreshToken(
      user.id,
      user.email,
      jwtService,
    );

    // update the user login and is loggedin status to true
    await prisma.user.update({
      data: {
        isLoggedIn: true,
        login: true,
      },
      where: {
        id: user.id,
      },
    });

    const hashValue = await hash(refreshToken, 10);
    const token = await prisma.token.create({
      data: {
        expiresAt: getRefreshExpiry(),
        refreshToken: hashValue,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return {
      accessToken,
      refreshToken,
      tokenId: token.id,
      accessTokenExpires: getAccessExpiry(),
      data: user,
    };
  } catch (error) {
    console.error('Error in getTokens:', error);
    return null;
  }
}

async function getJwtAccessToken(sub, user, email, role, jwtService) {
  const payload = {
    sub,
    user,
    email,
    role,
  };
  const accessToken = await jwtService.signAsync(payload, {
    secret: process.env.REFRECH_SECRET,
  });
  return {
    accessToken,
  };
}

async function getJwtRefreshToken(sub, email, jwtService) {
  const payload = { sub, email };
  const refreshToken = await jwtService.signAsync(payload, {
    secret: process.env.REFRECH_SECRET,
    expiresIn: '10d',
  });
  return {
    refreshToken,
  };
}
