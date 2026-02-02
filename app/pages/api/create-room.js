import { supabase } from '../../supabase';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { slug, password } = req.body;
    if (!slug || !password) return res.status(400).json({ error: 'missing fields' });

    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabase
        .from('rooms')
        .insert({ slug, password_hash });

    if (error) return res.status(500).json({ error });

    res.json({ ok: true });
}
