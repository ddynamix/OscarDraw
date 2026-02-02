import { supabase } from '../../../../supabase';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

export async function POST(request, { params }) {
    const { slug } = await params;
    const { password } = await request.json();

    const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    if (!(await bcrypt.compare(password, room.password_hash))) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }

    const { data: people } = await supabase
        .from('participants')
        .select('*')
        .eq('room_id', room.id);

    const { data: films } = await supabase
        .from('films')
        .select('*')
        .eq('room_id', room.id);

    if (films.length < people.length) {
        return NextResponse.json({ error: 'not enough films' }, { status: 400 });
    }

    shuffle(films);

    await supabase.from('assignments').delete().eq('room_id', room.id);

    await supabase.from('assignments').insert(
        people.map((p, i) => ({
            room_id: room.id,
            participant_id: p.id,
            film_id: films[i].id
        }))
    );

    return NextResponse.json({ ok: true });
}