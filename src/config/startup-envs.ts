// Käynnistystä varten tarvittavat ympäristömuuttujat

interface Config {
  port: number;
  mongodb: {
    uri: string;
  };
  apis: {
    openai: string;
    anthropic: string;
    google: string;
    perplexity: string;
  };
}

const getConfig = (): Config => {
  const config: Config = {
    port: Number(process.env.PORT) || 3000,
    mongodb: {
      uri: process.env.MONGODB_URI || "",
    },
    apis: {
      openai: process.env.OPENAI_API_KEY || "",
      anthropic: process.env.ANTHROPIC_API_KEY || "",
      google: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
      perplexity: process.env.PERPLEXITY_API_KEY || "",
    },
  };

  const required = [
    "mongodb.uri",
    "apis.openai",
    "apis.anthropic",
    "apis.google",
    "apis.perplexity",
  ];
  required.forEach((path) => {
    const value = path.split(".").reduce((obj, key) => obj[key], config as any);
    if (!value) throw new Error(`Missing required config value: ${path}`);
  });

  return config;
};

export default getConfig();
