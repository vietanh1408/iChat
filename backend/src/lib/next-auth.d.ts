import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    name: string;
    image: string;
    email: string;
    emailVerified: Date;
  }
}
