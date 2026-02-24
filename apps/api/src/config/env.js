function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function optionalEnv(name, fallback = "") {
  const v = process.env[name];
  return v ? v : fallback;
}

export const env = {
  NODE_ENV: optionalEnv("NODE_ENV", "development"),
  PORT: Number(optionalEnv("PORT", "3000")),

  JWT_SECRET: requireEnv("JWT_SECRET"),
  DATABASE_URL: requireEnv("DATABASE_URL"),

  // Magento
  MAGENTO_BASE_URL: requireEnv("MAGENTO_BASE_URL"),

  // Path B: admin token flow (required)
  MAGENTO_ADMIN_USER: requireEnv("MAGENTO_ADMIN_USER"),
  MAGENTO_ADMIN_PASS: requireEnv("MAGENTO_ADMIN_PASS"),

  // Optional now (only needed if you ever switch back to integration token)
  MAGENTO_TOKEN: optionalEnv("MAGENTO_TOKEN", ""),
};
