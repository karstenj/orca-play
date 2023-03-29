import { nanoid } from 'https://unpkg.com/nanoid@4.0.2/nanoid.js'
import 'https://unpkg.com/@supabase/supabase-js@2'

export default function Share () {
    // Create a single supabase client for interacting with your database
    const { createClient } = supabase
    const supabaseDB = createClient(
        'https://qfxcjflnheydozqmuodf.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeGNqZmxuaGV5ZG96cW11b2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk4NTM1MTMsImV4cCI6MTk5NTQyOTUxM30.aSwuGJJXod9BZVXYSTLvxrzU5puuHXGpFI_07XXsvy8',
    );
    this.initCode = async () => {
        try {
            const initialUrl = window.location.href;
            const hash = initialUrl.split('?')[1]?.split('#')?.[0];
            const codeParam = window.location.href.split('#')[1];
            if (codeParam) {
                // looking like https://karstenj.github.io/orca-play/#ImMzIGUzIg%3D%3D (hash length depends on code length)
                return atob(decodeURIComponent(codeParam || ''));
            } else if (hash) {
                return supabaseDB
                    .from('code')
                    .select('code')
                    .eq('hash', hash)
                    .then(({ data, error }) => {
                    if (error) {
                        console.warn('failed to load hash', err);
                    }
                    if (data.length) {
                        console.log('load hash from database', hash);
                        return data[0].code;
                    }
                });
            }
        } catch (err) {
          console.warn('failed to load code', err);
        }         
    }
    this.handleShare = async (codeToShare) => {
        // generate uuid in the browser
        const hash = nanoid(12);
        const shareUrl = window.location.origin + window.location.pathname + '?' + hash;
        const { data, error } = await supabaseDB.from('code').insert([{ code: codeToShare, hash }]);
        if (!error) {
          // copy shareUrl to clipboard
          await navigator.clipboard.writeText(shareUrl);
          const message = `Link copied to clipboard: ${shareUrl}`;
          alert(message);
          // alert(message);
          console.log(message);
        } else {
          console.log('error', error);
          const message = `Error: ${error.message}`;
          // alert(message);
          console.log(message);
        }
    };
}