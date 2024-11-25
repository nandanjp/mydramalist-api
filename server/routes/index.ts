import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createRouter } from "@/lib/create-app";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { createSelectSchema } from "drizzle-zod";
import { user } from "@/db/schemas";
import { createAuthClient } from "better-auth/client";
import { sessionMiddleware } from "@/middleware/auth.middleware";

const authClient = createAuthClient();

const router = createRouter()
    .openapi(
        createRoute({
            tags: ["Index"],
            method: "get",
            path: "/",
            responses: {
                [HttpStatusCodes.OK]: jsonContent(
                    createMessageObjectSchema("Mydramalist"),
                    "Mydramalist Home"
                ),
            },
        }),
        (c) => c.json({ message: "Mydramalist" }, HttpStatusCodes.OK)
    )
    .openapi(
        createRoute({
            tags: ["Auth"],
            method: "post",
            path: "/login",
            request: {
                body: jsonContentRequired(
                    z.object({
                        email: z.string().email(),
                        password: z.string().min(8),
                    }),
                    "login body"
                ),
            },
            responses: {
                [HttpStatusCodes.OK]: jsonContent(
                    createSelectSchema(user),
                    "the logged in user"
                ),
                [HttpStatusCodes.BAD_REQUEST]: jsonContent(
                    z.object({
                        message: z.string(),
                    }),
                    "failed to retrieve information about a user from the provided credentials"
                ),
            },
        }),
        async (c) => {
            const user = c.get("user");
            if (user)
                return await db.query.user
                    .findFirst({
                        where: (u, { eq }) => eq(u.id, user.id),
                    })
                    .then((loggedInUser) =>
                        c.json(loggedInUser, HttpStatusCodes.OK)
                    );

            const { email, password } = c.req.valid("json");
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });
            if (!data || error)
                return c.json(
                    {
                        message: `failed to login user using the provided credentials: ${error.message}`,
                    },
                    HttpStatusCodes.BAD_REQUEST
                );
            return await db.query.user
                .findFirst({
                    where: (u, { eq }) => eq(u.id, data.user.id),
                })
                .then((loggedInUser) =>
                    c.json(loggedInUser, HttpStatusCodes.OK)
                );
        }
    )
    .openapi(
        createRoute({
            tags: ["Index"],
            method: "post",
            path: "/register",
            request: {
                body: jsonContentRequired(
                    z
                        .object({
                            email: z.string().email(),
                            name: z.string().min(2),
                            password: z.string().min(6),
                            confirmPassword: z.string().min(6),
                        })
                        .superRefine(
                            (
                                { password, confirmPassword },
                                checkPassComplexity
                            ) => {
                                const containsUppercase = (ch: string) =>
                                    /[A-Z]/.test(ch);
                                const containsLowercase = (ch: string) =>
                                    /[a-z]/.test(ch);
                                const containsSpecialChar = (ch: string) =>
                                    /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(
                                        ch
                                    );
                                let countOfUpperCase = 0,
                                    countOfLowerCase = 0,
                                    countOfNumbers = 0,
                                    countOfSpecialChar = 0;
                                for (let i = 0; i < password.length; i++) {
                                    let ch = password.charAt(i);
                                    if (!isNaN(+ch)) countOfNumbers++;
                                    else if (containsUppercase(ch))
                                        countOfUpperCase++;
                                    else if (containsLowercase(ch))
                                        countOfLowerCase++;
                                    else if (containsSpecialChar(ch))
                                        countOfSpecialChar++;
                                }
                                if (
                                    countOfLowerCase < 1 ||
                                    countOfUpperCase < 1 ||
                                    countOfSpecialChar < 1 ||
                                    countOfNumbers < 1
                                )
                                    checkPassComplexity.addIssue({
                                        code: "custom",
                                        message:
                                            "password does not meet complexity requirements",
                                    });
                                if (password !== confirmPassword)
                                    checkPassComplexity.addIssue({
                                        code: "custom",
                                        message: "passwords do not match",
                                    });
                            }
                        ),
                    "body to register a new user"
                ),
            },
            responses: {
                [HttpStatusCodes.OK]: jsonContent(
                    createSelectSchema(user),
                    "the registered user"
                ),
                [HttpStatusCodes.BAD_REQUEST]: jsonContent(
                    z.object({
                        message: z.string(),
                    }),
                    "failed to register new user"
                ),
            },
        }),
        async (c) => {
            const { email, password, name } = c.req.valid("json");
            const existingUser = await db.query.user.findFirst({
                where: (u, { eq }) => eq(u.email, email),
            });
            if (existingUser)
                return c.json(
                    {
                        message: "user already exists with the provided email",
                    },
                    HttpStatusCodes.BAD_REQUEST
                );

            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
            });

            if (error)
                return c.json(
                    {
                        message: `failed to register a new user: ${error.message}`,
                    },
                    HttpStatusCodes.BAD_REQUEST
                );

            return await db.query.user
                .findFirst({
                    where: (u, { eq }) => eq(u.id, data.user.id),
                })
                .then((registered) => c.json(registered, HttpStatusCodes.OK));
        }
    );

export const authExampleRouter = createRouter()
    .openapi(
        createRoute({
            tags: ["Auth"],
            method: "get",
            path: "/user",
            responses: {
                [HttpStatusCodes.OK]: jsonContent(
                    createSelectSchema(user),
                    "logged in user"
                ),
                [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
                    z.object({
                        message: z.string(),
                    }),
                    "user is not authenticated for this request"
                ),
            },
        }),
        async (c) => {
            const user = c.get("user");
            if (!user)
                return c.json(
                    {
                        message: "user is not authenticated for this route",
                    },
                    HttpStatusCodes.UNAUTHORIZED
                );

            return await db.query.user
                .findFirst({
                    where: (u, { eq }) => eq(u.id, user.id),
                })
                .then((dbUser) => c.json(dbUser, HttpStatusCodes.OK));
        }
    )
    .use(sessionMiddleware);

export default router;
