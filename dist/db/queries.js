"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.updateUserToken = updateUserToken;
exports.postNewUser = postNewUser;
exports.postMessage = postMessage;
exports.displayAllMessage = displayAllMessage;
const client_1 = require("../db/client");
async function getAllUsers() {
    const { data, error } = await client_1.supabase
        .from("users")
        .select("id, username, privilege");
    if (error)
        console.log(error);
    return data || [];
}
async function updateUserToken(id, token, expiresAt) {
    const { data, error } = await client_1.supabase
        .from("users")
        .update({ token: token, expires_at: expiresAt })
        .eq("id", id);
    if (error)
        console.log(error);
    return data;
}
async function postNewUser(params) {
    const { data, error } = await client_1.supabase
        .from("users")
        .insert({
        username: params.username.toLowerCase(),
        password: params.password, // table column: parameter.type_schema
        privilege: "user"
    });
    if (error)
        console.log(error);
    return data;
}
async function postMessage(params) {
    const { error } = await client_1.supabase
        .from("messages")
        .insert({
        title: params.title,
        message: params.message,
        author_name: params.author
    });
    if (error) {
        console.log(error);
        return false;
    }
    return true;
}
async function displayAllMessage(offset, limit) {
    const { data, error } = await client_1.supabase
        .from("messages")
        .select()
        .order('id', { ascending: false })
        .range(offset, offset + limit - 1);
    // 
    // .single() return single object '{}' instead of '[{}]'
    //
    if (error) {
        console.log("Failed to display messages:", error);
        return;
    }
    return data || [];
}
// displayAllMessage().then((data) => console.log('displayAllMessage', data))
