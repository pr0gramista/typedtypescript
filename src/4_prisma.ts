import Koa from "koa";
import Router from "@koa/router";
import { Post, PrismaClient } from "@prisma/client";
import bodyParser from "koa-bodyparser";
import { z } from "zod";

export type DemoKoaContext = Koa.ParameterizedContext<
  Koa.DefaultState,
  {
    prisma: PrismaClient;
  }
>;

const app = new Koa<Koa.DefaultState, DemoKoaContext>();
const router = new Router<Koa.DefaultState, DemoKoaContext>();

router.get("/", async (ctx) => {
  ctx.body = "Hello!";
});

// httpx http://localhost:3000/users
router.get("/users", async (ctx) => {
  const users = await ctx.prisma.user.findMany();

  ctx.body = users;
});

const createUserZod = z.object({
  name: z.string(),
  email: z.string(),
});

// httpx -m POST -j '{"name":"Chonker", "email": "chonker@12345.pl"}'  http://localhost:3000/users
router.post("/users", async (ctx) => {
  const data = createUserZod.parse(ctx.request.body);

  const user = await ctx.prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    },
  });

  ctx.body = user;
});

const createPostZod = z.object({
  title: z.string(),
  authorId: z.number(),
  content: z.string(),
});

// httpx http://localhost:3000/posts
router.get("/posts", async (ctx) => {
  const posts = await ctx.prisma.post.findMany({ include: { author: true } });
  // /\
  // |
  // |
  // Notice that typings contain the JOIN!

  ctx.body = posts;
});

// httpx -m POST -j '{"title":"My first post", "content": "Today I have learned something about TS", "authorId": 1}'  http://localhost:3000/posts
router.post("/posts", async (ctx) => {
  const data = createPostZod.parse(ctx.request.body);

  const post = await ctx.prisma.post.create({
    data: {
      title: data.title,
      authorId: data.authorId,
      published: true,
      content: data.content,
    },
  });

  ctx.body = post;
});

export const errorHandler = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
  } catch (err: any) {
    console.error(err);
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
    };
  }
};

const prisma = new PrismaClient();
app.use(errorHandler);
app.use(bodyParser());
app.use(async (ctx, next) => {
  ctx.prisma = prisma;
  await next();
});
app.use(router.routes());
app.listen(3000, () => {
  console.log("Listening");
});
