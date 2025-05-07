import { NextResponse } from 'next/server';

const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!TMDB_ACCESS_TOKEN) {
        console.error('NEXT_PUBLIC_TMDB_API_KEY is not defined');
        return NextResponse.json(
            { error: 'TMDB access token is not configured' },
            { status: 500 }
        );
    }

    try {
        const detailsUrl = `${TMDB_BASE_URL}/movie/${params.id}?append_to_response=credits,videos`;
        console.log('Fetching details for movie ID:', params.id);
        
        const detailsResponse = await fetch(detailsUrl, {
            headers: {
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                'accept': 'application/json'
            }
        });

        if (!detailsResponse.ok) {
            console.error(`Failed to fetch movie details:`, {
                status: detailsResponse.status,
                statusText: detailsResponse.statusText
            });
            return NextResponse.json(
                { error: 'Failed to fetch movie details' },
                { status: detailsResponse.status }
            );
        }

        const details = await detailsResponse.json();
        
        // Get director and cast
        const director = details.credits?.crew?.find((person: any) => person.job === 'Director');
        const cast = details.credits?.cast?.slice(0, 6) || []; // Get first 6 cast members
        
        // Get trailer
        const trailer = details.videos?.results?.find((video: any) => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        // Format the response to match our template
        const movie = {
            id: details.id,
            title: details.title,
            original_title: details.original_title,
            overview: details.overview,
            poster_path: details.poster_path,
            backdrop_path: details.backdrop_path,
            release_date: details.release_date,
            runtime: details.runtime,
            vote_average: details.vote_average,
            vote_count: details.vote_count,
            genres: details.genres?.map((g: any) => g.name) || [], // Use genre names instead of IDs
            director: director ? {
                name: director.name,
                profile_path: director.profile_path
            } : null,
            cast: cast.map((actor: any) => ({
                name: actor.name,
                character: actor.character,
                profile_path: actor.profile_path
            })),
            trailer: trailer ? {
                key: trailer.key,
                name: trailer.name
            } : null
        };

        return NextResponse.json(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch movie details' },
            { status: 500 }
        );
    }
} 