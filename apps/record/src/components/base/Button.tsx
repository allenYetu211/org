import { Button as NButton, ButtonProps } from '@nextui-org/react';
import { FC, PropsWithChildren, forwardRef } from 'react';
import { cn } from '@/utils';

export const Button: FC<PropsWithChildren<ButtonProps>> = forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <NButton
        size={props.size ?? 'sm'}
        className={cn('#ced3db', className)}
        {...props}
        ref={ref}
      >
        {children}
      </NButton>
    );
  }
);
