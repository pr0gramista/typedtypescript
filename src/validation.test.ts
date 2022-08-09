import { validateUsingJoi, validateUsingZod } from "./1_validation";

const invalidBodies: any[] = [
  {
    nope: "lolololo",
  },
  {
    id: "a7011e86-34ef-4f68-8873-90a3e4598d1a",
    message: "Hello World",
    author: null,
  },
  {
    id: "a7011e86-34ef-4f68-8873-90a3e4598d1a",
    message: "Hello World",
    author: undefined,
  },
  {
    id: "a7011e86-34ef-4f68-8873-90a3e4598d1a",
    message: "",
    author: {
      name: "John Cena",
    },
  },
];

const validBodies: any[] = [
  {
    id: "a7011e86-34ef-4f68-8873-90a3e4598d1a",
    message: "Hello World",
    author: {
      id: "c0bb9dbd-cdd9-43dc-917b-30e09985b356",
      name: "John Cena",
    },
  },
  {
    id: "a7011e86-34ef-4f68-8873-90a3e4598d1a",
    message: "",
    author: {
      id: "c0bb9dbd-cdd9-43dc-917b-30e09985b356",
      name: "John Cena",
    },
  },
];

it.each(invalidBodies)("should validate and detect errors", (obj) => {
  const resultJoi = validateUsingJoi(obj);
  const resultZod = validateUsingZod(obj);

  expect(resultJoi.error).toBeDefined();
  expect(resultZod.success).toBeFalsy();
});

it.each(validBodies)("should validate successfully", (obj) => {
  const resultJoi = validateUsingJoi(obj);
  const resultZod = validateUsingZod(obj);

  expect(resultJoi.error).toBeUndefined();
  expect(resultZod.success).toBe(true);

  resultJoi.value; // <-- Still "any"

  if (resultZod.success) {
    // <- Only after the assertion we can actually access the data
    console.log(resultZod.data);
  }
});
