import { Chip as NChip, ChipProps } from '@nextui-org/react';
import { FC, PropsWithChildren, forwardRef } from 'react';
import { cn } from '@/utils';
import { Dot } from 'lucide-react';

export type ChipPropsType = ChipProps & {
  iconType?: 'check' | 'progress' | 'warning' | 'info' | 'error' | 'success';
};

enum ChipIconType {
  check = 'check',
  progress = '#518fe1',
  warning = 'warning',
  info = '#dfdddd',
  error = '#ec2727',
  success = '#1de262',
}

export const Chip: FC<PropsWithChildren<ChipPropsType>> = forwardRef(
  (
    {
      children,
      size = 'sm',
      color = 'default',
      iconType = 'info',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <NChip
        size={size}
        color={color}
        variant="bordered"
        startContent={<Dot size={18} color={ChipIconType[iconType]} />}
        className={cn(className)}
        {...props}
        ref={ref}
      >
        {children}
      </NChip>
    );
  }
);
