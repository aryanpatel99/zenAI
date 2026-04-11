"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = async () => {
    await authClient.signUp.email({
      email,
      password,
      name,
    },
      {
        onError: ({ error }) => {
          window.alert(error.message)
        },
        onSuccess: () => {
          window.alert("User created successfully")
        }
      }
    )

  }

  const onSignIn = async () => {
    await authClient.signIn.email({
      email,
      password,
    },
      {
        onError: ({ error }) => {
          window.alert(error.message)
        },
        onSuccess: () => {
          window.alert("User signed in successfully")
        }
      }
    )

  }


  const { data: session } = authClient.useSession()

  if (session?.user) {
    return (
      <div>
        <h1>Welcome {session.user.name}</h1>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    )
  }

  return (
    <div className="text-3xl p-4 gap-4">
      <div>

        <p>Sign Up</p>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onSubmit}>Submit</Button>
      </div>
      <div>

        <p>Sign In</p>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
}
