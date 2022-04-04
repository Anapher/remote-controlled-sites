import { DomainError } from './shared/communication-types';

export const userNotFound: (participantId: string) => DomainError = (id) => ({
   code: 'SFU/User_Not_Found',
   message: `The user ${id} was not found.`,
   type: 'BadRequest',
});
export const invalidOperation: (message: string) => DomainError = (message) => ({
   code: 'SFU/Invalid_Operation',
   message,
   type: 'BadRequest',
});
