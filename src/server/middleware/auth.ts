import { createMiddleware } from "hono/factory";
import { jwtVerify, createRemoteJWKSet } from "jose";

export const accessAuth = createMiddleware(async (c, next) => {
  const audience = c.env.POLICY_AUD;
  const domainValue = c.env.CF_ACCESS_DOMAIN;

  if (!audience && !domainValue) {
    return next();
  }

  if (!audience) {
    return c.json("Missing audience", 403);
  }

  const token = c.req.header("cf-access-jwt-assertion");
  if (!token) {
    return c.json("missing required cf access jwt", 403);
  }

  try {
    const domain = String(domainValue).replace(
      /\/cdn-cgi\/access\/certs\/?$/,
      "",
    );
    const JWKS = createRemoteJWKSet(new URL(`${domain}/cdn-cgi/access/certs`));
    await jwtVerify(token, JWKS, { issuer: domain, audience });
    await next();
  } catch (error) {
    return c.json(`Invalid token :${error}`, 403);
  }
});
