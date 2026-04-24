import { nanoid } from 'https://unpkg.com/nanoid@4.0.2/nanoid.js'

const isDesktop = window.location.protocol === 'file:'

let supabaseDB = null
let supabaseLoaded = false

async function getSupabase () {
    if (isDesktop) return null
    if (supabaseLoaded) return supabaseDB
    supabaseLoaded = true
    try {
        await import('https://unpkg.com/@supabase/supabase-js@2')
        const { createClient } = supabase
        supabaseDB = createClient(
            'https://qfxcjflnheydozqmuodf.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeGNqZmxuaGV5ZG96cW11b2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk4NTM1MTMsImV4cCI6MTk5NTQyOTUxM30.aSwuGJJXod9BZVXYSTLvxrzU5puuHXGpFI_07XXsvy8',
        )
    } catch (err) {
        console.warn('Supabase not available, share feature disabled.', err)
    }
    return supabaseDB
}

export default function Share () {
    this.initCode = async () => {
        try {
            const codeParam = window.location.href.split('#')[1]
            if (codeParam) {
                return atob(decodeURIComponent(codeParam || ''))
            }
            const db = await getSupabase()
            if (!db) { return }
            const hash = window.location.href.split('?')[1]?.split('#')?.[0]
            if (hash) {
                return db
                    .from('code')
                    .select('code')
                    .eq('hash', hash)
                    .then(({ data, error }) => {
                        if (error) { console.warn('failed to load hash', error) }
                        if (data.length) {
                            console.log('load hash from database', hash)
                            return data[0].code
                        }
                    })
            }
        } catch (err) {
            console.warn('failed to load code', err)
        }
    }

    this.handleShare = async (codeToShare) => {
        const db = await getSupabase()
        if (!db) {
            const encoded = encodeURIComponent(btoa(codeToShare))
            const shareUrl = `https://karstenj.github.io/orca-play/#${encoded}`
            await navigator.clipboard.writeText(shareUrl)
            alert(`Link copied to clipboard: ${shareUrl}`)
            return
        }
        const hash = nanoid(12)
        const shareUrl = window.location.origin + window.location.pathname + '?' + hash
        const { error } = await db.from('code').insert([{ code: codeToShare, hash }])
        if (!error) {
            await navigator.clipboard.writeText(shareUrl)
            const message = `Link copied to clipboard: ${shareUrl}`
            alert(message)
            console.log(message)
        } else {
            console.log('error', error)
            console.log(`Error: ${error.message}`)
        }
    }
}