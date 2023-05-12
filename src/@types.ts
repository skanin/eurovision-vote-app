import { Timestamp } from "firebase/firestore";

type vote = {
    id: string;
    userId: string;
    country: string;
    score: number;
    type: string;
    timestamp: Timestamp;
};

type country = {
	id: string;
	countryName: string;
    score: number;
    flagUrl: string;
};

type DatabaseUser = {
	id: string;
    name: string;
    bgColor: string;
};



export type { DatabaseUser, country, vote };
