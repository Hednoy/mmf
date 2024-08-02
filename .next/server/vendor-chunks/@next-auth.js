"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@next-auth";
exports.ids = ["vendor-chunks/@next-auth"];
exports.modules = {

/***/ "(rsc)/./node_modules/@next-auth/prisma-adapter/dist/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@next-auth/prisma-adapter/dist/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({\n    value: true\n}));\nexports.PrismaAdapter = void 0;\n/**\n * ## Setup\n *\n * Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object:\n *\n * ```js title=\"pages/api/auth/[...nextauth].js\"\n * import NextAuth from \"next-auth\"\n * import GoogleProvider from \"next-auth/providers/google\"\n * import { PrismaAdapter } from \"@next-auth/prisma-adapter\"\n * import { PrismaClient } from \"@prisma/client\"\n *\n * const prisma = new PrismaClient()\n *\n * export default NextAuth({\n *   adapter: PrismaAdapter(prisma),\n *   providers: [\n *     GoogleProvider({\n *       clientId: process.env.GOOGLE_CLIENT_ID,\n *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,\n *     }),\n *   ],\n * })\n * ```\n *\n * ### Create the Prisma schema from scratch\n *\n * You need to use at least Prisma 2.26.0. Create a schema file in `prisma/schema.prisma` similar to this one:\n *\n * > This schema is adapted for use in Prisma and based upon our main [schema](https://authjs.dev/reference/adapters#models)\n *\n * ```json title=\"schema.prisma\"\n * datasource db {\n *   provider = \"postgresql\"\n *   url      = env(\"DATABASE_URL\")\n *   shadowDatabaseUrl = env(\"SHADOW_DATABASE_URL\") // Only needed when using a cloud provider that doesn't support the creation of new databases, like Heroku. Learn more: https://pris.ly/d/migrate-shadow\n * }\n *\n * generator client {\n *   provider        = \"prisma-client-js\"\n *   previewFeatures = [\"referentialActions\"] // You won't need this in Prisma 3.X or higher.\n * }\n *\n * model Account {\n *   id                 String  @id @default(cuid())\n *   userId             String\n *   type               String\n *   provider           String\n *   providerAccountId  String\n *   refresh_token      String?  @db.Text\n *   access_token       String?  @db.Text\n *   expires_at         Int?\n *   token_type         String?\n *   scope              String?\n *   id_token           String?  @db.Text\n *   session_state      String?\n *\n *   user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n *\n *   @@unique([provider, providerAccountId])\n * }\n *\n * model Session {\n *   id           String   @id @default(cuid())\n *   sessionToken String   @unique\n *   userId       String\n *   expires      DateTime\n *   user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n * }\n *\n * model User {\n *   id            String    @id @default(cuid())\n *   name          String?\n *   email         String?   @unique\n *   emailVerified DateTime?\n *   image         String?\n *   accounts      Account[]\n *   sessions      Session[]\n * }\n *\n * model VerificationToken {\n *   identifier String\n *   token      String   @unique\n *   expires    DateTime\n *\n *   @@unique([identifier, token])\n * }\n * ```\n *\n * :::note\n * When using the MySQL connector for Prisma, the [Prisma `String` type](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#string) gets mapped to `varchar(191)` which may not be long enough to store fields such as `id_token` in the `Account` model. This can be avoided by explicitly using the `Text` type with `@db.Text`.\n * :::\n *\n *\n * ### Create the Prisma schema with `prisma migrate`\n *\n * This will create an SQL migration file and execute it:\n *\n * ```\n * npx prisma migrate dev\n * ```\n *\n * Note that you will need to specify your database connection string in the environment variable `DATABASE_URL`. You can do this by setting it in a `.env` file at the root of your project.\n *\n * To learn more about [Prisma Migrate](https://www.prisma.io/migrate), check out the [Migrate docs](https://www.prisma.io/docs/concepts/components/prisma-migrate).\n *\n * ### Generating the Prisma Client\n *\n * Once you have saved your schema, use the Prisma CLI to generate the Prisma Client:\n *\n * ```\n * npx prisma generate\n * ```\n *\n * To configure your database to use the new schema (i.e. create tables and columns) use the `prisma migrate` command:\n *\n * ```\n * npx prisma migrate dev\n * ```\n *\n * ### MongoDB support\n *\n * Prisma supports MongoDB, and so does Auth.js. Following the instructions of the [Prisma documentation](https://www.prisma.io/docs/concepts/database-connectors/mongodb) on the MongoDB connector, things you have to change are:\n *\n * 1. Make sure that the id fields are mapped correctly\n *\n * ```prisma\n * id  String  @id @default(auto()) @map(\"_id\") @db.ObjectId\n * ```\n *\n * 2. The Native database type attribute to `@db.String` from `@db.Text` and userId to `@db.ObjectId`.\n *\n * ```prisma\n * user_id            String   @db.ObjectId\n * refresh_token      String?  @db.String\n * access_token       String?  @db.String\n * id_token           String?  @db.String\n * ```\n *\n * Everything else should be the same.\n *\n * ### Naming Conventions\n *\n * If mixed snake_case and camelCase column names is an issue for you and/or your underlying database system, we recommend using Prisma's `@map()`([see the documentation here](https://www.prisma.io/docs/concepts/components/prisma-schema/names-in-underlying-database)) feature to change the field names. This won't affect Auth.js, but will allow you to customize the column names to whichever naming convention you wish.\n *\n * For example, moving to `snake_case` and plural table names.\n *\n * ```json title=\"schema.prisma\"\n * model Account {\n *   id                 String  @id @default(cuid())\n *   userId             String  @map(\"user_id\")\n *   type               String\n *   provider           String\n *   providerAccountId  String  @map(\"provider_account_id\")\n *   refresh_token      String? @db.Text\n *   access_token       String? @db.Text\n *   expires_at         Int?\n *   token_type         String?\n *   scope              String?\n *   id_token           String? @db.Text\n *   session_state      String?\n *\n *   user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n *\n *   @@unique([provider, providerAccountId])\n *   @@map(\"accounts\")\n * }\n *\n * model Session {\n *   id           String   @id @default(cuid())\n *   sessionToken String   @unique @map(\"session_token\")\n *   userId       String   @map(\"user_id\")\n *   expires      DateTime\n *   user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n *\n *   @@map(\"sessions\")\n * }\n *\n * model User {\n *   id            String    @id @default(cuid())\n *   name          String?\n *   email         String?   @unique\n *   emailVerified DateTime? @map(\"email_verified\")\n *   image         String?\n *   accounts      Account[]\n *   sessions      Session[]\n *\n *   @@map(\"users\")\n * }\n *\n * model VerificationToken {\n *   identifier String\n *   token      String   @unique\n *   expires    DateTime\n *\n *   @@unique([identifier, token])\n *   @@map(\"verificationtokens\")\n * }\n * ```\n *\n **/ function PrismaAdapter(p) {\n    return {\n        createUser: (data)=>p.user.create({\n                data\n            }),\n        getUser: (id)=>p.user.findUnique({\n                where: {\n                    id\n                }\n            }),\n        getUserByEmail: (email)=>p.user.findUnique({\n                where: {\n                    email\n                }\n            }),\n        async getUserByAccount (provider_providerAccountId) {\n            var _a;\n            const account = await p.account.findUnique({\n                where: {\n                    provider_providerAccountId\n                },\n                select: {\n                    user: true\n                }\n            });\n            return (_a = account === null || account === void 0 ? void 0 : account.user) !== null && _a !== void 0 ? _a : null;\n        },\n        updateUser: ({ id, ...data })=>p.user.update({\n                where: {\n                    id\n                },\n                data\n            }),\n        deleteUser: (id)=>p.user.delete({\n                where: {\n                    id\n                }\n            }),\n        linkAccount: (data)=>p.account.create({\n                data\n            }),\n        unlinkAccount: (provider_providerAccountId)=>p.account.delete({\n                where: {\n                    provider_providerAccountId\n                }\n            }),\n        async getSessionAndUser (sessionToken) {\n            const userAndSession = await p.session.findUnique({\n                where: {\n                    sessionToken\n                },\n                include: {\n                    user: true\n                }\n            });\n            if (!userAndSession) return null;\n            const { user, ...session } = userAndSession;\n            return {\n                user,\n                session\n            };\n        },\n        createSession: (data)=>p.session.create({\n                data\n            }),\n        updateSession: (data)=>p.session.update({\n                where: {\n                    sessionToken: data.sessionToken\n                },\n                data\n            }),\n        deleteSession: (sessionToken)=>p.session.delete({\n                where: {\n                    sessionToken\n                }\n            }),\n        async createVerificationToken (data) {\n            const verificationToken = await p.verificationToken.create({\n                data\n            });\n            // @ts-expect-errors // MongoDB needs an ID, but we don't\n            if (verificationToken.id) delete verificationToken.id;\n            return verificationToken;\n        },\n        async useVerificationToken (identifier_token) {\n            try {\n                const verificationToken = await p.verificationToken.delete({\n                    where: {\n                        identifier_token\n                    }\n                });\n                // @ts-expect-errors // MongoDB needs an ID, but we don't\n                if (verificationToken.id) delete verificationToken.id;\n                return verificationToken;\n            } catch (error) {\n                // If token already used/deleted, just return null\n                // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025\n                if (error.code === \"P2025\") return null;\n                throw error;\n            }\n        }\n    };\n}\nexports.PrismaAdapter = PrismaAdapter;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvQG5leHQtYXV0aC9wcmlzbWEtYWRhcHRlci9kaXN0L2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2JBLDhDQUE2QztJQUFFRyxPQUFPO0FBQUssQ0FBQyxFQUFDO0FBQzdERCxxQkFBcUIsR0FBRyxLQUFLO0FBQzdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBdU1FLEdBQ0YsU0FBU0UsY0FBY0MsQ0FBQztJQUNwQixPQUFPO1FBQ0hDLFlBQVksQ0FBQ0MsT0FBU0YsRUFBRUcsSUFBSSxDQUFDQyxNQUFNLENBQUM7Z0JBQUVGO1lBQUs7UUFDM0NHLFNBQVMsQ0FBQ0MsS0FBT04sRUFBRUcsSUFBSSxDQUFDSSxVQUFVLENBQUM7Z0JBQUVDLE9BQU87b0JBQUVGO2dCQUFHO1lBQUU7UUFDbkRHLGdCQUFnQixDQUFDQyxRQUFVVixFQUFFRyxJQUFJLENBQUNJLFVBQVUsQ0FBQztnQkFBRUMsT0FBTztvQkFBRUU7Z0JBQU07WUFBRTtRQUNoRSxNQUFNQyxrQkFBaUJDLDBCQUEwQjtZQUM3QyxJQUFJQztZQUNKLE1BQU1DLFVBQVUsTUFBTWQsRUFBRWMsT0FBTyxDQUFDUCxVQUFVLENBQUM7Z0JBQ3ZDQyxPQUFPO29CQUFFSTtnQkFBMkI7Z0JBQ3BDRyxRQUFRO29CQUFFWixNQUFNO2dCQUFLO1lBQ3pCO1lBQ0EsT0FBTyxDQUFDVSxLQUFLQyxZQUFZLFFBQVFBLFlBQVksS0FBSyxJQUFJLEtBQUssSUFBSUEsUUFBUVgsSUFBSSxNQUFNLFFBQVFVLE9BQU8sS0FBSyxJQUFJQSxLQUFLO1FBQ2xIO1FBQ0FHLFlBQVksQ0FBQyxFQUFFVixFQUFFLEVBQUUsR0FBR0osTUFBTSxHQUFLRixFQUFFRyxJQUFJLENBQUNjLE1BQU0sQ0FBQztnQkFBRVQsT0FBTztvQkFBRUY7Z0JBQUc7Z0JBQUdKO1lBQUs7UUFDckVnQixZQUFZLENBQUNaLEtBQU9OLEVBQUVHLElBQUksQ0FBQ2dCLE1BQU0sQ0FBQztnQkFBRVgsT0FBTztvQkFBRUY7Z0JBQUc7WUFBRTtRQUNsRGMsYUFBYSxDQUFDbEIsT0FBU0YsRUFBRWMsT0FBTyxDQUFDVixNQUFNLENBQUM7Z0JBQUVGO1lBQUs7UUFDL0NtQixlQUFlLENBQUNULDZCQUErQlosRUFBRWMsT0FBTyxDQUFDSyxNQUFNLENBQUM7Z0JBQzVEWCxPQUFPO29CQUFFSTtnQkFBMkI7WUFDeEM7UUFDQSxNQUFNVSxtQkFBa0JDLFlBQVk7WUFDaEMsTUFBTUMsaUJBQWlCLE1BQU14QixFQUFFeUIsT0FBTyxDQUFDbEIsVUFBVSxDQUFDO2dCQUM5Q0MsT0FBTztvQkFBRWU7Z0JBQWE7Z0JBQ3RCRyxTQUFTO29CQUFFdkIsTUFBTTtnQkFBSztZQUMxQjtZQUNBLElBQUksQ0FBQ3FCLGdCQUNELE9BQU87WUFDWCxNQUFNLEVBQUVyQixJQUFJLEVBQUUsR0FBR3NCLFNBQVMsR0FBR0Q7WUFDN0IsT0FBTztnQkFBRXJCO2dCQUFNc0I7WUFBUTtRQUMzQjtRQUNBRSxlQUFlLENBQUN6QixPQUFTRixFQUFFeUIsT0FBTyxDQUFDckIsTUFBTSxDQUFDO2dCQUFFRjtZQUFLO1FBQ2pEMEIsZUFBZSxDQUFDMUIsT0FBU0YsRUFBRXlCLE9BQU8sQ0FBQ1IsTUFBTSxDQUFDO2dCQUFFVCxPQUFPO29CQUFFZSxjQUFjckIsS0FBS3FCLFlBQVk7Z0JBQUM7Z0JBQUdyQjtZQUFLO1FBQzdGMkIsZUFBZSxDQUFDTixlQUFpQnZCLEVBQUV5QixPQUFPLENBQUNOLE1BQU0sQ0FBQztnQkFBRVgsT0FBTztvQkFBRWU7Z0JBQWE7WUFBRTtRQUM1RSxNQUFNTyx5QkFBd0I1QixJQUFJO1lBQzlCLE1BQU02QixvQkFBb0IsTUFBTS9CLEVBQUUrQixpQkFBaUIsQ0FBQzNCLE1BQU0sQ0FBQztnQkFBRUY7WUFBSztZQUNsRSx5REFBeUQ7WUFDekQsSUFBSTZCLGtCQUFrQnpCLEVBQUUsRUFDcEIsT0FBT3lCLGtCQUFrQnpCLEVBQUU7WUFDL0IsT0FBT3lCO1FBQ1g7UUFDQSxNQUFNQyxzQkFBcUJDLGdCQUFnQjtZQUN2QyxJQUFJO2dCQUNBLE1BQU1GLG9CQUFvQixNQUFNL0IsRUFBRStCLGlCQUFpQixDQUFDWixNQUFNLENBQUM7b0JBQ3ZEWCxPQUFPO3dCQUFFeUI7b0JBQWlCO2dCQUM5QjtnQkFDQSx5REFBeUQ7Z0JBQ3pELElBQUlGLGtCQUFrQnpCLEVBQUUsRUFDcEIsT0FBT3lCLGtCQUFrQnpCLEVBQUU7Z0JBQy9CLE9BQU95QjtZQUNYLEVBQ0EsT0FBT0csT0FBTztnQkFDVixrREFBa0Q7Z0JBQ2xELDJFQUEyRTtnQkFDM0UsSUFBSUEsTUFBTUMsSUFBSSxLQUFLLFNBQ2YsT0FBTztnQkFDWCxNQUFNRDtZQUNWO1FBQ0o7SUFDSjtBQUNKO0FBQ0FyQyxxQkFBcUIsR0FBR0UiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9waXJ1bnJhai8uL25vZGVfbW9kdWxlcy9AbmV4dC1hdXRoL3ByaXNtYS1hZGFwdGVyL2Rpc3QvaW5kZXguanM/MzFhOCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUHJpc21hQWRhcHRlciA9IHZvaWQgMDtcbi8qKlxuICogIyMgU2V0dXBcbiAqXG4gKiBBZGQgdGhpcyBhZGFwdGVyIHRvIHlvdXIgYHBhZ2VzL2FwaS9bLi4ubmV4dGF1dGhdLmpzYCBuZXh0LWF1dGggY29uZmlndXJhdGlvbiBvYmplY3Q6XG4gKlxuICogYGBganMgdGl0bGU9XCJwYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLmpzXCJcbiAqIGltcG9ydCBOZXh0QXV0aCBmcm9tIFwibmV4dC1hdXRoXCJcbiAqIGltcG9ydCBHb29nbGVQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9nb29nbGVcIlxuICogaW1wb3J0IHsgUHJpc21hQWRhcHRlciB9IGZyb20gXCJAbmV4dC1hdXRoL3ByaXNtYS1hZGFwdGVyXCJcbiAqIGltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiXG4gKlxuICogY29uc3QgcHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpXG4gKlxuICogZXhwb3J0IGRlZmF1bHQgTmV4dEF1dGgoe1xuICogICBhZGFwdGVyOiBQcmlzbWFBZGFwdGVyKHByaXNtYSksXG4gKiAgIHByb3ZpZGVyczogW1xuICogICAgIEdvb2dsZVByb3ZpZGVyKHtcbiAqICAgICAgIGNsaWVudElkOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lELFxuICogICAgICAgY2xpZW50U2VjcmV0OiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX1NFQ1JFVCxcbiAqICAgICB9KSxcbiAqICAgXSxcbiAqIH0pXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ3JlYXRlIHRoZSBQcmlzbWEgc2NoZW1hIGZyb20gc2NyYXRjaFxuICpcbiAqIFlvdSBuZWVkIHRvIHVzZSBhdCBsZWFzdCBQcmlzbWEgMi4yNi4wLiBDcmVhdGUgYSBzY2hlbWEgZmlsZSBpbiBgcHJpc21hL3NjaGVtYS5wcmlzbWFgIHNpbWlsYXIgdG8gdGhpcyBvbmU6XG4gKlxuICogPiBUaGlzIHNjaGVtYSBpcyBhZGFwdGVkIGZvciB1c2UgaW4gUHJpc21hIGFuZCBiYXNlZCB1cG9uIG91ciBtYWluIFtzY2hlbWFdKGh0dHBzOi8vYXV0aGpzLmRldi9yZWZlcmVuY2UvYWRhcHRlcnMjbW9kZWxzKVxuICpcbiAqIGBgYGpzb24gdGl0bGU9XCJzY2hlbWEucHJpc21hXCJcbiAqIGRhdGFzb3VyY2UgZGIge1xuICogICBwcm92aWRlciA9IFwicG9zdGdyZXNxbFwiXG4gKiAgIHVybCAgICAgID0gZW52KFwiREFUQUJBU0VfVVJMXCIpXG4gKiAgIHNoYWRvd0RhdGFiYXNlVXJsID0gZW52KFwiU0hBRE9XX0RBVEFCQVNFX1VSTFwiKSAvLyBPbmx5IG5lZWRlZCB3aGVuIHVzaW5nIGEgY2xvdWQgcHJvdmlkZXIgdGhhdCBkb2Vzbid0IHN1cHBvcnQgdGhlIGNyZWF0aW9uIG9mIG5ldyBkYXRhYmFzZXMsIGxpa2UgSGVyb2t1LiBMZWFybiBtb3JlOiBodHRwczovL3ByaXMubHkvZC9taWdyYXRlLXNoYWRvd1xuICogfVxuICpcbiAqIGdlbmVyYXRvciBjbGllbnQge1xuICogICBwcm92aWRlciAgICAgICAgPSBcInByaXNtYS1jbGllbnQtanNcIlxuICogICBwcmV2aWV3RmVhdHVyZXMgPSBbXCJyZWZlcmVudGlhbEFjdGlvbnNcIl0gLy8gWW91IHdvbid0IG5lZWQgdGhpcyBpbiBQcmlzbWEgMy5YIG9yIGhpZ2hlci5cbiAqIH1cbiAqXG4gKiBtb2RlbCBBY2NvdW50IHtcbiAqICAgaWQgICAgICAgICAgICAgICAgIFN0cmluZyAgQGlkIEBkZWZhdWx0KGN1aWQoKSlcbiAqICAgdXNlcklkICAgICAgICAgICAgIFN0cmluZ1xuICogICB0eXBlICAgICAgICAgICAgICAgU3RyaW5nXG4gKiAgIHByb3ZpZGVyICAgICAgICAgICBTdHJpbmdcbiAqICAgcHJvdmlkZXJBY2NvdW50SWQgIFN0cmluZ1xuICogICByZWZyZXNoX3Rva2VuICAgICAgU3RyaW5nPyAgQGRiLlRleHRcbiAqICAgYWNjZXNzX3Rva2VuICAgICAgIFN0cmluZz8gIEBkYi5UZXh0XG4gKiAgIGV4cGlyZXNfYXQgICAgICAgICBJbnQ/XG4gKiAgIHRva2VuX3R5cGUgICAgICAgICBTdHJpbmc/XG4gKiAgIHNjb3BlICAgICAgICAgICAgICBTdHJpbmc/XG4gKiAgIGlkX3Rva2VuICAgICAgICAgICBTdHJpbmc/ICBAZGIuVGV4dFxuICogICBzZXNzaW9uX3N0YXRlICAgICAgU3RyaW5nP1xuICpcbiAqICAgdXNlciBVc2VyIEByZWxhdGlvbihmaWVsZHM6IFt1c2VySWRdLCByZWZlcmVuY2VzOiBbaWRdLCBvbkRlbGV0ZTogQ2FzY2FkZSlcbiAqXG4gKiAgIEBAdW5pcXVlKFtwcm92aWRlciwgcHJvdmlkZXJBY2NvdW50SWRdKVxuICogfVxuICpcbiAqIG1vZGVsIFNlc3Npb24ge1xuICogICBpZCAgICAgICAgICAgU3RyaW5nICAgQGlkIEBkZWZhdWx0KGN1aWQoKSlcbiAqICAgc2Vzc2lvblRva2VuIFN0cmluZyAgIEB1bmlxdWVcbiAqICAgdXNlcklkICAgICAgIFN0cmluZ1xuICogICBleHBpcmVzICAgICAgRGF0ZVRpbWVcbiAqICAgdXNlciAgICAgICAgIFVzZXIgICAgIEByZWxhdGlvbihmaWVsZHM6IFt1c2VySWRdLCByZWZlcmVuY2VzOiBbaWRdLCBvbkRlbGV0ZTogQ2FzY2FkZSlcbiAqIH1cbiAqXG4gKiBtb2RlbCBVc2VyIHtcbiAqICAgaWQgICAgICAgICAgICBTdHJpbmcgICAgQGlkIEBkZWZhdWx0KGN1aWQoKSlcbiAqICAgbmFtZSAgICAgICAgICBTdHJpbmc/XG4gKiAgIGVtYWlsICAgICAgICAgU3RyaW5nPyAgIEB1bmlxdWVcbiAqICAgZW1haWxWZXJpZmllZCBEYXRlVGltZT9cbiAqICAgaW1hZ2UgICAgICAgICBTdHJpbmc/XG4gKiAgIGFjY291bnRzICAgICAgQWNjb3VudFtdXG4gKiAgIHNlc3Npb25zICAgICAgU2Vzc2lvbltdXG4gKiB9XG4gKlxuICogbW9kZWwgVmVyaWZpY2F0aW9uVG9rZW4ge1xuICogICBpZGVudGlmaWVyIFN0cmluZ1xuICogICB0b2tlbiAgICAgIFN0cmluZyAgIEB1bmlxdWVcbiAqICAgZXhwaXJlcyAgICBEYXRlVGltZVxuICpcbiAqICAgQEB1bmlxdWUoW2lkZW50aWZpZXIsIHRva2VuXSlcbiAqIH1cbiAqIGBgYFxuICpcbiAqIDo6Om5vdGVcbiAqIFdoZW4gdXNpbmcgdGhlIE15U1FMIGNvbm5lY3RvciBmb3IgUHJpc21hLCB0aGUgW1ByaXNtYSBgU3RyaW5nYCB0eXBlXShodHRwczovL3d3dy5wcmlzbWEuaW8vZG9jcy9yZWZlcmVuY2UvYXBpLXJlZmVyZW5jZS9wcmlzbWEtc2NoZW1hLXJlZmVyZW5jZSNzdHJpbmcpIGdldHMgbWFwcGVkIHRvIGB2YXJjaGFyKDE5MSlgIHdoaWNoIG1heSBub3QgYmUgbG9uZyBlbm91Z2ggdG8gc3RvcmUgZmllbGRzIHN1Y2ggYXMgYGlkX3Rva2VuYCBpbiB0aGUgYEFjY291bnRgIG1vZGVsLiBUaGlzIGNhbiBiZSBhdm9pZGVkIGJ5IGV4cGxpY2l0bHkgdXNpbmcgdGhlIGBUZXh0YCB0eXBlIHdpdGggYEBkYi5UZXh0YC5cbiAqIDo6OlxuICpcbiAqXG4gKiAjIyMgQ3JlYXRlIHRoZSBQcmlzbWEgc2NoZW1hIHdpdGggYHByaXNtYSBtaWdyYXRlYFxuICpcbiAqIFRoaXMgd2lsbCBjcmVhdGUgYW4gU1FMIG1pZ3JhdGlvbiBmaWxlIGFuZCBleGVjdXRlIGl0OlxuICpcbiAqIGBgYFxuICogbnB4IHByaXNtYSBtaWdyYXRlIGRldlxuICogYGBgXG4gKlxuICogTm90ZSB0aGF0IHlvdSB3aWxsIG5lZWQgdG8gc3BlY2lmeSB5b3VyIGRhdGFiYXNlIGNvbm5lY3Rpb24gc3RyaW5nIGluIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSBgREFUQUJBU0VfVVJMYC4gWW91IGNhbiBkbyB0aGlzIGJ5IHNldHRpbmcgaXQgaW4gYSBgLmVudmAgZmlsZSBhdCB0aGUgcm9vdCBvZiB5b3VyIHByb2plY3QuXG4gKlxuICogVG8gbGVhcm4gbW9yZSBhYm91dCBbUHJpc21hIE1pZ3JhdGVdKGh0dHBzOi8vd3d3LnByaXNtYS5pby9taWdyYXRlKSwgY2hlY2sgb3V0IHRoZSBbTWlncmF0ZSBkb2NzXShodHRwczovL3d3dy5wcmlzbWEuaW8vZG9jcy9jb25jZXB0cy9jb21wb25lbnRzL3ByaXNtYS1taWdyYXRlKS5cbiAqXG4gKiAjIyMgR2VuZXJhdGluZyB0aGUgUHJpc21hIENsaWVudFxuICpcbiAqIE9uY2UgeW91IGhhdmUgc2F2ZWQgeW91ciBzY2hlbWEsIHVzZSB0aGUgUHJpc21hIENMSSB0byBnZW5lcmF0ZSB0aGUgUHJpc21hIENsaWVudDpcbiAqXG4gKiBgYGBcbiAqIG5weCBwcmlzbWEgZ2VuZXJhdGVcbiAqIGBgYFxuICpcbiAqIFRvIGNvbmZpZ3VyZSB5b3VyIGRhdGFiYXNlIHRvIHVzZSB0aGUgbmV3IHNjaGVtYSAoaS5lLiBjcmVhdGUgdGFibGVzIGFuZCBjb2x1bW5zKSB1c2UgdGhlIGBwcmlzbWEgbWlncmF0ZWAgY29tbWFuZDpcbiAqXG4gKiBgYGBcbiAqIG5weCBwcmlzbWEgbWlncmF0ZSBkZXZcbiAqIGBgYFxuICpcbiAqICMjIyBNb25nb0RCIHN1cHBvcnRcbiAqXG4gKiBQcmlzbWEgc3VwcG9ydHMgTW9uZ29EQiwgYW5kIHNvIGRvZXMgQXV0aC5qcy4gRm9sbG93aW5nIHRoZSBpbnN0cnVjdGlvbnMgb2YgdGhlIFtQcmlzbWEgZG9jdW1lbnRhdGlvbl0oaHR0cHM6Ly93d3cucHJpc21hLmlvL2RvY3MvY29uY2VwdHMvZGF0YWJhc2UtY29ubmVjdG9ycy9tb25nb2RiKSBvbiB0aGUgTW9uZ29EQiBjb25uZWN0b3IsIHRoaW5ncyB5b3UgaGF2ZSB0byBjaGFuZ2UgYXJlOlxuICpcbiAqIDEuIE1ha2Ugc3VyZSB0aGF0IHRoZSBpZCBmaWVsZHMgYXJlIG1hcHBlZCBjb3JyZWN0bHlcbiAqXG4gKiBgYGBwcmlzbWFcbiAqIGlkICBTdHJpbmcgIEBpZCBAZGVmYXVsdChhdXRvKCkpIEBtYXAoXCJfaWRcIikgQGRiLk9iamVjdElkXG4gKiBgYGBcbiAqXG4gKiAyLiBUaGUgTmF0aXZlIGRhdGFiYXNlIHR5cGUgYXR0cmlidXRlIHRvIGBAZGIuU3RyaW5nYCBmcm9tIGBAZGIuVGV4dGAgYW5kIHVzZXJJZCB0byBgQGRiLk9iamVjdElkYC5cbiAqXG4gKiBgYGBwcmlzbWFcbiAqIHVzZXJfaWQgICAgICAgICAgICBTdHJpbmcgICBAZGIuT2JqZWN0SWRcbiAqIHJlZnJlc2hfdG9rZW4gICAgICBTdHJpbmc/ICBAZGIuU3RyaW5nXG4gKiBhY2Nlc3NfdG9rZW4gICAgICAgU3RyaW5nPyAgQGRiLlN0cmluZ1xuICogaWRfdG9rZW4gICAgICAgICAgIFN0cmluZz8gIEBkYi5TdHJpbmdcbiAqIGBgYFxuICpcbiAqIEV2ZXJ5dGhpbmcgZWxzZSBzaG91bGQgYmUgdGhlIHNhbWUuXG4gKlxuICogIyMjIE5hbWluZyBDb252ZW50aW9uc1xuICpcbiAqIElmIG1peGVkIHNuYWtlX2Nhc2UgYW5kIGNhbWVsQ2FzZSBjb2x1bW4gbmFtZXMgaXMgYW4gaXNzdWUgZm9yIHlvdSBhbmQvb3IgeW91ciB1bmRlcmx5aW5nIGRhdGFiYXNlIHN5c3RlbSwgd2UgcmVjb21tZW5kIHVzaW5nIFByaXNtYSdzIGBAbWFwKClgKFtzZWUgdGhlIGRvY3VtZW50YXRpb24gaGVyZV0oaHR0cHM6Ly93d3cucHJpc21hLmlvL2RvY3MvY29uY2VwdHMvY29tcG9uZW50cy9wcmlzbWEtc2NoZW1hL25hbWVzLWluLXVuZGVybHlpbmctZGF0YWJhc2UpKSBmZWF0dXJlIHRvIGNoYW5nZSB0aGUgZmllbGQgbmFtZXMuIFRoaXMgd29uJ3QgYWZmZWN0IEF1dGguanMsIGJ1dCB3aWxsIGFsbG93IHlvdSB0byBjdXN0b21pemUgdGhlIGNvbHVtbiBuYW1lcyB0byB3aGljaGV2ZXIgbmFtaW5nIGNvbnZlbnRpb24geW91IHdpc2guXG4gKlxuICogRm9yIGV4YW1wbGUsIG1vdmluZyB0byBgc25ha2VfY2FzZWAgYW5kIHBsdXJhbCB0YWJsZSBuYW1lcy5cbiAqXG4gKiBgYGBqc29uIHRpdGxlPVwic2NoZW1hLnByaXNtYVwiXG4gKiBtb2RlbCBBY2NvdW50IHtcbiAqICAgaWQgICAgICAgICAgICAgICAgIFN0cmluZyAgQGlkIEBkZWZhdWx0KGN1aWQoKSlcbiAqICAgdXNlcklkICAgICAgICAgICAgIFN0cmluZyAgQG1hcChcInVzZXJfaWRcIilcbiAqICAgdHlwZSAgICAgICAgICAgICAgIFN0cmluZ1xuICogICBwcm92aWRlciAgICAgICAgICAgU3RyaW5nXG4gKiAgIHByb3ZpZGVyQWNjb3VudElkICBTdHJpbmcgIEBtYXAoXCJwcm92aWRlcl9hY2NvdW50X2lkXCIpXG4gKiAgIHJlZnJlc2hfdG9rZW4gICAgICBTdHJpbmc/IEBkYi5UZXh0XG4gKiAgIGFjY2Vzc190b2tlbiAgICAgICBTdHJpbmc/IEBkYi5UZXh0XG4gKiAgIGV4cGlyZXNfYXQgICAgICAgICBJbnQ/XG4gKiAgIHRva2VuX3R5cGUgICAgICAgICBTdHJpbmc/XG4gKiAgIHNjb3BlICAgICAgICAgICAgICBTdHJpbmc/XG4gKiAgIGlkX3Rva2VuICAgICAgICAgICBTdHJpbmc/IEBkYi5UZXh0XG4gKiAgIHNlc3Npb25fc3RhdGUgICAgICBTdHJpbmc/XG4gKlxuICogICB1c2VyIFVzZXIgQHJlbGF0aW9uKGZpZWxkczogW3VzZXJJZF0sIHJlZmVyZW5jZXM6IFtpZF0sIG9uRGVsZXRlOiBDYXNjYWRlKVxuICpcbiAqICAgQEB1bmlxdWUoW3Byb3ZpZGVyLCBwcm92aWRlckFjY291bnRJZF0pXG4gKiAgIEBAbWFwKFwiYWNjb3VudHNcIilcbiAqIH1cbiAqXG4gKiBtb2RlbCBTZXNzaW9uIHtcbiAqICAgaWQgICAgICAgICAgIFN0cmluZyAgIEBpZCBAZGVmYXVsdChjdWlkKCkpXG4gKiAgIHNlc3Npb25Ub2tlbiBTdHJpbmcgICBAdW5pcXVlIEBtYXAoXCJzZXNzaW9uX3Rva2VuXCIpXG4gKiAgIHVzZXJJZCAgICAgICBTdHJpbmcgICBAbWFwKFwidXNlcl9pZFwiKVxuICogICBleHBpcmVzICAgICAgRGF0ZVRpbWVcbiAqICAgdXNlciAgICAgICAgIFVzZXIgICAgIEByZWxhdGlvbihmaWVsZHM6IFt1c2VySWRdLCByZWZlcmVuY2VzOiBbaWRdLCBvbkRlbGV0ZTogQ2FzY2FkZSlcbiAqXG4gKiAgIEBAbWFwKFwic2Vzc2lvbnNcIilcbiAqIH1cbiAqXG4gKiBtb2RlbCBVc2VyIHtcbiAqICAgaWQgICAgICAgICAgICBTdHJpbmcgICAgQGlkIEBkZWZhdWx0KGN1aWQoKSlcbiAqICAgbmFtZSAgICAgICAgICBTdHJpbmc/XG4gKiAgIGVtYWlsICAgICAgICAgU3RyaW5nPyAgIEB1bmlxdWVcbiAqICAgZW1haWxWZXJpZmllZCBEYXRlVGltZT8gQG1hcChcImVtYWlsX3ZlcmlmaWVkXCIpXG4gKiAgIGltYWdlICAgICAgICAgU3RyaW5nP1xuICogICBhY2NvdW50cyAgICAgIEFjY291bnRbXVxuICogICBzZXNzaW9ucyAgICAgIFNlc3Npb25bXVxuICpcbiAqICAgQEBtYXAoXCJ1c2Vyc1wiKVxuICogfVxuICpcbiAqIG1vZGVsIFZlcmlmaWNhdGlvblRva2VuIHtcbiAqICAgaWRlbnRpZmllciBTdHJpbmdcbiAqICAgdG9rZW4gICAgICBTdHJpbmcgICBAdW5pcXVlXG4gKiAgIGV4cGlyZXMgICAgRGF0ZVRpbWVcbiAqXG4gKiAgIEBAdW5pcXVlKFtpZGVudGlmaWVyLCB0b2tlbl0pXG4gKiAgIEBAbWFwKFwidmVyaWZpY2F0aW9udG9rZW5zXCIpXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiovXG5mdW5jdGlvbiBQcmlzbWFBZGFwdGVyKHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGVVc2VyOiAoZGF0YSkgPT4gcC51c2VyLmNyZWF0ZSh7IGRhdGEgfSksXG4gICAgICAgIGdldFVzZXI6IChpZCkgPT4gcC51c2VyLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZCB9IH0pLFxuICAgICAgICBnZXRVc2VyQnlFbWFpbDogKGVtYWlsKSA9PiBwLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsIH0gfSksXG4gICAgICAgIGFzeW5jIGdldFVzZXJCeUFjY291bnQocHJvdmlkZXJfcHJvdmlkZXJBY2NvdW50SWQpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBwLmFjY291bnQuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgICAgICAgd2hlcmU6IHsgcHJvdmlkZXJfcHJvdmlkZXJBY2NvdW50SWQgfSxcbiAgICAgICAgICAgICAgICBzZWxlY3Q6IHsgdXNlcjogdHJ1ZSB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gKF9hID0gYWNjb3VudCA9PT0gbnVsbCB8fCBhY2NvdW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBhY2NvdW50LnVzZXIpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZVVzZXI6ICh7IGlkLCAuLi5kYXRhIH0pID0+IHAudXNlci51cGRhdGUoeyB3aGVyZTogeyBpZCB9LCBkYXRhIH0pLFxuICAgICAgICBkZWxldGVVc2VyOiAoaWQpID0+IHAudXNlci5kZWxldGUoeyB3aGVyZTogeyBpZCB9IH0pLFxuICAgICAgICBsaW5rQWNjb3VudDogKGRhdGEpID0+IHAuYWNjb3VudC5jcmVhdGUoeyBkYXRhIH0pLFxuICAgICAgICB1bmxpbmtBY2NvdW50OiAocHJvdmlkZXJfcHJvdmlkZXJBY2NvdW50SWQpID0+IHAuYWNjb3VudC5kZWxldGUoe1xuICAgICAgICAgICAgd2hlcmU6IHsgcHJvdmlkZXJfcHJvdmlkZXJBY2NvdW50SWQgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGFzeW5jIGdldFNlc3Npb25BbmRVc2VyKHNlc3Npb25Ub2tlbikge1xuICAgICAgICAgICAgY29uc3QgdXNlckFuZFNlc3Npb24gPSBhd2FpdCBwLnNlc3Npb24uZmluZFVuaXF1ZSh7XG4gICAgICAgICAgICAgICAgd2hlcmU6IHsgc2Vzc2lvblRva2VuIH0sXG4gICAgICAgICAgICAgICAgaW5jbHVkZTogeyB1c2VyOiB0cnVlIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghdXNlckFuZFNlc3Npb24pXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb25zdCB7IHVzZXIsIC4uLnNlc3Npb24gfSA9IHVzZXJBbmRTZXNzaW9uO1xuICAgICAgICAgICAgcmV0dXJuIHsgdXNlciwgc2Vzc2lvbiB9O1xuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVTZXNzaW9uOiAoZGF0YSkgPT4gcC5zZXNzaW9uLmNyZWF0ZSh7IGRhdGEgfSksXG4gICAgICAgIHVwZGF0ZVNlc3Npb246IChkYXRhKSA9PiBwLnNlc3Npb24udXBkYXRlKHsgd2hlcmU6IHsgc2Vzc2lvblRva2VuOiBkYXRhLnNlc3Npb25Ub2tlbiB9LCBkYXRhIH0pLFxuICAgICAgICBkZWxldGVTZXNzaW9uOiAoc2Vzc2lvblRva2VuKSA9PiBwLnNlc3Npb24uZGVsZXRlKHsgd2hlcmU6IHsgc2Vzc2lvblRva2VuIH0gfSksXG4gICAgICAgIGFzeW5jIGNyZWF0ZVZlcmlmaWNhdGlvblRva2VuKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IHZlcmlmaWNhdGlvblRva2VuID0gYXdhaXQgcC52ZXJpZmljYXRpb25Ub2tlbi5jcmVhdGUoeyBkYXRhIH0pO1xuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvcnMgLy8gTW9uZ29EQiBuZWVkcyBhbiBJRCwgYnV0IHdlIGRvbid0XG4gICAgICAgICAgICBpZiAodmVyaWZpY2F0aW9uVG9rZW4uaWQpXG4gICAgICAgICAgICAgICAgZGVsZXRlIHZlcmlmaWNhdGlvblRva2VuLmlkO1xuICAgICAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvblRva2VuO1xuICAgICAgICB9LFxuICAgICAgICBhc3luYyB1c2VWZXJpZmljYXRpb25Ub2tlbihpZGVudGlmaWVyX3Rva2VuKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZlcmlmaWNhdGlvblRva2VuID0gYXdhaXQgcC52ZXJpZmljYXRpb25Ub2tlbi5kZWxldGUoe1xuICAgICAgICAgICAgICAgICAgICB3aGVyZTogeyBpZGVudGlmaWVyX3Rva2VuIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvcnMgLy8gTW9uZ29EQiBuZWVkcyBhbiBJRCwgYnV0IHdlIGRvbid0XG4gICAgICAgICAgICAgICAgaWYgKHZlcmlmaWNhdGlvblRva2VuLmlkKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmVyaWZpY2F0aW9uVG9rZW4uaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZlcmlmaWNhdGlvblRva2VuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdG9rZW4gYWxyZWFkeSB1c2VkL2RlbGV0ZWQsIGp1c3QgcmV0dXJuIG51bGxcbiAgICAgICAgICAgICAgICAvLyBodHRwczovL3d3dy5wcmlzbWEuaW8vZG9jcy9yZWZlcmVuY2UvYXBpLXJlZmVyZW5jZS9lcnJvci1yZWZlcmVuY2UjcDIwMjVcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IuY29kZSA9PT0gXCJQMjAyNVwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuZXhwb3J0cy5QcmlzbWFBZGFwdGVyID0gUHJpc21hQWRhcHRlcjtcbiJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsIlByaXNtYUFkYXB0ZXIiLCJwIiwiY3JlYXRlVXNlciIsImRhdGEiLCJ1c2VyIiwiY3JlYXRlIiwiZ2V0VXNlciIsImlkIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiZ2V0VXNlckJ5RW1haWwiLCJlbWFpbCIsImdldFVzZXJCeUFjY291bnQiLCJwcm92aWRlcl9wcm92aWRlckFjY291bnRJZCIsIl9hIiwiYWNjb3VudCIsInNlbGVjdCIsInVwZGF0ZVVzZXIiLCJ1cGRhdGUiLCJkZWxldGVVc2VyIiwiZGVsZXRlIiwibGlua0FjY291bnQiLCJ1bmxpbmtBY2NvdW50IiwiZ2V0U2Vzc2lvbkFuZFVzZXIiLCJzZXNzaW9uVG9rZW4iLCJ1c2VyQW5kU2Vzc2lvbiIsInNlc3Npb24iLCJpbmNsdWRlIiwiY3JlYXRlU2Vzc2lvbiIsInVwZGF0ZVNlc3Npb24iLCJkZWxldGVTZXNzaW9uIiwiY3JlYXRlVmVyaWZpY2F0aW9uVG9rZW4iLCJ2ZXJpZmljYXRpb25Ub2tlbiIsInVzZVZlcmlmaWNhdGlvblRva2VuIiwiaWRlbnRpZmllcl90b2tlbiIsImVycm9yIiwiY29kZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/@next-auth/prisma-adapter/dist/index.js\n");

/***/ })

};
;