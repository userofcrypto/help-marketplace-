import { useState, useEffect } from 'react'

export default function Home() {
  const [view, setView] = useState('welcome')
  const [requests, setRequests] = useState([])
  const [offers, setOffers] = useState([])

  useEffect(() => {
    if (view !== 'welcome') {
      fetchData()
    }
  }, [view])

  async function fetchData() {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      const { data: reqs } = await supabase.from('requests').select('*')
      const { data: offs } = await supabase.from('offers').select('*')
      setRequests(reqs || [])
      setOffers(offs || [])
    } catch (e) {
      console.log(e)
    }
  }

  if (view === 'welcome') {
    return (
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f8f9fa',padding:'24px',fontFamily:'sans-serif'}}>
        <h1 style={{fontSize:'48px',fontWeight:'800',color:'#1a1a2e',marginBottom:'8px'}}>HelpFlow</h1>
        <p style={{fontSize:'18px',color:'#666',marginBottom:'40px',textAlign:'center'}}>Connect with people who need help or offer your services</p>
        <div style={{display:'flex',gap:'16px',marginBottom:'24px'}}>
          <button onClick={() => setView('requests')} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'12px',padding:'14px 28px',fontSize:'16px',fontWeight:'600',cursor:'pointer'}}>I Need Help</button>
          <button onClick={() => setView('offers')} style={{background:'#fff',color:'#4f46e5',border:'2px solid #4f46e5',borderRadius:'12px',padding:'14px 28px',fontSize:'16px',fontWeight:'600',cursor:'pointer'}}>I Offer Help</button>
        </div>
        <span onClick={() => setView('requests')} style={{color:'#4f46e5',cursor:'pointer',textDecoration:'underline'}}>Browse all posts</span>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:'#f8f9fa',fontFamily:'sans-serif'}}>
      <div style={{background:'#fff',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <h1 onClick={() => setView('welcome')} style={{fontSize:'24px',fontWeight:'800',color:'#1a1a2e',margin:'0',cursor:'pointer'}}>HelpFlow</h1>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={() => setView('requests')} style={{background: view==='requests' ? '#ede9fe' : 'transparent',color: view==='requests' ? '#4f46e5' : '#666',border:'none',padding:'8px 16px',borderRadius:'8px',cursor:'pointer',fontWeight: view==='requests' ? '600' : '400'}}>Requests</button>
          <button onClick={() => setView('offers')} style={{background: view==='offers' ? '#ede9fe' : 'transparent',color: view==='offers' ? '#4f46e5' : '#666',border:'none',padding:'8px 16px',borderRadius:'8px',cursor:'pointer',fontWeight: view==='offers' ? '600' : '400'}}>Offers</button>
        </div>
        <button onClick={() => setView('post')} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 16px',cursor:'pointer',fontWeight:'600'}}>+ Post</button>
      </div>

      <div style={{padding:'24px',maxWidth:'800px',margin:'0 auto'}}>
        {view === 'requests' && (
          <div>
            <h2 style={{fontSize:'22px',fontWeight:'700',marginBottom:'16px'}}>Help Requests</h2>
            {requests.length === 0 && <p style={{color:'#999',textAlign:'center',padding:'40px'}}>No requests yet. Be the first to post.</p>}
            {requests.map(req => (
              <div key={req.id} style={{background:'#fff',borderRadius:'16px',padding:'20px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
                <h3 style={{fontSize:'18px',fontWeight:'600',marginBottom:'8px'}}>{req.title}</h3>
                <p style={{color:'#555',marginBottom:'12px'}}>{req.description}</p>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  {req.category && <span style={{background:'#ede9fe',color:'#4f46e5',borderRadius:'20px',padding:'4px 12px',fontSize:'13px'}}>{req.category}</span>}
                  {req.urgency && <span style={{background:'#ede9fe',color:'#4f46e5',borderRadius:'20px',padding:'4px 12px',fontSize:'13px'}}>{req.urgency}</span>}
                  {req.location && <span style={{background:'#ede9fe',color:'#4f46e5',borderRadius:'20px',padding:'4px 12px',fontSize:'13px'}}>{req.location}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'offers' && (
          <div>
            <h2 style={{fontSize:'22px',fontWeight:'700',marginBottom:'16px'}}>Service Offers</h2>
            {offers.length === 0 && <p style={{color:'#999',textAlign:'center',padding:'40px'}}>No offers yet. Be the first to post.</p>}
            {offers.map(offer => (
              <div key={offer.id} style={{background:'#fff',borderRadius:'16px',padding:'20px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
                <h3 style={{fontSize:'18px',fontWeight:'600',marginBottom:'8px'}}>{offer.service_name}</h3>
                <p style={{color:'#555',marginBottom:'12px'}}>{offer.description}</p>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  {offer.category && <span style={{background:'#ede9fe',color:'#4f46e5',borderRadius:'20px',padding:'4px 12px',fontSize:'13px'}}>{offer.category}</span>}
                  {offer.location && <span style={{background:'#ede9fe',color:'#4f46e5',borderRadius:'20px',padding:'4px 12px',fontSize:'13px'}}>{offer.location}</span>}
                  {offer.price && <span style={{background:'#ede9fe',color:'#4f46e5',borderRadius:'20px',padding:'4px 12px',fontSize:'13px'}}>{offer.price}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'post' && (
          <PostForm onBack={() => setView('requests')} />
        )}
      </div>
    </div>
  )
}

function PostForm({ onBack }) {
  const [type, setType] = useState('request')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState('flexible')
  const [budget, setBudget] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      if (type === 'request') {
        await supabase.from('requests').insert([{ title, description, category, location, urgency, budget, status: 'open' }])
      } else {
        await supabase.from('offers').insert([{ service_name: serviceName, description, category, location, price, status: 'active' }])
      }
      setDone(true)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div style={{textAlign:'center',padding:'60px'}}>
        <h2 style={{fontSize:'28px',fontWeight:'700',color:'#4f46e5',marginBottom:'16px'}}>Posted!</h2>
        <p style={{color:'#666',marginBottom:'24px'}}>Your post is now live.</p>
        <button onClick={onBack} style={{background:'#4f46e5',color:'#fff',border:'none',borderRadius:'12px',padding:'14px 28px',fontSize:'16px',cursor:'pointer'}}>Back to Feed</button>
      </div>
    )
  }

  const inputStyle = {width:'100%',padding:'12px',borderRadius:'10px',border:'1.5px solid #e5e7eb',fontSize:'15px',marginBottom:'12px',boxSizing:'border-box',fontFamily:'sans-serif'}

  return (
    <div style={{maxWidth:'600px',margin:'0 auto'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:'#4f46e5',fontSize:'15px',cursor:'pointer',marginBottom:'16px'}}>← Back</button>
      <h2 style={{fontSize:'22px',fontWeight:'700',marginBottom:'20px'}}>Post Something</h2>
      <div style={{display:'flex',gap:'12px',marginBottom:'24px'}}>
        <button onClick={() => setType('request')} style={{flex:1,background: type==='request' ? '#4f46e5' : '#fff',color: type==='request' ? '#fff' : '#4f46e5',border:'2px solid #4f46e5',borderRadius:'12px',padding:'12px',fontWeight:'600',cursor:'pointer'}}>I Need Help</button>
        <button onClick={() => setType('offer')} style={{flex:1,background: type==='offer' ? '#4f46e5' : '#fff',color: type==='offer' ? '#fff' : '#4f46e5',border:'2px solid #4f46e5',borderRadius:'12px',padding:'12px',fontWeight:'600',cursor:'pointer'}}>I Offer Help</button>
      </div>

      {type === 'request' ? (
        <>
          <input style={inputStyle} placeholder="What do you need help with?" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea style={{...inputStyle, minHeight:'100px'}} placeholder="Describe what you need..." value={description} onChange={e => setDescription(e.target.value)} />
          <input style={inputStyle} placeholder="Category (e.g. Delivery, Cleaning, Tech)" value={category} onChange={e => setCategory(e.target.value)} />
          <input style={inputStyle} placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
          <select style={inputStyle} value={urgency} onChange={e => setUrgency(e.target.value)}>
            <option value="immediate">Immediate</option>
            <option value="soon">Soon</option>
            <option value="flexible">Flexible</option>
          </select>
          <input style={inputStyle} placeholder="Budget (optional)" value={budget} onChange={e => setBudget(e.target.value)} />
        </>
      ) : (
        <>
          <input style={inputStyle} placeholder="Service name" value={serviceName} onChange={e => setServiceName(e.target.value)} />
          <textarea style={{...inputStyle, minHeight:'100px'}} placeholder="Describe your service..." value={description} onChange={e => setDescription(e.target.value)} />
          <input style={inputStyle} placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <input style={inputStyle} placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
          <input style={inputStyle} placeholder="Price or terms" value={price} onChange={e => setPrice(e.target.value)} />
        </>
      )}

      <button onClick={handleSubmit} disabled={loading} style={{width:'100%',background:'#4f46e5',color:'#fff',border:'none',borderRadius:'12px',padding:'16px',fontSize:'16px',fontWeight:'600',cursor:'pointer'}}>
        {loading ? 'Posting...' : 'Post Now'}
      </button>
    </div>
  )
}
