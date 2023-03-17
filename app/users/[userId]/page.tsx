import getUser from "@/lib/getUser"
import getUserPosts from "@/lib/getUserPosts"
import getAllUsers from "@/lib/getAllUsers"
import { Metadata } from "next"
import { Suspense } from "react"
import UserPosts from "./components/UserPosts"

// 404 page
import { notFound } from "next/navigation"


type Params = {
    params: {
        userId: string
    }
}
// adding metadata to each user's page
export  async function generateMetadata({params: {userId}}: Params): Promise<Metadata> {
    const userData: Promise<User> = getUser(userId)
    const user: User = await userData

    if(!user.name){
        return {
            title: "User Not Found"
        }
    }

    return {
        title: user.name,
        description: `This is the page of ${user.name}`
    }
}


export default async function UserPage({params: {userId}}: Params){
    //request the data in parallel , starting the request at the same time
    const userData: Promise<User> = getUser(userId)
    const userPostsData: Promise<Post[]> = getUserPosts(userId)
    // this will resolve in parallel ---- option 1
    // const [user, userPosts] = await Promise.all([userData, userPostsData])

    // option 2
    const user = await userData

    if(!user.name) return notFound()

    return (
        <>
            <h2>{user.name}</h2>
            <br/>
            <Suspense fallback={<h2>Loading ...</h2>}>
                {/* @ts-expect-error Async Server Component */}
                <UserPosts promise={userPostsData} />
            </Suspense>
            
        </>
    )
}

export async function generateStaticParams(){
    const usersData: Promise<User[]> = getAllUsers()
    const users = await usersData

    return users.map(user => ({
        userId: user.id.toString() 
    }))
}