-- SQLBook: Code
-- This is an empty migration.

CREATE OR REPLACE VIEW "ServiceProviderUserDetails" AS
SELECT
    u.id AS "userId",
    u.email,
    u."firstName",
    u."lastName",
    u.avatar,
    u."isLoggedIn",
    u.login,
    u."birthDate",
    u.role,
    u.gender,
    u."phoneNumber",
    u."accountStatus",
    u."verificationCode",
    u."isVerified",
    u."createdAt",
    u."updatedAt",
    sp.id AS "serviceProviderId",
    sp.specialty,
    sp.bio,
    sp."hourlyRate",
    sp.notes,
    sp."availability",
    a.id AS "addressId",
    a."addressLine1",
    a."addressLine2",
    a.city,
    a.commune,
    a."postalCode",
    a.country,
    a.latitude,
    a.longitude
FROM
    "User" u
JOIN
    "ServiceProvider" sp ON sp."userId" = u.id
LEFT JOIN
    "Address" a ON u."addressId" = a.id;


CREATE OR REPLACE VIEW "ProfessionalUserDetails" AS
SELECT
    u.id AS "userId",
    u.email,
    u."firstName",
    u."lastName",
    u.avatar,
    u."isLoggedIn",
    u.login,
    u."birthDate",
    u.role,
    u.gender,
    u."phoneNumber",
    u."accountStatus",
    u."verificationCode",
    u."isVerified",
    u."createdAt",
    u."updatedAt",
    p.id AS "professionalId",
    p."currentPosition",
    p."contactEmail",
    p."contactPhone",
    p."workingAt",
    p."experienceYears",
    p.industry,
    p."linkedinProfile",
    p."accountantEmail",
    a.id AS "addressId",
    a."addressLine1",
    a."addressLine2",
    a.city,
    a.commune,
    a."postalCode",
    a.country,
    a.latitude,
    a.longitude
FROM
    "User" u
JOIN
    "Professional" p ON p."userId" = u.id
LEFT JOIN
    "Address" a ON u."addressId" = a.id;

