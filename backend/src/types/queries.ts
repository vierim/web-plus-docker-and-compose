import { User } from '../users/entities/user.entity';

export type TUserSearchQuery = { [K in keyof User]?: User[K] };
