import { NgModule } from '@angular/core';
import { APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

const uri = 'http://0.0.0.0:3000/payment'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
    return {
        link: httpLink.create({ uri }),
        cache: new InMemoryCache(),
    };
}

@NgModule({
    providers: [
        {
            provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
            useFactory(httpLink: HttpLink): NamedOptions {
                return {
                    payment: {
                        // <-- this settings will be saved by name: newClientName
                        cache: new InMemoryCache(),
                        link: httpLink.create({
                            uri: 'https://api.zerospay.com/v1/public/payment',
                        }),
                    },
                };
            },
            deps: [HttpLink],
        },
    ],
})
export class GraphQLModule {}
