export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    genres: string[];
    vote_average?: number;
    runtime?: number;
    overview?: string;
    backdrop_path?: string | null;
    original_title?: string;
    vote_count?: number;
    trailer?: {
        key: string;
        name: string;
    } | null;
    cast?: Array<{
        name: string;
        character: string;
        profile_path: string;
    }>;
    director?: {
        name: string;
        profile_path: string;
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