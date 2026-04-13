export default function Home() {
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f8f9fa',fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:'48px',fontWeight:'800',color:'#1a1a2e',marginBottom:'8px'}}>HelpFlow</h1>
      <p style={{fontSize:'18px',color:'#666',marginBottom:'40px',textAlign:'center'}}>Connect with people who need help or offer your services</p>
      <div style={{display:'flex',gap:'16px'}}>
        <button style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'12px',padding:'14px 28px',fontSize:'16px',fontWeight:'600',cursor:'pointer'}}>I Need Help</button>
        <button style={{background:'#fff',color:'#4f46e5',border:'2px solid #4f46e5',borderRadius:'12px',padding:'14px 28px',fontSize:'16px',fontWeight:'600',cursor:'pointer'}}>I Offer Help</button>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}
