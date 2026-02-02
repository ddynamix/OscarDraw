import { supabase } from '../../../../supabase';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { slug } = await params;
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const password = url.searchParams.get('password');
    
    if (!name || !password) {
        return NextResponse.json({ error: 'Missing name or password' }, { status: 400 });
    }

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

    const { data: person } = await supabase
        .from('participants')
        .select('*')
        .eq('room_id', room.id)
        .eq('name', name)
        .single();

    if (!person) {
        return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

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

    return NextResponse.json({ film: film.title });
}