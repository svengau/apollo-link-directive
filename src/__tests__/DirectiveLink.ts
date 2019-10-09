import { ApolloLink, execute, makePromise, Observable } from 'apollo-link';

import gql, { disableFragmentWarnings } from 'graphql-tag';
disableFragmentWarnings();

import { DirectiveLink } from '../DirectiveLink';

type Result = { [index: string]: any };

describe('DirectiveLink', async () => {
  it('throws without any config', () => {
    expect.assertions(3);

    expect(() => {
      new DirectiveLink(undefined);
    }).toThrow();
    expect(() => {
      new DirectiveLink({} as any);
    }).toThrow();
    expect(() => {
      new DirectiveLink({ bogus: '' } as any);
    }).toThrow();
  });

  it('call callback on directive and remove it if needed', async () => {
    expect.assertions(7);

    const directiveLink = new DirectiveLink([
      {
        directive: 'sample1',
        callback: (operation, forward) => {
          expect(operation.operationName).toBe('postTitle');
          expect(typeof forward).toBe('function');
        },
      },
      {
        directive: 'sample2',
        callback: (operation, forward) => {
          expect(operation.operationName).toBe('postTitle');
          expect(typeof forward).toBe('function');
        },
      },
      {
        directive: 'sample3',
        callback: (operation, forward) => {
          expect(operation.operationName).toBe('postTitle');
          expect(typeof forward).toBe('function');
        },
        remove: false,
      },
    ]);

    const network = jest.fn(({ query }) => Observable.of(query));

    const link = ApolloLink.from([directiveLink, new ApolloLink(network)]);

    const postTitleQuery = gql`
      query postTitle {
        post @sample1 {
          id
          title @sample2
          desc @sample3
          desc @sample4
        }
      }
    `;

    const data: any = await makePromise<Result>(
      execute(link, {
        operationName: 'postTitle',
        query: postTitleQuery,
      }),
    );

    expect(data).toEqual(gql`
      query postTitle {
        post {
          id
          title
          desc @sample3
          desc @sample4
        }
      }
    `);
  });
});
