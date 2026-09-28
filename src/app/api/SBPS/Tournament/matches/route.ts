import { GetActiveTournamentMatches, GetTournamentMatches } from '@/scripts/lib/db/sbps';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    if (id)
        return NextResponse.json(await GetTournamentMatches(id));
    else 
        return NextResponse.json(await GetActiveTournamentMatches());
}