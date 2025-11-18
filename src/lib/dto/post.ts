type PostDTO = {
    id: number;
    creatorUserId: string;
    title: string;
    content: string;
    createdAt: Date;
    rating: PostRatingDTO;
}

type PostRatingDTO = {
    amount: number;
    average: number;
}