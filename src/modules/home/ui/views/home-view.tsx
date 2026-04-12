"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";



export default function HomeView() {
    const router = useRouter()
  const {data:session} = authClient.useSession()

//   if(!session){
//     return (
//       <div>
//         Loading
//       </div>
//     )
//   } 
  return (
      <div>
        <h1>Logged in as {session?.user?.name}</h1>
        <Button onClick={() => authClient.signOut({fetchOptions:{
            onSuccess:() => {
                router.push('/sign-in')
            }
        }})}>Sign Out</Button>
      </div>
    )
}