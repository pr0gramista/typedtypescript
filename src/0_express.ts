import express, { Request } from "express";

const app = express();

app.use((req: any, res, next) => {
  req.magic = () => console.log("Pufff!");
  next();
});

app.use((req, res) => {
  let message = "Hello World from Express";
  if (req.path.startsWith("/magic")) {
    // @ts-ignore
    req.magic();
    message = "PUFFF!";
  }

  res.status(200).send(message);
});

// So we can do...
interface OurRequest extends Request {
  magic: () => void;
}

app.use((req: OurRequest, res) => {
  // /\ Not really
  // |
  let message = "Hello World from Express";
  if (req.path.startsWith("/magic")) {
    req.magic();
    message = "PUFFF!";
  }

  res.status(200).send(message);
});

app.listen(3000, () => {
  console.log("Listening");
});
