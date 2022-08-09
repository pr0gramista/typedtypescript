import Koa from "koa";

type DemoContext = {
  magic: () => void;
};

const app = new Koa<Koa.DefaultState, DemoContext>();

app.use(async (ctx, next) => {
  ctx.magic = () => console.log("Let's do some magic!");
  await next();
});

app.use(async (ctx) => {
  let message = "Hello World from Koa";
  if (ctx.path.startsWith("/magic")) {
    ctx.magic();
    message = "PUFF!";
  }

  ctx.body = message;
});

app.listen(3000, () => {
  console.log("Listening");
});
