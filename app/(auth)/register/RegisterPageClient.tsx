"use client"

import { RegisterForm } from "@/components/register-form"
import { DemoAuthProvider } from "@/lib/demo-auth"
import Image from "next/image"
import Link from "next/link"

export default function RegisterPageClient() {
  return (
    <DemoAuthProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-1 flex-col items-center justify-center gap-10 p-4 md:flex-row md:gap-20">
          <div className="flex flex-col items-center gap-4 md:flex-1">
            <div className="relative h-40 w-40 md:h-60 md:w-60">
              <Image
                src="/diverse-group-collaborating.png"
                alt="Team Collaboration"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tighter">Remote Team Analytics</h1>
              <p className="text-muted-foreground">Track productivity and engagement for distributed teams</p>
            </div>
          </div>
          <div className="w-full max-w-md md:flex-1">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
              </div>
              <RegisterForm />
              <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoAuthProvider>
  )
}
