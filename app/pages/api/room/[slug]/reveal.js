import { supabase } from '../../../../supabase';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    const { slug } = req.query;
    const { name, password } = req.query;

    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!room) return res.status(404).end();
    if (!(await bcrypt.compare(password, room.password_hash)))
        return res.status(403).end();

    const { data: person } = await supabase
        .from('participants')
        .select('*')
        .eq('room_id', room.id)
        .eq('name', name)
        .single();

    if (!person) return res.status(404).end();

    const { data: assignment } = await supabase
        .from('assignments')
        .select('film_id')
        .eq('participant_id', person.id)
        .single();

    const { data: film } = await supabase
        .from('films')
        .select('title')
        .eq('id', assignment.film_id)
        .single();

    res.json({ film: film.title });
}
