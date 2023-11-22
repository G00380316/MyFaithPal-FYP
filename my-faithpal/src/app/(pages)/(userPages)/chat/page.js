import DisplayUser from "@/api/getUser";

export default function chat() {
  return (
    <section>
      <div>
      <h1>chat page</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <p style={{ color: 'purple',paddingRight:10 }}>Hi Welcome!!Nice to meet you</p>
        <DisplayUser />
      </div>
    </section>
      )
  }
