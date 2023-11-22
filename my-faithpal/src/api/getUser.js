async function getUser() {
    const res = await fetch('http://localhost:8080/api', {
        next: {
            revalidate: 0
        }
    })

    return res.json()
}

export default async function DisplayUser() {
    const responseData = await getUser()
    const users = responseData.users;

    return (
        <>
        {users.map((user,index) => (
        <p key={index}>{user}</p>
        ))}
        </>
    )
}