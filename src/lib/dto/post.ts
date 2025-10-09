type PostDTO = {
    id: number;
    creatorUserId: string;
    title: string;
    content: string;
    createdAt: number;
    rating: PostRatingDTO;
}

type PostRatingDTO = {
    amount: number;
    average: number;
}