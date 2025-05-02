import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { auth } from "./auth";

const app = new Elysia()
	.get("/", () => "Hello Elysia")
	.use(swagger())
	.use(
		cors({
			origin: "http://localhost:5173", // Your frontend origin
			methods: ["GET", "POST", "PUT", "DELETE"],
			credentials: true
		})
	)
	.mount(auth.handler)
	.listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
