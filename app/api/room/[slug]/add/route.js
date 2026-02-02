import { supabase } from '../../../../supabase';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
    const { slug } = await params;
    const { password, participants = [], films = [] } = await request.json();

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

    return NextResponse.json({ ok: true });
}