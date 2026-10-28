import {createAuthClient} from "better-auth/react";
import {inferAdditionalFields} from "better-auth/client/plugins";
import type {auth} from "@/lib/auth";

export const {useSession, signIn, signOut} = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
});

export function signInWithDiscord() {
    return signIn.social({provider: "discord"});
}
