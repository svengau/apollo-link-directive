import {
  hasDirectives,
  checkDocument,
  removeDirectivesFromDocument,
  RemoveDirectiveConfig,
} from 'apollo-utilities';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  ApolloLink,
  Observable,
  Operation,
  FetchResult,
  NextLink,
} from 'apollo-link';

interface IDirectiveConfig {
  directive: string;
  callback: (operation: Operation, forward?: NextLink) => void;
  remove?: boolean;
}

export class DirectiveLink extends ApolloLink {
  directivesConfig: IDirectiveConfig[] = [];
  removedCache = new Map();

  constructor(directivesConfig) {
    super();
    if (!directivesConfig || !Array.isArray(directivesConfig)) {
      throw new Error(
        'A DirectiveLink must be initialized with an array of options',
      );
    }

    this.directivesConfig = directivesConfig;
  }

  removeDirectivesFromDocument(query: DocumentNode): DocumentNode {
    const cached = this.removedCache.get(query);
    if (cached) return cached;

    checkDocument(query);
    const directivesToRemove: RemoveDirectiveConfig[] = this.directivesConfig
      .filter(o => o.remove !== false)
      .map(o => ({ name: o.directive }));

    const docClone = removeDirectivesFromDocument(directivesToRemove, query);
    const cleanedQuery = gql(print(docClone));

    this.removedCache.set(query, cleanedQuery);
    return cleanedQuery;
  }

  public request(
    operation: Operation,
    forward: NextLink,
  ): Observable<FetchResult> | null {
    const { query } = operation;

    const directivesToCheck: string[] = this.directivesConfig.map(
      o => o.directive,
    );

    if (hasDirectives(directivesToCheck, query)) {
      this.directivesConfig.map(({ directive, callback }: IDirectiveConfig) => {
        if (hasDirectives([directive], query)) {
          callback(operation, forward);
        }
      });
      operation.query = this.removeDirectivesFromDocument(query);
    }

    return forward ? forward(operation) : null;
  }
}
