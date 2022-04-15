import { UseFormRegisterReturn } from 'react-hook-form';
import React from 'react';

type UseFormRegisterReturnInputRef = Omit<UseFormRegisterReturn, 'ref'> & {
   inputRef: React.Ref<any>;
};

/**
 * Fixes the register field names from react-hook-form for the TextField from mui (especially rename ref to inputRef)
 * @param param0 register return value from react-hook-form
 * @returns correctly adjusted paramteres for mui textfield
 */
export function wrapForInputRef({ ref, ...rest }: UseFormRegisterReturn): UseFormRegisterReturnInputRef {
   return { inputRef: ref, ...rest };
}
