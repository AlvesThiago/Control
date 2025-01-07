'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React from 'react'

function Login() {
  return (
    <div className='flex justify-center items-center min-h-screen bg-blue-900'>
        <Card className='w-[400px] shadow-xl'>
            <CardHeader>
                <CardTitle className='text-3xl text-center p-3'>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className='mb-4'>
                        <Label htmlFor='user' className='font-bold'>UserAdmin</Label>
                        <Input type='text'/>
                    </div>
                    <div>
                        <Label htmlFor='senha' className='font-bold'>Password</Label>
                        <Input type='password'/>
                    </div>
                </form>
            </CardContent>
            <CardFooter className='flex justify-end'>
                <Link href={'/admin/management'}>
                    <Button>Login</Button>
                </Link>
                
            </CardFooter>
        </Card>
    </div>
  )
}

export default Login