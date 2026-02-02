import { supabase } from '../../../../supabase';
import bcrypt from 'bcryptjs';

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { slug } = req.query;
    const { password } = req.body;

    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!room) return res.status(404).end();
    if (!(await bcrypt.compare(password, room.password_hash)))
        return res.status(403).end();

    const { data: people } = await supabase
        .from('participants')
        .select('*')
        .eq('room_id', room.id);

    const { data: films } = await supabase
        .from('films')
        .select('*')
        .eq('room_id', room.id);

    if (films.length < people.length)
        return res.status(400).json({ error: 'not enough films' });

    shuffle(films);

    await supabase.from('assignments').delete().eq('room_id', room.id);

    await supabase.from('assignments').insert(
        people.map((p, i) => ({
            room_id: room.id,
            participant_id: p.id,
            film_id: films[i].id
        }))
    );

    res.json({ ok: true });
}
