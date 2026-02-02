import { supabase } from '../../../../supabase';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { slug } = req.query;
    const { password, participants = [], films = [] } = req.body;

    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!room) return res.status(404).end();
    if (!(await bcrypt.compare(password, room.password_hash)))
        return res.status(403).end();

    if (participants.length) {
        await supabase.from('participants').insert(
            participants.map(name => ({ room_id: room.id, name }))
        );
    }

    if (films.length) {
        await supabase.from('films').insert(
            films.map(title => ({ room_id: room.id, title }))
        );
    }

    res.json({ ok: true });
}
