import passport from "passport"; 
import bcrypt from "bcrypt";
import {Strategy as LocalStrategy} from "passport-local";
import {supabase} from "../db/client";

passport.use(
    new LocalStrategy(
        async (username, password, done) => { // first two parameters should be the same to input 'name' attribute
        try {
            const {data: user, error } = await supabase 
                .from("users")
                .select()
                .eq("username", username)
                .maybeSingle()

            if (error) {
                return done(error)
            }

            if (!user) {
                return done(null, false, {message: "Username or password is incorrect."}) 
            }

            const match = await bcrypt.compare(password, user.password);
            
            if (!match) {
                return done(null, false, {message: "Username or password is incorrect."})
            }

            return done(null, user)
        } catch (error) {
            done(error);
        }
    })
);

passport.serializeUser((user: any, done) => {
    console.log("serializeUser", user.id);
    done(null, user.id)
})

passport.deserializeUser(async (id: number, done) => {
    console.log("deserializeUser", id);
    try {
        const { data: user, error } = await supabase
        .from("users")
        .select()
        .eq("id", id)
        .single();

        if (error || !user) {
            return done(error || new Error("User not found"), null);
        }

        done(null, user); 
    } catch (error) {
        done(error);
    }
});

export default passport;
