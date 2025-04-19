import { Module, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
// import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { AccountStatus, Gender, Role } from '@prisma/client';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      transformSchema: (schema) =>
        upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      csrfPrevention: false,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      context: async ({ req, res }): Promise<Context> => {
        return {
          req,
          res,
        };
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    MailModule,
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 5 }),
      )
      .forRoutes('graphql');
  }
  constructor() {
    registerEnumType(Role, {
      name: 'Role',
      description: 'Roles available for the user',
    });
    registerEnumType(AccountStatus, {
      name: 'AccountStatus',
      description: 'Account status of the user',
    });
    registerEnumType(Gender, {
      name: 'Gender',
      description: 'Gender of the user',
    });
  }
}
