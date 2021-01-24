import gql from 'graphql-tag';

export const QUERY_ME = gql`
    me {
      _id
      username
      email
      savedBooks {
      title
      bookId
      authors
      image
    description
    link
    }
  }
}
`;


