import { z } from "zod";

const frequencyZod = z.enum(["DAY", "MONTH", "WEEK", "YEAR"]);

export const payUZod = z.object({
  type: z.literal("payu"),
  configuration: z.object({
    currency: z.literal("inr"),
    frequency: frequencyZod,
    amount: z.number(),
  }),
});

export const appleIAPZod = z.object({
  type: z.literal("apple"),
  configuration: z.object({
    frequency: frequencyZod,
  }),
});

export const amazonZod = z.object({
  type: z.literal("amazon"),
  configuration: z.object({
    frequency: frequencyZod,
  }),
});

export const stripeZod = z.object({
  type: z.literal("stripe"),
  configuration: z.object({
    currency: z.enum(["eur", "usd", "pln", "inr"]),
    frequency: frequencyZod,
    amount: z.number(),
  }),
});

export const priceConfigurationZod = z.discriminatedUnion("type", [
  payUZod,
  appleIAPZod,
  amazonZod,
  stripeZod,
]);

export type PriceConfiguration = z.infer<typeof priceConfigurationZod>;

export const handleGateway = (priceConfiguration: PriceConfiguration) => {
  if (
    priceConfiguration.type === "amazon" ||
    priceConfiguration.type === "apple"
  ) {
    priceConfiguration.configuration.currency; // <-- Does not exist!
    return;
  }

  if (priceConfiguration.type === "payu") {
    priceConfiguration.configuration.currency;
    return;
  }

  if (priceConfiguration.type === "stripe") {
    return;
  }

  priceConfiguration.configuration.currency; // Guess what type priceConfiguration is here
};
