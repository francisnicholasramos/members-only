import {supabase} from "../db/client";
import {UserTypes, MessageType} from "../types/SchemaTypes";

export async function getAllUsers() {
    const {data, error} = await supabase
        .from("users")
        .select("id, username, privilege")

    if (error) console.log(error)
        
    return data || [];
}

export async function updateUserToken(id: number, token:string, expiresAt: Date) {
    const {data, error} = await supabase
        .from("users")
        .update({token: token, expires_at: expiresAt })
        .eq("id", id)
           
    if (error) console.log(error)

    return data;
}

export async function postNewUser(params: UserTypes) {
    const {data, error} = await supabase
        .from("users")
        .insert({
            username: params.username.toLowerCase(), 
            password: params.password, // table column: parameter.type_schema
            privilege: "user"
        })
    if (error) console.log(error)

    return data;
}

export async function postMessage(params: MessageType) {
    const {error} = await supabase 
        .from("messages")
        .insert({
            title: params.title,
            message: params.message,
            author_name: params.author
        })

    if (error) {
        console.log(error)
        return false;
    }

    return true;
}

export async function displayAllMessage(offset:number, limit:number) {
    const {data, error} = await supabase
        .from("messages")
        .select()
        .order('id', {ascending: false})
        .range(offset, offset + limit -1)

        // 
        // .single() return single object '{}' instead of '[{}]'
        //

        if (error) {
            console.log("Failed to display messages:", error)
            return;
        }

    return data || [];
}
// displayAllMessage().then((data) => console.log('displayAllMessage', data))

