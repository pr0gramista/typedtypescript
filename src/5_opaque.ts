import { Opaque } from "type-fest";

/**
 * Plan has two ids
 * One is a plain uuid
 * Another one is human readable, technical id
 */
interface Plan {
  uuid: string;
  externalId: string;
}

const plan: Plan = {
  uuid: "fe086708-f4a7-484f-894a-76af79d0e117",
  externalId: "hello",
};

function assignPlanToUser(user: string, id: string) {
  console.log(`Assigning ${id} to user ${user}`);
}

assignPlanToUser("somsiad", plan.uuid);
assignPlanToUser("somsiad", plan.externalId); // Ups..
assignPlanToUser(plan.uuid, "somsiad"); // O cie hui

//
// OPAQUE TYPE
//

type PlanId = Opaque<string, "planId">;
type PlanExternalId = Opaque<string, "externalId">;

interface PlanSmart {
  uuid: PlanId;
  externalId: PlanExternalId;
}

const planSmart: PlanSmart = {
  uuid: "679d5495-e534-45c4-94cd-4bcf75c6a75d" as PlanId,
  externalId: "hello" as PlanExternalId,
};

function assignPlanSzmartToUser(user: string, id: PlanId) {
  console.log(`Assigning ${id} to user ${user}`);
}

assignPlanSzmartToUser("somsiad", planSmart.uuid);
assignPlanSzmartToUser("somsiad", planSmart.externalId);
assignPlanSzmartToUser(planSmart.uuid, "somsiad");

//
// OPAQUE TYPE with type predicates
//

type PESEL = Opaque<string, "pesel">;

// Stolen from Wikipedia
export function isPESEL(data: string): data is PESEL {
  if (data === null || data.length !== 11) return false;

  const arr = data.split("");
  let sum = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    sum += +arr[i] * getMultiplier(i + 1);
  }

  const modulo = sum % 10;
  const lastD = Number(data.substr(data.length - 1));

  return (modulo === 0 && lastD === 0) || lastD === 10 - modulo;
}

function getMultiplier(index: number): number {
  switch (index % 4) {
    case 1:
      return 1;
    case 2:
      return 3;
    case 3:
      return 7;
    case 0:
      return 9;
  }

  throw "Something went wrong with the index calculation";
}

function sendToPrison(pesel: PESEL) {
  console.log(`${pesel} goes to prison!`);
}

sendToPrison("Bartosz Wiśniewski"); // Can't touch me!

const potencialCriminal = "92071314764";
if (isPESEL(potencialCriminal)) {
  sendToPrison(potencialCriminal);
}
