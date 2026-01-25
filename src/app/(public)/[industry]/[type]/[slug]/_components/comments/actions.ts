interface CommentsResult {
  parentComments: any[];
  allComments: any[];
}

export async function getComments(articleId: string): Promise<CommentsResult> {
  return {
    parentComments: [],
    allComments: [],
  };
}
