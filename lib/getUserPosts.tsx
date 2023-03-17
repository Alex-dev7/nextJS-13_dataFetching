export default async function getUserPosts(userId: string){
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`, {next: {revalidate: 60}})// revalidate this req every 60 seconds

    if(!res.ok) undefined

    return res.json()
}