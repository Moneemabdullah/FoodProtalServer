export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
        requireEmailVerification: false;
    };
    trustedOrigins: string[];
}>;
export type Auth = typeof auth;
//# sourceMappingURL=auth.d.ts.map