import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [view, setView] = useState('welcome')
  const [requests, setRequests] = useState([])
  const [offers, setOffers] = useState([])

  useEffect(() => {
    fetchRequests()
    fetchOffers()
  }, [])

  async function fetchRequests() {
    const { data } = await supabase.from('requests').select('*').eq('status', 'open')
    setRequests(data || [])
  }

  async function fetchOffers() {
    const { data } = await supabase.from('offers').select('*').eq('status', 'active')
    setOffers(data || [])
  }

  if (view === 'welcome') {
    return (
      <div style={styles.welcome}>
        <h1 style={styles.title}>HelpFlow</h1>
        <p style={styles.subtitle}>Connect with people who need help or offer your services</p>
        <div style={styles.buttonRow}>
          <button style={styles.btnPrimary} onClick={() => setView('requests')}>I Need Help</button>
          <button style={styles.btnSecondary} onClick={() => setView('offers')}>I Offer Help</button>
        </div>
        <p style={styles.browseLink} onClick={() => setView('feed')}>Browse all posts</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>HelpFlow</h1>
        <div style={styles.tabs}>
          <button style={view === 'feed' || view === 'requests' ? styles.tabActive : styles.tab} onClick={() => setView('requests')}>Requests</button>
          <button style={view === 'offers' ? styles.tabActive : styles.tab} onClick={() => setView('offers')}>Offers</button>
        </div>
        <button style={styles.btnSmall} onClick={() => setView('post')}>+ Post</button>
      </div>

      {(view === 'requests' || view === 'feed') && (
        <div style={styles.feed}>
          <h2 style={styles.feedTitle}>Help Requests</h2>
          {requests.length === 0 && <p style={styles.empty}>No requests yet. Be the first to post.</p>}
          {requests.map(req => (
            <div key={req.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{req.title}</h3>
              <p style={styles.cardText}>{req.description}</p>
              <div style={styles.cardFooter}>
                <span style={styles.tag}>{req.category}</span>
                <span style={styles.tag}>{req.urgency}</span>
                <span style={styles.tag}>{req.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'offers' && (
        <div style={styles.feed}>
          <h2 style={styles.feedTitle}>Service Offers</h2>
          {offers.length === 0 && <p style={styles.empty}>No offers yet. Be the first to post.</p>}
          {offers.map(offer => (
            <div key={offer.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{offer.service_name}</h3>
              <p style={styles.cardText}>{offer.description}</p>
              <div style={styles.cardFooter}>
                <span style={styles.tag}>{offer.category}</span>
                <span style={styles.tag}>{offer.location}</span>
                <span style={styles.tag}>{offer.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'post' && <PostForm onBack={() => setView('feed')} onSuccess={() => { fetchRequests(); fetchOffers(); setView('feed') }} />}
    </div>
  )
}

function PostForm({ onBack, onSuccess }) {
  const [type, setType] = useState('request')
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', urgency: 'flexible', budget: '', service_name: '', price: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    if (type === 'request') {
      await supabase.from('requests').insert([{ title: form.title, description: form.description, category: form.category, location: form.location, urgency: form.urgency, budget: form.budget, status: 'open' }])
    } else {
      await supabase.from('offers').insert([{ service_name: form.service_name, description: form.description, category: form.category, location: form.location, price: form.price, status: 'active' }])
    }
    setLoading(false)
    onSuccess()
  }

  return (
    <div style={styles.form}>
      <button onClick={onBack} style={styles.back}>← Back</button>
      <h2 style={styles.feedTitle}>Post Something</h2>
      <div style={styles.buttonRow}>
        <button style={type === 'request' ? styles.btnPrimary : styles.btnSecondary} onClick={() => setType('request')}>I Need Help</button>
        <button style={type === 'offer' ? styles.btnPrimary : styles.btnSecondary} onClick={() => setType('offer')}>I Offer Help</button>
      </div>
      {type === 'request' ? (
        <>
          <input style={styles.input} placeholder="What do you need help with?" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <textarea style={styles.textarea} placeholder="Describe what you need in detail..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input style={styles.input} placeholder="Category (e.g. Delivery, Cleaning, Tech)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          <input style={styles.input} placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          <select style={styles.input} value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})}>
            <option value="immediate">Immediate</option>
            <option value="soon">Soon</option>
            <option value="flexible">Flexible</option>
          </select>
          <input style={styles.input} placeholder="Budget (optional)" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
        </>
      ) : (
        <>
          <input style={styles.input} placeholder="Service name" value={form.service_name} onChange={e => setForm({...form, service_name: e.target.value})} />
          <textarea style={styles.textarea} placeholder="Describe your service..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input style={styles.input} placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          <input style={styles.input} placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          <input style={styles.input} placeholder="Price or terms" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
        </>
      )}
      <button style={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>{loading ? 'Posting...' : 'Post Now'}</button>
    </div>
  )
}

const styles = {
  welcome: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: 24 },
  title: { fontSize: 48, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 40, textAlign: 'center' },
  buttonRow: { display: 'flex', gap: 16, marginBottom: 24 },
  btnPrimary: { background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  btnSecondary: { background: '#fff', color: '#4f46e5', border: '2px solid #4f46e5', borderRadius: 12, padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  btnSmall: { background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  browseLink: { color: '#4f46e5', cursor: 'pointer', textDecoration: 'underline' },
  container: { minHeight: '100vh', background: '#f8f9fa' },
  header: { background: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  logo: { fontSize: 24, fontWeight: 800, color: '#1a1a2e', margin: 0 },
  tabs: { display: 'flex', gap: 8 },
  tab: { background: 'transparent', border: 'none', padding: '8px 16px', fontSize: 15, color: '#666', cursor: 'pointer', borderRadius: 8 },
  tabActive: { background: '#ede9fe', border: 'none', padding: '8px 16px', fontSize: 15, color: '#4f46e5', fontWeight: 600, cursor: 'pointer', borderRadius: 8 },
  feed: { padding: 24, maxWidth: 800, margin: '0 auto' },
  feedTitle: { fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 },
  empty: { color: '#999', textAlign: 'center', padding: 40 },
  card: { background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 },
  cardText: { fontSize: 15, color: '#555', marginBottom: 12 },
  cardFooter: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  tag: { background: '#ede9fe', color: '#4f46e5', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 500 },
  form: { padding: 24, maxWidth: 600, margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#4f46e5', fontSize: 15, cursor: 'pointer', marginBottom: 16 },
  input: { width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 15, marginBottom: 12, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: 12, borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 15, marginBottom: 12, minHeight: 100, boxSizing: 'border-box' },
}
