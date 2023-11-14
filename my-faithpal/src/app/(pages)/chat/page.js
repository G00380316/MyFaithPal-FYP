"use client"
import useBackendData from "@/hooks/user";

export default function chat() {

  useBackendData();

return (
<div style={{display: 'flex',flexDirection: 'column', justifyContent: 'space-evenly'}}>
    <h1>chat page</h1>
    <p style={{color: 'purple'}}>Hi Welcome!!Nice to meet you</p>
</div>
)
}
