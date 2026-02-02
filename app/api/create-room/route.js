import { supabase } from '../../supabase.js';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { slug, password } = await request.json();
    if (!slug || !password) {
        return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabase
        .from('rooms')
        .insert({ slug, password_hash });

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}