import Link from "next/link"

export default function login() {
    return (
    <>
    <h1>Login page</h1><div style={{ padding: 10 }}>
    <Link href='/auth/register'><p>Haven't registered yet click here!!!</p></Link>
    </div>
    </>
    )
}
