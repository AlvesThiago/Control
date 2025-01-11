'use client' // Indica que este é um Client Component
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'  // Alteração para 'next/navigation'

function Login() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()  // Agora usa o useRouter de 'next/navigation'

  // Tipando o parâmetro 'e' como 'React.FormEvent<HTMLFormElement>'
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validação simples do login com variáveis de ambiente
    const storedUser = process.env.NEXT_PUBLIC_LOGIN_ADMIN
    const storedPassword = process.env.NEXT_PUBLIC_PASSWORD_ADMIN

    if (user === storedUser && password === storedPassword) {
      // Redireciona para a página de administração
      router.push('/admin/management')  // Navegação usando o router do 'next/navigation'
    } else {
      setError('Usuário ou senha inválidos')
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-[url("/FundoLogin.svg")] bg-cover bg-center'>
        <Card className='w-[400px] shadow-xl'>
            <CardHeader>
                <CardTitle className='text-3xl text-center p-3'>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <Label htmlFor='user' className='font-bold'>UserAdmin</Label>
                        <Input 
                          type='text' 
                          id='user' 
                          value={user} 
                          onChange={(e) => setUser(e.target.value)} 
                        />
                    </div>
                    <div>
                        <Label htmlFor='senha' className='font-bold'>Password</Label>
                        <Input 
                          type='password' 
                          id='senha' 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    {error && <div className='text-red-500 mt-2'>{error}</div>}
                    <div className='flex justify-end mt-5'>
                        <Button type='submit'>Login</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  )
}

export default Login
