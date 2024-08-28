import pkg from 'pg';
const { Client } = pkg;

export async function getClient() {
    const client = new Client(process.env.DB_URL);
    await client.connect().then(()=> {
        console.log("DB connected");
    }).catch((err)=> {
        console.log("DB Error");
    })
    return client;
}