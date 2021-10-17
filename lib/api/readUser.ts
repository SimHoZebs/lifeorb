import { UserSchema } from '../schema/UserSchema';
import apiMiddleware from '../apiMiddleware';

/**
 * Checks if user exists in DB.
 * @param username Leave empty if userId is provided.
 * @param userId Leave empty if username is provided.
 * @returns string; Client or server error
 * @returns null; Request successful but username does not exist
 * @returns User: UserSchema; Request successful and username exists
 */
export default async function readUser(username: string | null = null, userId: string | null = null) {

  return await apiMiddleware<UserSchema | null>(
    {
      method: "GET",
      url: `api/user/`,
      params: { username, userId }
    },
  );
}