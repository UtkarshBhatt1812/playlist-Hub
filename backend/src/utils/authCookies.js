const FIFTEEN_MINUTES = 15 * 60 * 1000;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const getCookieSameSite = () => {
  const configuredValue = process.env.COOKIE_SAME_SITE?.trim().toLowerCase();

  if (
    configuredValue === "strict" ||
    configuredValue === "lax" ||
    configuredValue === "none"
  ) {
    return configuredValue;
  }

  return process.env.NODE_ENV === "production" ? "none" : "lax";
};

const getCookieSecure = (sameSite) => {
  const configuredValue = process.env.COOKIE_SECURE?.trim().toLowerCase();

  if (configuredValue === "true") {
    return true;
  }

  if (configuredValue === "false") {
    return sameSite === "none";
  }

  return process.env.NODE_ENV === "production" || sameSite === "none";
};

const buildCookieOptions = (maxAge) => {
  const sameSite = getCookieSameSite();
  const domain = process.env.COOKIE_DOMAIN?.trim();

  return {
    httpOnly: true,
    secure: getCookieSecure(sameSite),
    sameSite,
    maxAge,
    path: "/",
    ...(domain ? { domain } : {}),
  };
};

export const buildAccessCookieOptions = () => buildCookieOptions(FIFTEEN_MINUTES);

export const buildRefreshCookieOptions = () => buildCookieOptions(SEVEN_DAYS);

export const setAuthCookies = (res, accessToken, refreshToken) =>
  res
    .cookie("accessToken", accessToken, buildAccessCookieOptions())
    .cookie("refreshToken", refreshToken, buildRefreshCookieOptions());
