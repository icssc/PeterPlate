import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@peterplate/api';

export const trpc = createTRPCReact<AppRouter>();