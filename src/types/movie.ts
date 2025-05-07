export interface Movie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    runtime: number;
    vote_average: number;
    vote_count: number;
    genres: string[];
    director: {
        name: string;
        profile_path: string;
    } | null;
    cast: Array<{
        name: string;
        character: string;
        profile_path: string;
    }>;
    trailer: {
        key: string;
        name: string;
    } | null;
}

export interface MovieDetails extends Movie {
    backdrop_path: string;
    runtime: number;
    genres: string[];
    credits?: Credits;
    videos?: Videos;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Credits {
    cast: CastMember[];
    crew: CrewMember[];
}

export interface CastMember {
    name: string;
    character: string;
}

export interface CrewMember {
    name: string;
    job: string;
}

export interface Videos {
    results: Video[];
}

export interface Video {
    key: string;
    type: string;
    site: string;
} 